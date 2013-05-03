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
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function( elem, opts ){
					  var self = this,
						  items = opts.items;
					  
					  self.element.html( initView( {
						  htmlId: opts.htmlId,
						  defaultOption: opts.defaultOption,
						  items: items,
						  breakIdx: opts.breakIdx || 3
					  }) );
				  },

				  'a.item click': function(el, ev) {
					  this.options.state( can.data(el, 'item').name );

					  ev.preventDefault();
				  }

			  });
	  });
