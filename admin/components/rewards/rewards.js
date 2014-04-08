steal('can/util/string', 'can/component', './rewards.mustache', 'admin/models/reward.js', './rewards.less', function(can, Component, rewardsView, Reward){

	return can.Component({
	tag : 'rewards',
	template : rewardsView,
	scope : {
		init : function(){
			this.attr('rewards', new Reward.List({}));
		},
		addReward : function(){
			var rewards = this.attr('rewards');
			rewards.push(new Reward);
		},
		deleteReward : function(reward){
			var rewards = this.attr('rewards'),
				index   = rewards.indexOf(reward);
			if(confirm('Are you sure?')){
				if(reward.isNew()){
					rewards.splice(index, 1);
				} else {
					reward.destroy();
				}
			}
		},
		isSaving : false,
		saveRewards : function(){
			var rewards = this.attr('rewards'),
				self = this,
				rewardDeferreds = can.map(rewards, function(reward){
					return reward.save();
				})

			this.attr('isSaving', true);

			$.when(rewardDeferreds).then(function(){
				self.attr('isSaving', false);
			})

		}
	}
	})

});