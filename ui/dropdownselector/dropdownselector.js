steal('can',
	  './init.ejs',
	  'vendor/bootstrap',
	  function(can, initView){
		  /**
		   * @class ui/dropdownselector
		   * @alias Dropdownselector   
		   */

		  var dropdownItemRoute = can.compute(function(item) {
			  return can.route.url({
				  project: item.name,
				  category: can.route.attr('category'),
				  view: can.route.attr('view')
			  }, true);
		  })

		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function( el, opts ) {
					  var self = this;
					  can.extend(this.options, opts);
					  self.element.html( initView({
						  htmlId: self.options.htmlId,
						  items: self.options.items,
						  defaultOption: self.options.defaultOption
					  }, {
						  selected: function() {
							  var selected = self.options.defaultOption.display_name;
							  can.each(self.options.items, function(item) {
								  if (self.options.state() === item.attr('name')) {
									  selected = item.attr('display_name');
								  }
							  });
							  return selected;
						  },
						  itemUrl: function (item) {
							  return dropdownItemRoute(item);
						  }
					  }));
				  },
			  });
	  });
