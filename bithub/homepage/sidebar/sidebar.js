steal(
	'can',
	'./sidebar.mustache',
	'bithub/homepage/sidebar/leaderboard',
	'bithub/models/reward.js',
	'bithub/helpers/mustacheHelpers.js',
	function(can, sidebarView, Leaderboard, Reward){

		return can.Control.extend({
			defaults : { }
		}, {
			init : function( elem, opts ) {
				var self = this,
					rewards = new can.Observe.List();

				Reward.findAll({order: 'point_minimum'}, function( data ) {
					rewards.replace( data );
				});

				elem.html(sidebarView({
					user: opts.currentUser,
					rewards: rewards
				}, {
					helpers: {
						iterRewards: function( opts ) {
							var buffer = "",
								swagUrl = can.route.url( self.options.currentUser.isLoggedIn() ? {page: 'profile', view: 'swag'} : {page: 'swag'}, false),
								start = _.random(0, rewards.attr('length')-2),
								stop = start + 2;
							
							for( var i = start; i < stop; i++ ) {
								buffer += opts.fn({
									reward: rewards.attr(i),
									swagUrl: swagUrl
								});
							}

							return buffer;
						}
					}
				}));
				
				new Leaderboard(elem.find('#leaderboard'), opts);
			},

			'#twitter-modal-btn click': function( el, ev ) {
				ev.preventDefault();
				this.options.modals.showTwitter();
			},

			'#show-new-post-form-btn click': function( el, ev ) {
				ev.preventDefault();
				this.options.newpostVisibility(true);
			}
		})
	}
);
