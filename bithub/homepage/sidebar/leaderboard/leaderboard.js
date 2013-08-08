steal(
	'can',
	'./leaderboard.mustache',
	'bithub/models/user.js',
	'can/observe/delegate',
	'bithub/helpers/mustacheHelpers.js',
	function(can, leaderBoardView, User){

		var defaultParams = {
			cached: true
			//order: 'score:desc',
			//limit: 6
		};

		var rank = can.compute( function( newVal ) {
			var current = 0;
			if (newVal) { current = newVal; }
			return current;
		});

		var breakAt = can.compute( function() {
			return (rank() > 7) ? rank()-1 : 0;
		});

		var topLength = can.compute( function() {
			if (rank() < 6) {
				return 6;
			} else if (rank() < 8) {
				return rank();
			} else {
				return 5;
			}
		});
		
		return can.Control.extend({
			defaults : {
				users: new Bithub.Models.User.List()
			}
		}, {
			init : function( elem, opts ) {
				this.element.html(leaderBoardView( {
					users: opts.users,
					currentUser: opts.currentUser,
					breakAt: breakAt,
					topLength: topLength
				}, {
					isLoggedin: function (opts) {
						return (this.loggedIn() ? 'active' : '');
					}
				}));

				this.updateLeaderboard();
			},

			'{currentUser} loggedInDelayed change': function( user, ev, attr, how, newVal, oldVal ) {
				newVal == true ? this.determineRank() : rank(0);
			},

			'{users} length': function () {
				this.determineRank();
			},

			determineRank: function () {
				var self = this;

				this.options.users.each(function (user, i) {							  
					if (self.options.currentUser.attr('id') === user.attr('id')) {
						user.attr('loggedIn', true); // otherwise won't mark user on first login
						rank( i );
					}
				});
			},

			updateLeaderboard: function( params ) {
				var self = this;

				User.findAll( defaultParams, function (data) {
					self.options.users.replace(data);
				});
			}

		});
	}
);
