steal(
	'can',
	'./init.mustache',
	function(can, initView, User){
		return can.Control({
			defaults : {}
		},	{
			init : function( elem, opts ){

				this.element.html(initView({
					currentUser: opts.currentUser
				}));
			}
		});
	});
