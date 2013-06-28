steal(
	'can',
	'./init.mustache',
	'bithub/profile/_navbar.mustache',
	function(can, initView, NavbarPartial, User){
		return can.Control({
			defaults : {}
		},	{
			init : function( elem, opts ){

				this.element.html(initView({
					currentUser: opts.currentUser,
					profileRoute: can.route.url({page: 'profile'}),
					activityListRoute: can.route.url({page: 'activities'})
				}, {
					helpers: {
						getPoints: function( opts ) {
							var value = this.value || this.authorship_value;
							if (value > 0) {
								return "+" + value;
							} else if ( value == 0 ) {
								return value;
							} else {
								return "-" + value;
							}
						}
					},
					partials: {
						navbarPartial: NavbarPartial
					}
				}));
			}
		});
	});
