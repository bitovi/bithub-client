steal(
	'can',
	'./init.mustache',
	function(can, initView, User){
		return can.Control({
			defaults : {}
		},	{
			init : function(){

				this.element.html(initView({}));
			}
		});
	});
