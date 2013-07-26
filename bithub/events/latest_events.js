steal('can/observe', 'can/observe/list', function(Observe, List){

	var Day = can.Observe({
		init : function(){
			this._super.apply(this, arguments);
			this.attr('types', {});
		},
		addEvent : function(event){
			var types = this.attr('types'),
				category = event.attr('category'),
				method   = category === 'chat' ? 'unshift' : 'push';

			console.log(category)
			
			if(!types[category]){
				this.attr('types.' + category, []);
			}
			this.attr('types.' + category)[method](event);
		}
	})


	return Observe({
		init : function(){
			this.attr('days', new List())
		},
		appendEvents : function(events){

			console.log('APPEND', events)

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
		}
	})
})