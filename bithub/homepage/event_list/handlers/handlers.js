steal(
	'can/control',
	'bithub/models/upvote.js',
	'bithub/models/award.js',
	function(Control, Upvote, Award){
		return Control.extend({

			// Upvoting
			
			'.event > .votes .voteup-btn click': "upvote",
			'.event > .votes .count click': "upvote",
			'.event > .votes .uparrow click': "upvote",
			'.replies .reply-event .vote-btn click': "upvote",
			
			upvote: function( el, ev ) {
				var event = can.data( el.closest('.reply-event, .event'), 'eventObj' );

				if ( this.options.currentUser.attr('loggedIn') ) {
					(new Upvote({event: event})).upvote();

					el.closest('.reply-event, .event').addClass('upvoted').find('.votes .caption').html('Voted');
				} else {
					this.options.modals.showLogin();
				}
			},

			// Awarding

			'.replies .reply-event .award-btn click': function( el, ev ) {
				ev.preventDefault();
				
				var event = can.data(el.closest('.reply-event'), 'eventObj');
				(new Award({event: event})).award();

				(can.data(el.closest('.event'), 'eventObj')).attr('props.thread_awarded', true);
			},

			// Other
			
			'.expand-replies click': function( el, ev ) {
				el.find('span.icon').toggleClass('collapse').closest('.event').find('.replies').toggle();
			},
			
			'.event-metadata a click': function( el, ev ) {
				window.location = el.attr('href');
			},

			'.expand-manage-bar click': function( el, ev ) {
				ev.preventDefault();
				el.closest('.event').find('.manage-bar').slideToggle();
			},

			'.manage-bar .tag-action click': function( el, ev ) {
				ev.preventDefault();

				var event = can.data(el.closest('.event'), 'eventObj');
				var tag = el.data('tag');
				var tags = event.attr('tags');

				(tags.indexOf(tag) >= 0) ? tags.splice(tags.indexOf(tag), 1) : tags.push(tag);
				event.save();
			},

			'.manage-bar .category-action click': function( el, ev ) {
				ev.preventDefault();

				var event = can.data(el.closest('.event'), 'eventObj');

				event.attr('category', el.data('category'));
				event.save();
			},

			'.delete-event click': function( el, ev ) {
				ev.preventDefault();
				var event = can.data(el.closest('.event.list-element'), 'eventObj');
				event.destroy( function() {
					el.closest('.event.list-element').fadeOut();
				});
			}
			
		})
	}
)
