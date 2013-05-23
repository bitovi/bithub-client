steal('can',
	  './init.mustache',
	  function(can, initView) {
		  return can.Control(
			  {
				  defaults : {}
			  }, {
				  init : function(){
					  this.element.html( initView({}) );
				  },
				  
				  '#login-modal .providers .twitter a click': function( el, ev ) {
					  ev.preventDefault();
					  el.closest('.modal').modal('hide');
					  this.options.currentUser.login('twitter');
				  },
				  
				  '#login-modal .providers .github a click': function( el, ev ) {
					  ev.preventDefault();
					  el.closest('.modal').modal('hide');
					  this.options.currentUser.login('github');
				  },

				  showLogin: function () {
					  this.element.find('#login-modal').modal('show');					  
				  }
			  });
	  });
