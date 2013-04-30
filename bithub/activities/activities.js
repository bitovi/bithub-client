steal(
	'can',
	'./init.mustache',
	function(can, initView){
		return can.Control({
			defaults : {}
		},	{
			init : function(){
				this.element.html(initView({}));
			}
		});
	});
