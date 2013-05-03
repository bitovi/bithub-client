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
						  cssClass: opts.cssClass,
						  items: opts.items,
						  defaultOption: opts.defaultOption
					  }));
				  },

				  'a.item click': function (el, ev) {
					  ev.preventDefault();

					  this.element.find('.title').html( can.data(el, 'item').display_name );
					  this.options.state( can.data(el, 'item').name );
				  }
			  });
	  });

