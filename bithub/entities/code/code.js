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

    var order = ['push', 'pull_request', 'create']

	can.Component.extend({
		tag : 'bh-code',
		template : codeView,
		scope : EntityState.extend({
			inited : true,
            init : function(){
            },
            preparedEvents : function(){
                var prepared = [],
                    events = this.events,
                    curEvents, evGroup;

                can.each(events, function(e){
                    var repo = e.repo;

                    prepared.push.apply(prepared, can.map(e.userEvents, function(curEvents){
                        var evGroup = {
                            authorName : curEvents.authorName
                        }

                        evGroup.grouped = can.map(order, function(type){
                            var evs = [];
                            if(type === 'push'){
                                can.each(curEvents.push, function(pushEvent){
                                    if(pushEvent.children && pushEvent.children.sortByOriginTS){
                                        evs.push.apply(evs, pushEvent.children.sortByOriginTS());
                                    }
                                });
                            } else {
                                evs = EventModel.List.prototype.sortByOriginTS.call(curEvents[type] || []);
                            }

                            var res = {
                                title : titles[type][(evs.length === 1 ? 'sg' : 'pl')] + repo,
                                repoUserEvents : evs,
                                eventType      : type
                            }

                            return evs.length ? res : null;
                        })

                        return evGroup;
                    }))
                })

                return prepared;
            }

		}),
		helpers : can.extend({}, sharedHelpers, {
			eventTitle : function(event, eventType){
				var title;

				event = can.isFunction(event) ? event() : event;

				if(eventType === 'push'){
					title = event.attr('source_body');
					title = can.trim((event.attr('props.sha') || '').substring(0, 6) + ' ' + title);
				} else {
					title = event.attr('title');
				}

				can.__clearReading();

				return title;
			},
			eventUrl : function(event, eventType){
				var url = 'https://github.com/';
				if(eventType === 'push'){
					url += event.attr('props.repo_name') + '/' + 'commit/' + event.attr('props.sha');
				} else if(eventType === 'create'){
					// TODO: we need a better way to do this
					url += event.attr('title').substr(24).replace(': ', '/tree/');
				} else {
					url = event.attr('url');
				}

				can.__clearReading();

				return url;
			}
		})
	})
})
