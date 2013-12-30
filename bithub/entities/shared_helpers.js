steal(
'./shared_views/child.mustache', 
'./shared_views/status_bar.mustache',
'./shared_views/manage_bar.mustache',
'./shared_views/upvote.mustache',
'./shared_views/toolbar.mustache',
function(childEventView, statusBarView, manageBarView, upvoteView, toolbarView){

	var renderEventTags = function (tags, opts) {
		var buffer, linkTags, visibleTags;
		
		tags        = can.isFunction(tags) ? tags() : tags;
		buffer      = "";
		linkTags    = can.route.attr('page') === 'homepage';
		visibleTags = this.visibleTags ? this.visibleTags() : this.attr('visibleTags')();

		visibleTags.attr('length');
		
		can.each(tags, function( eventTag ) {
			var matched = false;

			can.each(visibleTags, function( visibleTag ) {
				var name = visibleTag.attr('name'),
					url = "",
					routeParams = can.extend({}, can.route.attr());

				if( name == eventTag && !matched ) {
					if( linkTags ) {
						routeParams[visibleTag.attr('type')] = name;
						url = can.route.url( routeParams, false );
						buffer += "<li class=\"tag-name " + name +  "\"><a href=\"" + url +  "\"><small>" + name + "</small></a></li>";
					} else {
						buffer += "<li class=\"tag-name " + name +  "\"><small>" + name + "</small></li>";
					}
					matched = true;
				}
			});
		});

		can.__clearReading();
		
		return '<ul class="tag-list nav">' + buffer + '</ul>';
	}

	var isEventUpvoted = function(opts){
		var event, upvotedEvents, eventId, check;

		event = this.attr('event');

		upvotedEvents = this.attr('user.upvoted_events');
		eventId       = event.attr('id');
		check         = upvotedEvents && upvotedEvents.indexOf(eventId) > -1;

		return !!check;
	}

	return {
		renderEventTags: renderEventTags,
		renderStatusBar : function(event, opts){
			var scope = opts.scope;

			return statusBarView.render(scope.add({
				event : event
			}), {
				renderEventTags : $.proxy(renderEventTags, scope)
			});
		},
		renderManageBar : function(opts){
			return manageBarView.render(opts.scope);
		},
		renderToolbar : function(opts){
			return toolbarView.render(opts.scope);
		},
		renderUpvote : function(event, award, opts){
			var scope = opts.scope;

			return upvoteView.render(opts.scope.add({
				event : event,
				award : award
			}, {
				isEventUpvoted : $.proxy(isEventUpvoted, scope)
			}))
		},
		isEventUpvoted : isEventUpvoted,
		eventUrl : function(event){
			var url = "";
			if (event.attr('url')) {
				url = event.attr('url');
			} else if (event.attr('feed') === 'bithub') {
				url = can.route.url({id: event.attr('id')});
			}
			can.__clearReading();
			return url;
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