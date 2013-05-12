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
					currentUser: opts.currentUser
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
