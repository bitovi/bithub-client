steal(
	'can',
	'can/list',
	'vendor/moment',
	function (can) {

		REWARD_STATUSES = {
			ACHIEVED : 1,
			SHIPPED  : 2
		}

		var imageFormat = function(imageUrl, format){
			var imageUrlArr = (imageUrl || "").split('/');

			imageUrlArr[imageUrlArr.length - 1] = format + "_" + imageUrlArr[imageUrlArr.length - 1];

			return imageUrlArr.join('/');
		}

		var Reward = can.Model('Bithub.Models.Reward', {

			findAll : 'GET /api/v2/rewards',
			findOne : 'GET /api/v2/rewards/{id}',
			create  : 'POST /api/v2/rewards',
			update  : 'PUT /api/v2/rewards/{id}',
			destroy : 'DELETE /api/v2/rewards/{id}'

		}, {
			init : function(){
				this.attr('imageUrlBasedOnShipping', this.imageUrl());
				this.attr('display_point_minimum', this.attr('description'));
			},
			imageUrl : function(){
				return imageFormat(this.attr('original_image_url'), '240x240');
			},
			thumbUrl : function(){
				return imageFormat(this.attr('original_image_url'), '124x124');
			},
			greyscaleImageUrl : function(){
				return imageFormat(this.attr('original_image_url'), '240x240,greyscale');
			}
		});

		can.Model.List('Bithub.Models.Reward.List', {
			matchAchievements: function( user, users ) {
				var self            = this,
					lastAchievedIdx = -1,
					score           = user.attr('score'),
					achievements    = user.attr('achievements') || new can.List,
					RS              = REWARD_STATUSES,
					rewardStatuses  = {},
					shippedAt       = {};


				achievements.each(function(a){
					var shipped = a.attr('shipped_at');

					if(shipped){
						rewardStatuses[a.reward_id] = RS.SHIPPED;
						shippedAt[a.reward_id]      = moment(shipped).format('MM/DD/YY');
					} else {
						rewardStatuses[a.reward_id] = RS.ACHIEVED;
					}
				});

				// match achievements against rewards
				_.each(self, function( reward, idx ) {
					var status = rewardStatuses[reward.attr('id')],
						pointMinimum = reward.attr('point_minimum');

					if(status === RS.SHIPPED){
						lastAchievedIdx = idx;
						reward.attr({
							status_cssClass: 'achieved',
							status_inlineMessage: 'Shipped ' + shippedAt[reward.id],
							imageUrlBasedOnShipping : reward.greyscaleImageUrl()
						});
					} else if(status === RS.ACHIEVED || pointMinimum <= score){
						lastAchievedIdx = idx;
						reward.attr({
							status_cssClass: 'shipping',
							status_message: 'Shipping soon!',
							imageUrlBasedOnShipping : reward.imageUrl()
						});
					} else {
						reward.attr({
							imageUrlBasedOnShipping : reward.imageUrl()
						});
					}
				});

				// mark next reward with 'almost' status
				if( lastAchievedIdx < self.attr('length') - 1) {
					self[lastAchievedIdx + 1].attr({
						status_cssClass: "almost",
						status_message: self.attr(lastAchievedIdx + 1).attr('point_minimum') - user.attr('score') + " points to go!"
					});

					// overall leader
					if( lastAchievedIdx + 1 == self.attr('length') - 1) {
						if( users.attr('length') ) {
							self.attr((lastAchievedIdx + 1) + '.status_message', users.topUser().attr('score') - user.attr('score') + " points to go!" );
						}
					}
				}
			},

			nextRewardIdx: function( achievements ) {
				if( !(achievements && achievements.attr('length')) ) return 0;

				var self    = this,
					currIdx = 0,
					lastIdx = _.last(achievements).attr('reward_id');

				_.each( self, function( reward, idx ) {
					if( reward.attr('id') == lastIdx ) currIdx = idx;
				});

				return (currIdx == achievements.attr('length')-1) ? currIdx : currIdx + 1;
			}
		});

		return Reward;
	});
