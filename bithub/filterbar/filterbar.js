steal('can',
	  './init.mustache',
	  'ui/optionselector',
	  'ui/dropdownselector',
	  'ui/smartselector',
	  function(can, initView, OptionSelector, DropdownSelector, SmartSelector){
		  /**
		   * @class filterbar
		   * @alias Filterbar   
		   */
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function( element, options ) {
					  var self = this;
					  
					  self.element.html(initView({}));

					  // init UI controls
					  new OptionSelector('#viewFilter', {
						  state: function (newVal) {
							return can.route.attr('view');
						  },
						  items: [
							  { name: 'latest', display_name: 'Latest' },
							  { name: 'greatest', display_name: 'Greatest' }
						  ]
					  });

					  new DropdownSelector('#projectFilter', {
						  items: options.projects,
						  defaultOption: { name: 'all', display_name: 'All projects' },
						  state: function (newVal) {
							return can.route.attr('project');
						  }
					  });

					  new SmartSelector('#categoryFilter', {
						  items: options.categories,
						  defaultOption: { name: 'all', display_name: 'All' },
						  state: function (newVal) {
							return can.route.attr('category');
						  }
					  });
					  
				  }

			  });
	  });
