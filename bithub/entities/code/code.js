steal(
'can/component',
'./code.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
'bithub/models/event.js',
function(Component, codeView, EntityState, sharedHelpers, EventModel){

	var titles = {
		push : {
			pl : 'Pushed to ',
			sg : 'Pushed to '
		},
		pull_request : {
			pl : 'Created new pull requests to ',
			sg : 'Created a new pull request to '
		},
		create : {
			pl : 'Created new branches on ',
			sg : 'Created a new branch on '
		}
	}

	can.Component.extend({
		tag : 'bh-code',
		template : codeView,
		scope : EntityState.extend({
			inited : true
		}),
		helpers : can.extend({
			groupedEvents : function(repo, opts){
				var order         = ['push', 'pull_request', 'create'],
					currentEvents = opts.context,
					repo          = can.isFunction(repo) ? repo() : repo;

				return can.map(order, function(type){
					var events = new can.List(),
						data, length;

					if(type === 'push'){
						can.each(currentEvents.attr('push'), function(pushEvent){
							events.push.apply(events, pushEvent.attr('children').sortByOriginTS());
						});
					} else {
						events = EventModel.List.prototype.sortByOriginTS.call(opts.context.attr(type));
					}

					length = events.attr('length');

					data = {
						title          : titles[type][(length === 1 ? 'sg' : 'pl')] + repo,
						repoUserEvents : events,
						eventType      : type
					};

					can.__clearReading();

					return length > 0 ? opts.fn(data) : '';

				}).join('');
			},
			eventTitle : function(event, eventType){
				var title;

				event = can.isFunction(event) ? event() : event;
				title = event.attr('title');

				if(eventType === 'push'){
					title = can.trim((event.attr('source_data.sha') || '').substring(0, 6) + ' ' + title);
				}

				can.__clearReading();

				return title;
			},
			eventUrl : function(event, eventType){
				var url = 'https://github.com/';
				if(eventType === 'push'){
					url += event.attr('source_data.repo.name') + '/' + 'commit/' + event.attr('source_data.sha');
				} else if(eventType === 'create'){
					// TODO: we need a better way to do this
					url += event.attr('title').substr(24).replace(': ', '/tree/');
				} else {
					url = event.attr('url');
				}

				can.__clearReading();

				return url;
			}
		}, sharedHelpers)
	})
})