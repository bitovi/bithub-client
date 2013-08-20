steal(
	'can/control',
	'bithub/models/upvote.js',
	'bithub/models/award.js',
	function(Control, Upvote, Award){
		return Control.extend({
			'.expand-replies click': function( el, ev ) {
				el.find('span.icon').toggleClass('collapse').closest('.event').find('.replies').toggle();
			},

			'.event > .votes click': function( el, ev ) {
				this.upvote( can.data(el.closest('.event'), 'eventObj') );
			},
			
			'.votes .award-btn click': function( el, ev ) {
				var event = el.closest('.event').data('eventObj');
				(new Award({event: event})).award();
			},

			'.event-metadata a click': function( el, ev ) {
				window.location = el.attr('href');
			},

			'.replies .reply-event .vote-btn click': function( el, ev ) {
				this.upvote( can.data(el.closest('.reply-event'), 'eventObj') );
			},

			'.replies .reply-event .award-btn click': function( el, ev ) {
				ev.preventDefault();
				var event = can.data(el.closest('.reply-event'), 'eventObj');
				(new Award({event: event})).award();
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
			},

			upvote: function( event ) {
				if ( this.options.currentUser.attr('isLoggedIn') ) {
					(new Upvote({event: event})).upvote();
				} else {
					this.options.modals.showLogin();
				}
			}
		})
	}
)
