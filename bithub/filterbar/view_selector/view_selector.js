steal('can',
	  './init.ejs',
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
					  },{
						  isSelected: function( name ) {
							  return (self.options.state() === name) ? 'active' : '';
						  }
					  }));
				  }
				  
			  });
	  });
