steal('can',
	  './init.mustache',
	  'bithub/models/tags.js',
	  'ui/bootstrap.js',
	  function(can, initView, Tags){
		  /**
		   * @class ui/categories
		   * @alias Categories   
		   */
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {
					  break: 3
				  }
			  },
			  /** @Prototype */
			  {
				  init : function(){
					  var self = this;

					  Tags.categories({}, function(categories) {
						  self.options.categories = categories;
						  self.element.html(initView({
							categories_outlined: categories.slice( 0, self.options.break ),
							categories: categories.slice( self.options.brake, categories.length )
						  }));
					  });
				  },

				  'a.option click': function(el, ev) {
					  this.options.currentFilter.attr( 'category', can.data(el, 'category' ).name);

					  ev.preventDefault();
				  }
			  });
});
