steal('can',
	  './init.mustache',
	  './view_selector/view_selector.js',
	  './project_selector/project_selector.js',
	  './category_selector/category_selector.js',	  
	  function(can, initView, ViewSelector, ProjectSelector, CategorySelector){

		  return can.Control(
			  {
				  defaults : {}
			  }, {
				  init : function( element, options ) {
					  var self = this;
					  
					  self.element.html(initView({}));

					  // init UI controls
					  new ViewSelector('#viewFilter', {
						  state: function (newVal) {
							return can.route.attr('view');
						  }
					  });

					  new ProjectSelector('#projectFilter', {
						  items: options.projects,
						  defaultOption: {
							  name: 'all',
							  display_name: 'All projects'
						  },
						  state: function (newVal) {
							return can.route.attr('project');
						  }
					  });

					  new CategorySelector('#categoryFilter', {
						  categories: options.categories,
						  defaultOption: {
							  name: 'all',
							  display_name: 'All'
						  },
						  state: function (newVal) {
							return can.route.attr('category');
						  }
					  });
					  
				  }

			  });
	  });
