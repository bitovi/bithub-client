steal('can',
	  './init.mustache',
	  'bithub/models/achievement.js',
	  function(can, initView, Achievement){
		  return can.Control.extend({
			  defaults : {}
		  }, {
			  init : function(){
				  this.element.html(initView({
					  message: "Hello World from Achievements"
				  }));
			  }
		  });
	  });
