steal('can',
	  './init.mustache',
	  'bithub/models/achievement.js',
	  'vendor/bootstrap-datepicker',
	  function(can, initView, Achievement, Datepicker){
		  return can.Control.extend({
			  defaults : {
				  achievements: new can.Observe.List()
			  }
		  }, {
			  init : function( elem, opts ){
				  var achievements = this.options.achievements;
				  
				  Achievement.findAll({}, function( data ) {
					  achievements.replace( data );
				  });
				  
				  this.element.html(initView({
					  achievements: achievements
				  }));
			  },

			  '.btn.save click': function( el, ev ) {
				  ev.preventDefault();

				  var achievement = el.closest('tr').data('achievement');

				  achievement.save(function( data ) {
					  
				  });
			  }
		  });
	  });
