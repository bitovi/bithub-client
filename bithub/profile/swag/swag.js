steal('can',
	  './init.mustache',
	  'bithub/models/reward.js',
	  function(can, initView, Reward){
		  
		  return can.Control.extend({
			  defaults : {}
		  }, {
			  init : function( elem, opts ){
				  var rewards = new can.Observe.List();

				  Reward.findAll({order: 'point_minimum'}, function( data ) {
					  rewards.replace( data );
				  });
				  
				  this.element.html(initView({
					  user: opts.currentUser,
					  rewards: rewards
				  }));
			  }
		  });
	  });
