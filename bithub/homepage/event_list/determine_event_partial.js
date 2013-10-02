steal(
	'./views/_event_default.ejs',
	'./views/_event_push.ejs',
	'./views/_event_issue.ejs',
	'./views/_event_twitter.ejs',
	'./views/_event_event.ejs',
	function( eventDefaultPartial, eventPushPartial, eventIssuePartial, eventTwitterPartial, eventEventPartial){
		var eventPartialsLookup = [{
			template: eventPushPartial,
			tags: ['push_event']
		}, {
			template: eventIssuePartial,
			tags: ['bug', 'feature']
		}, {
			template: eventTwitterPartial,
			tags: ['status_event']
		}, {
			template: eventEventPartial,
			tags: ['event']
		}];
		
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
