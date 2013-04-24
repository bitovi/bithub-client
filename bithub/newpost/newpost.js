steal(
	'can',
	'./init.mustache',
	function(can, initView){
		/**
		 * @class bithub/newpost
		 * @alias Newpost   
		 */
		return can.Control('Bithub.Newpost',
			/** @Static */
			{
				defaults : {}
			},
			/** @Prototype */
			{
				init : function( el, options ){
					this.element.html(initView({
						projects: options.projects
					}));
				},

				'{visibility} change': function( el, ev ) {
					this.options.visibility() ? this.element.slideDown() : this.element.slideUp();
				}
				
			});
	});
