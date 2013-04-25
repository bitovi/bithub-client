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

				'#hide-newpost-form-btn click': function( el, ev ) {
					ev.preventDefault();
					this.options.visibility( !this.options.visibility() );
				},

				'{visibility} change': function( el, ev ) {
					this.options.visibility() ? this.element.slideDown() : this.element.slideUp();
				},

				'form submit': function( el, ev ) {
					ev.preventDefault();

					//
					console.log("submitted");
				}
				
			});
	});
