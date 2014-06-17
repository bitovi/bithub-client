steal(
'./shared_views/child.mustache', 
'./shared_views/status_bar.mustache',
'./shared_views/upvote.mustache',
'./shared_views/toolbar.mustache',
function(childEventView, statusBarView, upvoteView, toolbarView){

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

		return '<ul class="tag-list nav">' + buffer + '</ul>';
	}

	var isEventUpvoted = function(event, opts){
		return window.CURRENT_USER.hasVotedFor(event) ? opts.fn(opts.scope) : "";
	}

	var detailsLink = function(event){
		var template = '<a href="/event/{id}" class="details-link"><b class="icon-link"></b></a>';
		return can.sub(template, event);
	}

	return {
		renderEventTags: renderEventTags,
		renderStatusBar : function(event, label, opts){
			var scope;

			if(arguments.length === 2){
				opts  = label;
				label = 'Earlier';
			}

			scope = opts.scope;

			return statusBarView.render(scope.add({
				event : event,
				label : label
			}), {
				renderEventTags : $.proxy(renderEventTags, scope),
				detailsLink     : detailsLink,
				eventUrl : function(event){
					var url = "";
					if (event.attr('feed') === 'bithub') {
						url = can.route.url({id: event.attr('id')});
					} else if (event.attr('url')) {
						url = event.attr('url');
					}
					can.__clearReading();
					return url;
				}
			});
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
		hasUrl : function(opts){
			var url = "",
				event = opts.context;
			if (event.attr('url')) {
				url = event.attr('url');
			} else if (event.attr('feed') === 'bithub') {
				url = can.route.url({id: event.attr('id')});
			}
			can.__clearReading();
			return url !== "" ? opts.fn(opts.context) : opts.inverse(opts.context);
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
				eventType : type,
				event     : opts.context
			});

			return childEventView.render(scope, {
				isEventUpvoted : isEventUpvoted,
				canBeAwarded : function(event, opts){
					var user  = window.CURRENT_USER,
						check;
					
					check = !event.attr('props.thread_awarded');
					check = check && user.isLoggedIn();
					check = check && user.isAdmin();
					check = check && event.isAwardable();

					return check ? opts.fn(scope) : "";
				}
			});
		},
		brokenImagesCleanup : function(){
			return function(el){
				setTimeout(function(){
					$(el).find('img').each(function(i, img){
						var $img = $(img);
						if(!img.complete || (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0)){
							$img.remove();
						}
					});
				}, 1);
				
			}
		},
		detailsLink : detailsLink
	}
})