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
				var rewards = new can.Observe.List();

				Reward.findAll({order: 'point_minimum'}, function( data ) {
					rewards.replace( data );
				});

				elem.html(sidebarView({
					user: opts.currentUser,
					rewardsUrl: can.route.url({page: 'swag'}, false)
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
