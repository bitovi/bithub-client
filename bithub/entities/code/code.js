steal(
'can/component',
'./code.mustache',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
function(Component, codeView){

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
		scope : {
			currentdate : null,
			visibletags : [],
			inited : true,
			dateFormat : function(){
				var format = 'datetime',
					date = this.attr('currentdate');

				if( date && can.route.attr('view') == 'latest' && date == moment.utc(this.attr('origin_ts')).format('YYYY-MM-DD') ) format = 'time';
			
				return format;
			}
		},
		helpers : {
			groupedEvents : function(repo, opts){
				var order         = ['push', 'pull_request', 'create'],
					currentEvents = opts.context,
					repo          = can.isFunction(repo) ? repo() : repo;

				return can.map(order, function(type){
					var events = new can.List(),
						data, length;

					if(type === 'push'){
						can.each(currentEvents.attr('push_event'), function(pushEvent){
							events.push.apply(events, pushEvent.attr('children'));
						});
					} else {
						events = opts.context.attr(type + '_event');
					}

					length = events.attr('length');

					data = {
						title          : titles[type][(length === 1 ? 'sg' : 'pl')] + repo,
						repoUserEvents : events,
						eventType      : type
					};

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
		}
	})
})