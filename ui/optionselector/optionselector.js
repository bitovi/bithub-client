steal('can',
	  './init.mustache',
	  function(can, initView){
		  /**
		   * @class ui/optionselector
		   * @alias Optionselector   
		   */
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function( elem, opts ){
					  var self = this;
					  
					  elem.html(initView({
						  items: opts.items
					  },{
						  isSelected: function( name, opts ) {
							  name = (typeof(name) === 'function') ? name() : name;
							  return (self.options.state() === name) ? 'active' : '';
						  }
					  }));
				  },
				  
				  'a.item click': function (el, ev) {
					  ev.preventDefault();

					  this.options.state( can.data(el, 'item').name );
				  }
				  
			  });
	  });
