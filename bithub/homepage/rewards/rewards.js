steal(
	'can',
	'bithub/models/reward.js',
	'./rewards.ejs',
	function(can, Reward, rewardsView){
		return can.Control({
			defaults : {}
		}, {
			init : function (el, opts) {
				Reward.findAll({}, function(rewards) {

					el.html(rewardsView({
						rewards: rewards
					}, {
						rewardThumb: function(arg) {
							return arg.image.thumb.url;
						}
					}));
				});
			}
		});
	}
);
