steal('can',
	  './init.mustache!',
	  'bithub/models/achievement.js',
	  'bootstrap-datepicker',
	  'vendor/moment',
	  function(can, initView, Achievement, Datepicker){
		  return can.Control.extend({
			  defaults : {
				  achievements: new can.Observe.List()
			  }
		  }, {
			  init : function( elem, opts ){
				  var self = this,
					  achievements = this.options.achievements;
				  
				  Achievement.findAll({}, function( data ) {
					  achievements.replace( data );
				  });
				  
				  this.element.html(initView({
					  achievements: achievements
				  }, {
					  datepicker: function(){
						  return function( el ){
							  $(el).datepicker({
								  format: 'yyyy-mm-dd',
								  weekStart: 0
							  });
						  }
					  },
					  formatTs: function( ts ) {
						  ts = typeof(ts) === 'function' ? ts() : ts;
						  return ts ? moment(ts).format('YYYY-MM-DD') : '';
					  }
				  }));
			  },

			  '.btn.save click': function( el, ev ) {
				  ev.preventDefault();

				  var achievement = el.closest('tr').data('achievement'),
					  shipped_at = el.closest('tr').find('input[name=shipped_at]').val();

				  achievement.attr('shipped_at', shipped_at && moment(shipped_at).format() );
				  achievement.save(function() {
					  el.removeClass('btn-primary').addClass('btn-success');
					  setTimeout(function() { el.removeClass('btn-success').addClass('btn-primary')}, 3000);
				  }, function() {
					  el.removeClass('btn-primary').addClass('btn-danger');
					  setTimeout(function() { el.removeClass('btn-danger').addClass('btn-primary')}, 3000);
				  });
			  }
		  });
	  });
