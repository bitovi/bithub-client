steal('can/component', './upvote.mustache', function(Component, upvoteView){
	can.Component.extend({
		tag : 'bh-upvote',
		template : upvoteView,
		scope : {
			user : window.CURRENT_USER,
			award : false,
			canBeAwarded : function(){
				var award = this.attr('award'),
					user  = this.attr('user'),
					check;
				
				check = award !== false;
				check = check && !event.attr('props.thread_awarded');
				check = check && user.loggedIn();
				check = check && user.isAdmin();

				return check;
			},
			isUpvoted : function(){
				var upvotedEvents = this.attr('user.upvoted_events'),
					eventId       = this.attr('event.id');
				return upvotedEvents && upvotedEvents.indexOf(eventId) > -1;
			}
		}
	})
})