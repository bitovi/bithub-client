steal('can',
	  './init.mustache',
	  'vendor/bootstrap.js',
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
				  init : function(){
					  var self = this,
						  items = self.options.items;
					  
					  self.element.html(initView({
						  default: self.options.default,
						  outlinedItems: items.slice( 0, self.options.break ),
						  items: items.slice( self.options.brake, items.length )
					  }));
				  },
				  
				  'a.item click': function(el, ev) {
					  this.options.state( can.data(el, 'item').name );

					  ev.preventDefault();
				  }

			  });
	  });
