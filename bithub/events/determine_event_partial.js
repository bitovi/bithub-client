steal(

'./_event_default.ejs',
'./_event_code.ejs',
'./_event_twitter.ejs',
'./_event_event.ejs',
function( eventDefaultPartial, eventCodePartial, eventTwitterPartial, eventEventPartial){
	var eventPartialsLookup = [
	{
		template: eventCodePartial,
		tags: ['push_event']
	}, {
		template: eventTwitterPartial,
		tags: ['status_event']
	}, {
		template: eventEventPartial,
		tags: ['event']
	}
	];
	return function( tags ) {
		var template = eventDefaultPartial, //default
			bestScore = 0;

		can.each( eventPartialsLookup, function( partial ) {
			var score = 0;
			
			can.each(tags, function( tag ) {
				if (partial.tags.indexOf(tag) >= 0) score++;
			});
			
			if (score > bestScore) template = partial.template;
		} );
		
		return template;
	}
})