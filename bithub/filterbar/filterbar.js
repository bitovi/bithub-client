steal('can',
	  './init.mustache',
	  'bithub/models/tags.js',
	  'ui/categories',
	  function(can, initView, Tags, Categories){
		  /**
		   * @class filterbar
		   * @alias Filterbar   
		   */
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {
					  currentFilter: new can.Observe({
						  page: 'latest',
						  project: '',
						  category: ''
					  })
				  }
			  },
			  /** @Prototype */
			  {
				  init : function(){
					  var self = this;
					  
					  Tags.projects({}, function (projects) {
						  self.element.html(initView({ projects: projects }));
						  new Categories('#categories', { currentFilter: self.options.currentFilter });
					  });

				  },
				  
				  '#projectOptions a click': function (el, ev) {
					  var self = this;
					  
					  self.element.find('#projectTitle').html( can.data(el, 'project').display_name );
					  self.options.currentFilter.attr( 'project', can.data(el, 'project').name );
					  
					  ev.preventDefault();
				  },

				  '{currentFilter} change': function(currentFilter, ev, attr, method, newVal) {
					  console.log(attr + " set to " + newVal);
				  }

			  });
	  });
