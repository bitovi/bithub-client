steal('can','./init.mustache', function(can, initView){

    return can.Control(
		{
			defaults : {}
		}, {
			init : function( elem, opts ){
				elem.html(initView({
					event: {}
					//event: some Event model
				}));
			}
		});
});
