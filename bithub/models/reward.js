steal(
	'can',
	'can/observe/list',
	'vendor/moment',
	function (can) {
		
		var Reward = can.Model('Bithub.Models.Reward', {

			findAll : 'GET /api/rewards',
			findOne : 'GET /api/rewards/{id}',
			create  : 'POST /api/rewards',
			update  : 'PUT /api/rewards/{id}',
			destroy : 'DELETE /api/rewards/{id}'

		}, {});

		can.Model.List('Bithub.Models.Reward.List', {
			matchAchievements: function( user ) {
				var self = this,
					lastAchievedIdx = -1,
					achievements = user.attr('achievements');

				// match achievements against rewards
				_.each(self, function( reward, idx ) {
					_.each(achievements, function( achievement ) {
						var status;
						
						if( reward.attr('id') == achievement.attr('reward_id') ) {

							if( achievement.attr('achieved_at') ) {
								status = {
									cssClass: "shipping",
									message: "Shipping soon!"
								}
							}
							if( achievement.attr('shipped_at') ) {
								status = {
									cssClass: "achieved",
									inlineMessage: "Shipped " + moment( achievement.attr('shipped_at') ).format('MM/DD/YY')
								}
							}
						
							reward.attr('status', status );
							lastAchievedIdx = idx;
						}
						
					});
				});

				// mark next reward with 'almost' status
				if( self.attr('length')-1 > lastAchievedIdx ) {
					var pointsToGo = self.attr(lastAchievedIdx + 1).attr('point_minimum') - user.attr('score');
					self.attr(lastAchievedIdx + 1).attr('status', {
						cssClass: "almost",
						message: pointsToGo + " points to go!"
					});
				}
			},

			nextRewardIdx: function( achievements ) {
				if( !(achievements && achievements.length) ) return 0;
				
				var self = this,
					currIdx= 0,
					lastIdx = _.last(achievements).attr('reward_id');

				_.each( self, function( reward, idx ) {
					if( reward.attr('id') == lastIdx ) currIdx = idx;
				});				

				return currIdx + 1;
			}
		});

		return Reward;
	});
