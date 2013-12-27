steal('./child.mustache', function(childEventView){
	return {
		isEventUpvoted : function(event, opts){
			var upvotedEvents = this.attr('user.upvoted_events'),
				eventId       = event.attr('id'),
				check         = upvotedEvents && upvotedEvents.indexOf(eventId) > -1;
			return check ? opts.fn() : "";
		},
		eventUrl : function(event){
			if (event.attr('url')) {
				return event.attr('url');
			} else if (event.attr('feed') === 'bithub') {
				return can.route.url({id: event.attr('id')});
			}
			return "";
		},
		renderChildEvent : function(){
			var isCommit = false,
				opts, type, scope;

			if(arguments.length === 1){
				opts = arguments[0];
			} else {
				type     = arguments[0];
				isCommit = type === 'commit';
				opts     = arguments[1];
			}

			scope = opts.scope.add({
				isCommit  : isCommit,
				eventType : type
			});

			return childEventView.render(scope);
		}
	}
})