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
					  var filtered = _.filter(data, function( reward ) {
						  if (!reward.disabled_ts) return reward;
					  });
					  rewards.replace( filtered );
				  });
				  
				  this.element.html(initView({
					  user: opts.currentUser,
					  rewards: rewards,
					  routes: {
						  profile: can.route.url({page: 'profile', view: 'info'}, false)
					  }
				  }));

				  if( opts.currentUser.isLoggedIn() ) {
					  this.matchRewards();
				  }
			  },

			  '{currentUser} isLoggedIn' : "matchRewards",
			  '{rewards} length': "matchRewards",
			  '{users} length': "matchRewards", // check top user

			  matchRewards: function() {
				  this.options.rewards.matchAchievements( this.options.currentUser, this.options.users );
			  }

		  });
	  });
