steal('can',
	  './init.ejs',
	  function(can, initView){
		  /**
		   * @class ui/optionselector
		   * @alias Optionselector   
		   */
		  
		  var optionsSelectorItemRoute = can.compute(function(item) {
			  return can.route.url({
				  category: can.route.attr('category') || 'all',
				  project: can.route.attr('project') || 'all',
				  view: item.name
			  }, false);
		  })

		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function( elem, opts ){
					  var self = this;
					  elem.html(initView({
						  items: self.options.items
					  },{
						  isSelected: function( item ) {
							  var name = (typeof(item) === 'function') ? item() : item.name;
							  return (self.options.state() === name) ? 'active' : '';
						  },
						  itemUrl: function (item) {
							  return optionsSelectorItemRoute(item);
						  }
					  }));
				  }
				  
			  });
	  });
