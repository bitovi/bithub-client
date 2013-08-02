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
				  init : function( el, opts ) {
					  var self = this;
					  self.element.html(initView({
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
						  }
					  }));
				  }
			  });
	  });
