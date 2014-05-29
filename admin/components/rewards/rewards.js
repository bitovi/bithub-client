steal(
'can/util/string',
'can/component',
'./rewards.mustache',
'admin/models/reward.js',
'fileupload-processing',
'./rewards.less',
function(can, Component, rewardsView, Reward, fileUpload){

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
					var data, save;
					if(reward.__fileUpload){
						data          = reward.__fileUpload;
						data.formData = {reward : $.param(reward.serialize().reward)};
						data.submit();
						save = data.jqXHR;
						save.then(function(data){
							reward.attr(data.data);
						})
						return save;
					}
					return reward.save();
				})

			this.attr('isSaving', true);

			$.when(rewardDeferreds).then(function(){
				self.attr('isSaving', false);
			})

		}
	},
	helpers : {
		initFileUpload : function(reward){
			return function(el){
				var url = '/api/v2/rewards';

				if(!reward.isNew()){
					url = url + '/' + reward.attr('id');
				}

				$(el).fileupload({
					url: url,
					datatype: 'json',
					limitMultiFileUploads: 1,
					replaceFileInput: false,
					acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
					add: function(el, data) {
						reward.__fileUpload = data;
					}
				})
			}
		}
	}
})

});