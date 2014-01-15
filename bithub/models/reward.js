steal(
	'can',
	'can/list',
	'vendor/moment',
	function (can) {

		var imageFormat = function(imageUrl, format){
			var imageUrlArr = imageUrl.split('/');

			imageUrlArr[imageUrlArr.length - 1] = format + "_" + imageUrlArr[imageUrlArr.length - 1];

			return imageUrlArr.join('/');
		}

		var Reward = can.Model('Bithub.Models.Reward', {

			findAll : 'GET /api/rewards',
			findOne : 'GET /api/rewards/{id}',
			create  : 'POST /api/rewards',
			update  : 'PUT /api/rewards/{id}',
			destroy : 'DELETE /api/rewards/{id}'

		}, {
			init : function(){
				this.attr('imageUrlBasedOnShipping', this.imageUrl());
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
				var self = this,
					lastAchievedIdx = -1,
					achievements = user.attr('achievements');

				// match achievements against rewards
				_.each(self, function( reward, idx ) {
					_.each(achievements, function( achievement ) {

						if( reward.attr('id') == achievement.attr('reward_id') ) {

							if( achievement.attr('shipped_at') ) {
								reward.attr({
									status_cssClass: 'achieved',
									status_inlineMessage: 'Shipped ' + moment( achievement.attr('shipped_at') ).format('MM/DD/YY'),
									imageUrlBasedOnShipping : reward.greyscaleImageUrl()
								});
							} else if( achievement.attr('achieved_at') ) {
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

							lastAchievedIdx = idx;
						} else {
							reward.attr({
								imageUrlBasedOnShipping : reward.imageUrl()
							});
						}

					});
				});

				// mark next reward with 'almost' status
				if( lastAchievedIdx < self.attr('length')-1) {
					self[lastAchievedIdx + 1].attr({
						status_cssClass: "almost",
						status_message: self.attr(lastAchievedIdx + 1).attr('point_minimum') - user.attr('score') + " points to go!"
					});

					// overall leader
					if( lastAchievedIdx + 1 == self.attr('length')-1) {
						if( users.attr('length') ) {
							self.attr((lastAchievedIdx + 1) + '.status_message', users.topUser().attr('score') - user.attr('score') + " points to go!" );
						}
					}
				}
			},

			nextRewardIdx: function( achievements ) {
				if( !(achievements && achievements.attr('length')) ) return 0;

				var self = this,
					currIdx= 0,
					lastIdx = _.last(achievements).attr('reward_id');

				_.each( self, function( reward, idx ) {
					if( reward.attr('id') == lastIdx ) currIdx = idx;
				});

				return (currIdx == achievements.attr('length')-1) ? currIdx : currIdx + 1;
			}
		});

		return Reward;
	});
