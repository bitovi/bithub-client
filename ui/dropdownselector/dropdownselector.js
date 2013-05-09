steal('can',
	  './init.mustache',
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
								  if (item.attr('name') === can.route.attr('project')) {
									  selected = item.attr('display_name');
								  }
							  });
							  return selected;
						  }
					  }));
				  },

				  'a.item click': function (el, ev) {
					  ev.preventDefault();

					  this.options.state( can.data(el, 'item').name );
				  }
			  });
	  });

