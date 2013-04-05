steal('can',
	  './init.mustache',
	  'bithub/models/tag.js',
	  'ui/optionselector',
	  'ui/dropdownselector',
	  'ui/smartselector',
	  function(can, initView, Tag, OptionSelector, DropdownSelector, SmartSelector){
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
				  init : function(){
					  var self = this;
					  
					  Tag.projects({}, function (projects) {
						  Tag.categories({}, function (categories) {
							  self.element.html(initView({}));

							  // init UI controls
							  new OptionSelector('#viewFilter', {
								  state: function (newVal) {
									  self.options.currentState.attr('view', newVal);
								  },
								  items: [
									  {name: 'latest', display_name: 'Latest', class: 'active'},
									  {name: 'greatest', display_name: 'Greatest'}
								  ]
							  });
							  new DropdownSelector('#projectFilter', {
								  state: function (newVal) {
									  self.options.currentState.attr('project', newVal);
								  },
								  items: projects,
								  default: {name: '', display_name: 'All projects'}
							  });
							  new SmartSelector('#categoryFilter', {
								  state: function (newVal) {
									  self.options.currentState.attr('category', newVal);
								  },
								  items: categories
							  });
						  });
					  });
					  
				  },

				  '{currentState} change': function(currentState, ev, attr, method, newVal) {
					  console.log(attr + " set to " + newVal);
				  }

			  });
	  });
