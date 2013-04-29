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
					}));
				},

				/*
				'{can.route} page': function( data, ev, newVal, oldVal ) {
					  if ( can.route.attr('page') === 'profile') {
						  this.element.show();
					  } else {
						  this.element.hide();
					  }
				}
				 */
			});
	});
