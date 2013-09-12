steal(
	'can',
	'bithub/homepage',
	'bithub/event_details',
	'bithub/profile/earnpoints',
	'bithub/profile/rewards',
	'bithub/profile',
	'bithub/admin',
	'./no_permissions.ejs',
	'bithub/helpers/permission_checker.js',
	function(can, Homepage, EventDetails, EarnPoints, Rewards, Profile, AdminPanels, noPermsView, pc) {
		
		return can.Control.extend({
			defaults : { 
				pages: {
					'homepage': Homepage,
					'eventdetails': EventDetails,
					'earnpoints': EarnPoints,
					'rewards': Rewards,
					'profile': Profile,
					'admin': AdminPanels
				}
			}
		}, {

			init: function( elem, opts ){
				this.initControl( can.route.attr('page') );
			},

			'{can.route} page': function( route, ev, newVal, oldVal ) {
				this.initControl( newVal );
			},
			
			initControl: function(currentPage) {
				var control = this.options.pages[currentPage],
					$div = $('<div/>');

				if (!pc.hasPermissions(this.options.currentUser, control)) {
					this.element.html(noPermsView());
				} else if (!_.isEqual(currentPage, this._currentPage)) {
					new control($div, this.options);
					this.element.html( $div );
					this._currentPage = currentPage;
				}
			},

			'{currentUser} isLoggedIn' : function () {
				var self = this;
				setTimeout(function() {
					self.initControl(can.route.attr('page'))
				}, 0);
			}
		});
	}
);
