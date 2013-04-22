steal('can',
	  './init.mustache',
	  'bithub/assets/styles/app.css',
	  'vendor/bootstrap',
	  function(can, initView){
		  /**
		   * @class ui/smartselector
		   * @alias Smartselector   
		   */
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {
					  break: 3
				  }
			  },
			  /** @Prototype */
			  {
				  init : function( elem, options ){
					  var self = this,
						  items = self.options.items;
					  
					  self.element.html( initView( {
						  default: self.options.default,
						  items: items,
						  break: self.options.break
					  }) );
				  },

				  'a.item click': function(el, ev) {
					  this.options.state( can.data(el, 'item').name );

					  ev.preventDefault();
				  }

			  });
	  });
