steal('can/control', 'bithub/models/upvote.js', function(Control, Upvote){
	return Control({
		'.expand-replies click': function( el, ev ) {
			el.find('span.icon').toggleClass('collapse').closest('.event').find('.replies').toggle();
		},

		'.voteup click': function( el, ev ) {
			this.upvote( can.data(el.closest('.event'), 'eventObj') );
		},

		'.event-metadata a click': function( el, ev ) {
			window.location = el.attr('href');
		},

		'.replies .votes click': function( el, ev ) {
			this.upvote( can.data(el.closest('.reply-event'), 'eventObj') );
		},

		'.award-btn click': function( el, ev ) {
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

		'#greatestTimespanFilter a click': function( el, ev ) {
			ev.preventDefault();
			can.route.attr('timespan', can.data(el, 'value') );
		},

		upvote: function( event ) {
			if ( this.options.currentUser.attr('loggedIn') ) {
				(new Upvote({event: event})).upvote();
			} else {
				this.options.modals.showLogin();
			}
		}
	})
})
