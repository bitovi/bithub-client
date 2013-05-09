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
							  return (can.route.attr('view') === name) ? 'active' : '';
						  }
					  }));
				  },
				  
				  'a.item click': function (el, ev) {
					  ev.preventDefault();

					  this.element.find('a').removeClass('active');
					  el.addClass('active');
					  
					  this.options.state( can.data(el, 'item').name );
				  }
				  
			  });
	  });
