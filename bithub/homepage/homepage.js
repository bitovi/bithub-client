steal(
	'can',
	'./init.mustache',
	'bithub/events',
	'bithub/leaderboard',
	function(can, initView, Events, Leaderboard) {
		return can.Control({
			defaults : {}
		}, {
			init : function( elem, opts ){
				var self = this;
				
				elem.html( initView({
					user: opts.currentUser
				}) );
				
				new Events( elem.find('#events'), opts );
				new Leaderboard( elem.find('#leaderboard'), opts );

				// sometimes responses from /auth/session comes before this control is initialized
				var loggedIn = opts.currentUser.attr('loggedIn');
				if( loggedIn != undefined ) {
					opts.currentUser._triggerChange('loggedIn', 'change', loggedIn, loggedIn);
				}
			},
			
			'#show-new-post-form-btn click': function( el, ev ) {
				ev.preventDefault();
				this.options.newpostVisibility(true);
			},

			// twitter follow buttons are loaded dynamically
			'#twitter-modal-btn click': function( el, ev ) {
				ev.preventDefault();
				this.options.modals.showTwitter();
			}
		});
	});
