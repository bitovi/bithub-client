steal('can',
	  './init.mustache',
	  function(can, initView){
		  return can.Control.extend({
			  defaults : {}
		  }, {
			  init : function( elem, opts ){
				  var self = this;
				  
				  this.element.html( initView({
					  items: opts.items || [],
					  show: opts.show || true,
					  elemName: opts.elemName || ''
				  }, {
					  isSelected: function( val, opts ) {
						  return (this.value == self.options.currentValue()) ? 'selected="selected"' : '';
					  }
				  }) );
			  },

			  'select change': function( el, ev ) {
				  ev.preventDefault();
				  this.options.onChange( el.val() );
			  }
			  
		  });
	  });
