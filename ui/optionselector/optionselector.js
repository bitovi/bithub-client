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
				  init : function(){
					  var self = this;
					  
					  self.element.html(initView({
						  items: self.options.items
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
