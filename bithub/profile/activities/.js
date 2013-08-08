steal('can','./init.ejs', function(can, initView){
    /**
     * @class bithub/profile/activities/
	 * @alias    
     */
    return can.Control(
	/** @Static */
	{
		defaults : {}
	},
	/** @Prototype */
	{
		init : function(){
			this.element.html(initView({
				message: "Hello World from "
			}));
		}
	});
});