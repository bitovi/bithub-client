steal('can',
	  './init.mustache',
	  'vendor/bootstrap.js',
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
				  init : function(){
					  var self = this;
					  
					  self.element.html(initView({
						  items: self.options.items,
						  default: self.options.default
					  }));
				  },

				  'a.item click': function (el, ev) {
					  ev.preventDefault();

					  this.element.find('.title').html( can.data(el, 'item').display_name );
					  this.options.state( can.data(el, 'item').name );
				  }
			  });
	  });

