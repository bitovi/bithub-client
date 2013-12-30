steal('can/map', 'can/list', 'can/construct/super', function(Observe, List){

	var types = ['follow', 'watch', 'fork'];

	var getType = function(digest){
		var tags = digest.attr('tags'), type;
		for(var i = 0; i < types.length; i++){
			type = types[i];
			if(can.inArray(type + '_event', tags) > -1){
				return type === 'watch' ? 'wtch' : type; // watch breaks in Firefox because of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
			}
		}
	};

	var allowedCategories = ['app','article','bug','chat','code','comment','digest','event','feature','plugin','question','twitter'];
	var allowedDigest = ['follow_event','watch_event','fork_event']

	return can.Map({
		hasEvents : false,
		init : function(){
			this._super.apply(this, arguments);
			this.attr('types', {});
		},
		appendEvents : function(events){
			var event, startDate, stopDate;

			if(!events.attr('length')) return;

			startDate = events[0].attr('thread_updated_date');
			stopDate = events[events.length-1].attr('thread_updated_date');

			this.attr({date: startDate, stopDate: (stopDate == startDate) ? undefined : stopDate });
			
			for(var i = 0; i < events.length; i++){
				event = events[i];

				// skip events that are not whitelisted
				if( !_.contains(allowedCategories, event.attr('category')) ) continue;
				if( event.attr('category') === 'digest' && _.intersection(allowedDigest, event.attr('tags')).length == 0 ) continue;
				
				this.addEvent(event)
			}
		},
		addEvent : function(event){
			var types = this.attr('types'),
				category = event.attr('category'),
				method   = category === 'chat' ? 'unshift' : 'push';

			if(!this.attr('types.' + category)){
				this.attr('types').attr(category, []);
			}
			this.attr('types.' + category)[method](event);
			this.attr('hasEvents', true);
		},
		
		hasDigest : function(){
			return !!this.attr('types.digest');
		},
		
		digest : function(){
			var digests = this.attr('types.digest'),
				length  = digests.attr('length'),
				grouped = {
					follow : {},
					wtch  : {},
					fork   : {}
				},
				digest, what, type;

			for(var i = 0; i < length; i++){
				digest = digests[i],
				type   = getType(digest);

				if(type === 'follow'){
					what = digest.attr('props.target');
				} else if(type === 'wtch'){
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

				if( !grouped[repo] ) {
					grouped[repo] = {}
				}
				if( !grouped[repo][author] ) {
					grouped[repo][author] = {
						push_event: [], // grouped by title
						create_event: [],
						pull_request_event: [],
						delete_event: [],
						authorName: event.attr('author.name') || event.attr('actor') || author,
						tags: events[i].attr('tags').serialize()
					}
				}

				grouped[repo][author][type].push( event );

			}

			var regrouped = can.map(grouped, function(repoEvents, repo){
				return {
					repo       : repo,
					userEvents : can.map(repoEvents, function(userEvents, user){
						return userEvents
					})
				}
			})
			
			return regrouped;
		}
	})
})
