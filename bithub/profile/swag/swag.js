steal('can',
	  './init.mustache',
	  'bithub/models/reward.js',
	  'vendor/moment',
	  function(can, initView, Reward){


		  return can.Control.extend({
			  defaults : {
				  rewards: new can.Observe.List()
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
				  var user = this.options.currentUser,
					  rewards = this.options.rewards;

				  _.each(user.attr('achievements'), function( achievement ) {
					  var status = "";
					  
					  if( achievement.attr('achieved_at') ) {
						  status = {
							  cssClass: "shipping",
							  message: "This is a great thing!"
						  }
					  }
					  if( achievement.attr('shipped_at') ) {
						  status = {
							  cssClass: "achieved",
							  inlineMessage: "Shipped " + moment( achievement.attr('shipped_at') ).format('MM/DD/YY')
						  }
					  }
					  
					  _.each(rewards, function( reward ) {
						  if( achievement.attr('reward_id') == reward.attr('id') ) {
							  reward.attr('status', status );
						  }
						  
					  });
				  });
			  }

		  });
	  });
