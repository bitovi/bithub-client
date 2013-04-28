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
							  can.route.attr({page: 'events', view: newVal});
						  },
						  items: [
							  { name: 'latest', display_name: 'Latest', class: 'active' },
							  { name: 'greatest', display_name: 'Greatest' }
						  ]
					  });
					  
					  new DropdownSelector('#projectFilter', {
						  state: function (newVal) {
							  can.route.attr({page: 'events', project: newVal});
						  },
						  items: options.projects,
					  default: {name: 'all', display_name: 'All projects'}
					  });

					  new SmartSelector('#categoryFilter', {
						  state: function (newVal) {
							  can.route.attr({page: 'events', category: newVal});
						  },
						  items: options.categories,
					  default: {name: 'all', display_name: 'All'}
					  });
					  
				  }

			  });
	  });
