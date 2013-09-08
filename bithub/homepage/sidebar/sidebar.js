steal(
	'can',
	'./sidebar.mustache',
	'bithub/homepage/sidebar/leaderboard',
	'bithub/models/reward.js',
	'bithub/helpers/mustacheHelpers.js',
	function(can, sidebarView, Leaderboard, Reward){

		return can.Control.extend({
			defaults : {
				rewards: new Bithub.Models.Reward.List()
			}
		}, {
			init : function( elem, opts ) {
				var self = this,
					rewards = this.options.rewards,
					user = this.options.currentUser;

				Reward.findAll({order: 'point_minimum'}, function( data ) {
					rewards.replace( data );
				});

				elem.html(sidebarView({
					user: user,
					rewards: rewards,
					routes: {
						earnpoints: function() {
							var params = {
								view: 'earnpoints',
								page: user.isLoggedIn() ? 'profile' : 'homepage'
							}
								
							return can.route.url( params )
						}
					}
				}, {
					helpers: {
						iterRewards: function( opts ) {
							var buffer = "",
								swagUrl = can.route.url({view: 'swag'}),
								start = 0,
								stop = 2;
							
							if( user.isLoggedIn() ) {
								swagUrl = can.route.url({page: 'profile', view: 'swag'});
								start = rewards.nextRewardIdx( user.attr('achievements') );
								stop = start + 2;
							} else {
								if( rewards.attr('length') > 2 ) {
									start = _.random(0, rewards.attr('length')-2),
									stop = start + 2;
								}
							}
							
							for( var i = start; i < stop; i++ ) {
								buffer += opts.fn({
									reward: rewards.attr(i),
									swagUrl: swagUrl
								});
							}

							return buffer;
						}
					}
				}));
				
				if( opts.currentUser.isLoggedIn() ) {
					this.matchRewards();
				}
				
				new Leaderboard(elem.find('#leaderboard'), opts);
			},

			'{currentUser} isLoggedIn' : "matchRewards",
			'{rewards} length': "matchRewards",
			
			matchRewards: function() {
				this.options.rewards.matchAchievements( this.options.currentUser.attr('achievements') );
			},

			'#twitter-modal-btn click': function( el, ev ) {
				ev.preventDefault();
				this.options.modals.showTwitter();
			},

			'#show-new-post-form-btn click': function( el, ev ) {
				ev.preventDefault();
				this.options.newpostVisibility(true);
			}
		})
	}
);
