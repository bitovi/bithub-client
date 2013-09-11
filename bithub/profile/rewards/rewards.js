steal('can',
	  './init.mustache',
	  'bithub/models/reward.js',
	  'vendor/moment',
	  function(can, initView, Reward){

		  return can.Control.extend({
			  defaults : {
				  rewards: new Bithub.Models.Reward.List()
			  }
		  }, {
			  init : function( elem, opts ){
				  var rewards = this.options.rewards;
				  
				  Reward.findAll({order: 'point_minimum'}, function( data ) {
					  rewards.replace( data );
				  });
				  
				  this.element.html(initView({
					  user: opts.currentUser,
					  rewards: rewards
				  }));

				  if( opts.currentUser.isLoggedIn() ) {
					  this.matchRewards();
				  }
			  },

			  '{currentUser} isLoggedIn' : "matchRewards",
			  '{rewards} length': "matchRewards",

			  matchRewards: function() {
				  this.options.rewards.matchAchievements( this.options.currentUser );
			  }

		  });
	  });
