steal('can',
	  './init.ejs',
	  function(can, initView){
		  /**
		   * @class ui/optionselector
		   * @alias Optionselector   
		   */
		  
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function( elem, opts ){
					  var self = this;
					  self.options.items = new can.Observe.List(self.options.items);
					  elem.html(initView({
						  items: self.options.items
					  },{
						  isSelected: function( item ) {
							  var name = (typeof(item) === 'function') ? item() : item.name;
							  return (self.options.state() === name) ? 'active' : '';
						  }
					  }));
				  }
				  
			  });
	  });
