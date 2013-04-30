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
							  can.route.attr({page: 'homepage', view: newVal});
						  },
						  items: [
							  { name: 'latest', display_name: 'Latest', class: 'active' },
							  { name: 'greatest', display_name: 'Greatest' }
						  ]
					  });

					  new DropdownSelector('#projectFilter', {
						  items: options.projects,
						  cssClass: "projects",
						  default: {name: 'all', display_name: 'All projects'},
						  state: function (newVal) {
							  can.route.attr({page: 'events', project: newVal});
						  }
					  });

					  new SmartSelector('#categoryFilter', {
						  items: options.categories,
						  default: {name: 'all', display_name: 'All'},
						  state: function (newVal) {
							  can.route.attr({page: 'events', category: newVal});
						  }
					  });
					  
				  }

			  });
	  });
