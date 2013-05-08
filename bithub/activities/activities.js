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
					helpers: {},
					partials: {
						navbarPartial: NavbarPartial
					}
				}));
			}
		});
	});
