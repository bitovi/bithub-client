steal('can',
	  './init.ejs',
	  'vendor/bootstrap',
	  function(can, initView){
		  /**
		   * @class ui/dropdownselector
		   * @alias Dropdownselector   
		   */
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function( el, opts ){
					  var self = this;
					  self.element.html(initView({
						  htmlId: opts.htmlId,
						  items: opts.items,
						  defaultOption: opts.defaultOption
					  }, {
						  selected: function( opts ) {
							  var selected = self.options.defaultOption.display_name;
							  can.each(self.options.items, function(item) {
								  if (self.options.state() === item.attr('name')) {
									  selected = item.attr('display_name');
								  }
							  });
							  return selected;
						  },
						  itemUrl: function (item) {
							  return can.route.url({ project: item.name }, true);
						  }
					  }));
				  }
			  });
	  });

