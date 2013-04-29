steal(
	'can',
	'./init.mustache',
	function(can, initView){
		/**
		 * @class bithub/profile
		 * @alias Profile   
		 */
		return can.Control(
			/** @Static */
			{
				defaults : {}
			},
			/** @Prototype */
			{
				init : function( el, opts ) {

					this.element.html(initView({
						user: opts.currentUser
					}));
				}

			});
	});
