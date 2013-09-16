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

		var defaultParams = {
			order: 'point_minimum'
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
				var self = this,
					$div = $('<div/>');
				
				if (can.route.attr('id')) {
					Reward.findOne({id: can.route.attr('id')}, function(reward) {
						new rewardFormControl($div, {reward: reward});
					});
				} else  {
					new rewardFormControl($div, {reward: new Reward()});
				}

				self.element.html( $div );
			},
			
			loadList: function () {
				var self = this;
				Reward.findAll(can.extend({}, paginator.currentState(), defaultParams ), function(rewards) {
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
