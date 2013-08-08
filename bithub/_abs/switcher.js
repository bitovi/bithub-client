steal(
	'can',
	'bithub/homepage',
	'bithub/profile',
	'bithub/rewards',
	'bithub/admin',
	function(can, Homepage, Profile, Rewards, AdminPanels){

		return can.Control.extend({
			defaults : { 
				routeAttr: 'page',
				views: {
					homepage: Homepage,
					profile: Profile,
					rewards: Rewards,
					admin: AdminPanels
				}
			}
		}, {

			init: function( elem, opts ){
				this.initControl( can.route.attr(this.options.routeAttr) );
			},

			'{can.route} {routeAttr}': function( route, ev, newVal, oldVal ) {
				this.initControl( newVal );
			},

			initControl: function(currentPage) {
				var control = this.options.views[currentPage],
					$div = $('<div/>'),
					options = can.extend({}, this.options);

				delete options.views;

				if (control) {
					new control($div, options);
					this.element.html( $div );
				} else {
					console.log(currentPage);
					console.log(this.options.views);
				}
			}
		});
	});
