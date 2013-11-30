steal('can/observe', 'can/observe/list', function(Observe, List){

	var types = ['follow', 'watch', 'fork'];

	var getType = function(digest){
		var tags = digest.attr('tags'), type;
		for(var i = 0; i < types.length; i++){
			type = types[i];
			if(can.inArray(type + '_event', tags) > -1){
				return type;
			}
		}
	};

	var allowedCategories = ['app','article','bug','chat','code','comment','digest','event','feature','plugin','question','twitter'];

	var Day = can.Observe({
		init : function(){
			this._super.apply(this, arguments);
			this.attr('types', {});
		},
		
		addEvent : function(event){
			var types = this.attr('types'),
			category = event.attr('category'),
			method   = category === 'chat' ? 'unshift' : 'push';

			if(!types[category]){
				this.attr('types.' + category, []);
			}
			this.attr('types.' + category)[method](event);
		},
		
		hasDigest : function(){
			return !!this.attr('types.digest');
		},
		
		digest : function(){
			var digests = this.attr('types.digest'),
			length  = digests.attr('length'),
			grouped = {
				follow : {},
				watch  : {},
				fork   : {}
			},
			digest, what, type;

			for(var i = 0; i < length; i++){
				digest = digests[i],
				type   = getType(digest);

				if(type === 'follow'){
					what = digest.attr('props.target');
				} else if(type === 'watch'){
					what = digest.attr('props.repo_name');
				} else if(type === 'fork'){
					what = digest.attr('props.repo_name');
				}

				if(type){
					grouped[type][what] = grouped[type][what] || [];
					grouped[type][what].push(digest);
				}

			}
			return grouped;
		},

		code: function() {

			var events = this.attr('types.code'),
				length  = events.attr('length'),
				types = ['push_event', 'create_event', 'pull_request_event'],
				grouped = {},
				event, author, type, title, repo;
			
			for(var i = 0; i < length; i++){
				event = events[i];
				title = event.attr('title');
				author = event.attr('props.origin_author_name');
				repo = event.attr('props.repo_name');
				type = _.find( event.attr('tags'), function( tag ) {
					return _.contains(types, tag);
				});

				// this check can be removed once all existing push_event/commits are grouped in db
				if( !type ) continue;

				// ignore push events without commits
				if( type == 'push_event' && event.attr('children').length == 0 ) continue;

				if( grouped[repo] ) {

					if( !grouped[repo][author] ) {
						grouped[repo][author] = {
							push_event: {}, // grouped by title
							create_event: [],
							pull_request_event: [],
							delete_event: [],
							authorName: event.attr('author.name') || event.attr('actor') || author,
							eventForTags: events[i]
						}
					}
					
					// push_events (commits) are additonally grouped by title
					if( type == 'push_event' ) {
						if( grouped[repo][author][type][title] ) {
							grouped[repo][author][type][title].push( event );
						} else {
							grouped[repo][author][type][title] = [ event ];
						}
					} else {
						grouped[repo][author][type].push( event );
					}
				} else {
					grouped[repo] = {};
					grouped[repo][author] = {						
						push_event: {}, // grouped by title
						create_event: [],
						pull_request_event: [],
						delete_event: [],
						authorName: event.attr('author.name') || event.attr('actor'),
						eventForTags: events[i]
					};
					if( type == 'push_event' ) {
						grouped[repo][author][type][title] = [ event ];
					} else {
						grouped[repo][author][type].push( event );
					}
				}
			}

			//console.log( grouped );
			
			return grouped;
		}
	})


	return Observe.extend({
		init : function(){
			this.attr('days', new List())
		},
		appendEvents : function(events){
			var days = this.attr('days'),
			lastDay = days.attr(days.length - 1),
			event;
			for(var i = 0; i < events.length; i++){
				event = events[i];

				// skip events that are not whitelisted
				if( !_.contains(allowedCategories, event.attr('category')) ) continue;
				
				if(!lastDay || lastDay.date !== event.attr('thread_updated_date')){
					lastDay = new Day({date : event.attr('thread_updated_date')})
					days.push(lastDay)
				}
				lastDay.addEvent(event)
			}
		},
		replace : function(events){
			this.attr('days').splice(0);
			this.appendEvents(events);
		}
	})
})
