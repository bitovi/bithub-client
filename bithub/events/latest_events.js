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
	}


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
					what = digest.attr('props.repo');
				} else if(type === 'fork'){
					what = digest.attr('props.repo');
				}

				if(type){
					grouped[type][what] = grouped[type][what] || [];
					grouped[type][what].push(digest);
				}

			}
			return grouped;
		}
	})


	return Observe({
		init : function(){
			this.attr('days', new List())
		},
		appendEvents : function(events){
			var days = this.attr('days'),
				lastDay = days.attr(days.length - 1),
				event;
			for(var i = 0; i < events.length; i++){
				event = events[i];
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