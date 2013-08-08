steal(
	'can',
	'bithub/models/reward.js',
	'./rewards.ejs',
	'./form/form.js',
	'../paginator.js',
	function(can, Reward, rewardsListView, rewardFormControl, Paginator){

		var isFormAction = function (route) {
			return route==='edit' || route==='new';
		}

		return can.Control({
			pluginName: 'admin-rewards',
			defaults : { 'Reward': Reward }
		}, {
			init : function(element, opts){
				paginator = new Paginator(can.route.attr('offset'));
				if (isFormAction(can.route.attr('action'))) {
					this.loadForm();
				} else {
					this.loadList();
				}
			},
			
			loadForm: function () {
				var self = this;
				if (can.route.attr('id')) {
					Reward.findOne({id: can.route.attr('id')}, function(reward) {
						new rewardFormControl(self.element, {reward: reward});
					});
				} else  {
					new rewardFormControl(self.element, {reward: new Reward()});
				}
			},
			
			loadList: function () {
				var self = this;
				Reward.findAll(paginator.currentState(), function(rewards) {
					self.element.html(rewardsListView({
						rewards: rewards,
						prevOffset: paginator.prevOffset(),
						nextOffset: paginator.nextOffset()
					}));
				});
			},
			
			'{can.route} offset': function(j, d, newVal, oldVal) {
				paginator.updateOffset(newVal);
				this.loadList();
			},
			
			'{can.route} action': function (route, ev, newVal, oldVal) {
				if (isFormAction(newVal)) {
					this.loadForm();
				} else {
					this.loadList();
				}
			},

			'td .delete-reward click' : function (el, ev) {
				if (confirm("Are you sure?"))
					el.closest('tr').data('reward').destroy();
			},

			'{Reward} destroyed' : function (Reward, ev, eventDestroyed) {
			}
		});
	}
);
