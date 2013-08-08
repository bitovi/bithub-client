steal(
	'can',
	'./sidebar.mustache',
	'bithub/homepage/sidebar/leaderboard',
	'bithub/helpers/mustacheHelpers.js',
	function(can, sidebarView, Leaderboard){

		return can.Control.extend({
			defaults : { }
		}, {
			init : function( elem, opts ) {
				elem.html(sidebarView({
					user: opts.currentUser
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
