steal(function(){

	var eventPartialsLookup = [{
		template: 'bh-push',
		tags: ['push', 'pull_request']
	}, {
		template: 'bh-issue',
		tags: ['bug', 'feature']
	}, {
		template: 'bh-twitter',
		tags: ['tweet']
	}, {
		template: 'bh-event',
		tags: ['event']
	}];
	
	return function( tags ) {
		var template = 'bh-default', //default
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
