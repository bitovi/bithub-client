steal(
	'can',
	'can/observe/list',
	'vendor/moment',
	function (can) {
		
		var Model = can.Model('Bithub.Models.Reward', {

			findAll : 'GET /api/rewards',
			findOne : 'GET /api/rewards/{id}',
			create  : 'POST /api/rewards',
			update  : 'PUT /api/rewards/{id}',
			destroy : 'DELETE /api/rewards/{id}'

		}, {
			// NOP
		});

		can.Model.List('Bithub.Models.Reward.List', {
			matchAchievements: function( achievements ) {
				var self = this;

				_.each(achievements, function( achievement ) {
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
					
					_.each(self, function( reward ) {
						if( achievement.attr('reward_id') == reward.attr('id') ) {
							reward.attr('status', status );
						}
						
					});
				});
			},

			nextRewardIdx: function( achievements ) {
				if( !achievements ) return 0;
				
				var self = this,
					currIdx= 0,
					lastIdx = _.last(achievements).attr('reward_id');

				_.each( self, function( reward, idx ) {
					if( reward.attr('id') == lastIdx ) currIdx = idx;
				});				

				return currIdx + 1;
			}
		});

		return Model;
	});
