steal(
	function () {

		var parseHeaderLink = function( link ) {
			if( !link ) return;

			return _.map( link.split(','), function( item ) {
				var splitted = item.split(';');

				// first elem is url, the rest are params
				var result = {
					url: splitted.shift().trim().slice(1,-1)
				}

				_.each(splitted, function( param ) {
					var splitted = param.split('=');
					var key =  splitted[0].trim();
					var value = splitted[1].trim().slice(1,-1);
					result[key] = value;
				});

				return result;
			});
		};

		var load = function(url, accumulator, cb) {
			$.ajax({
				url: url,
				headers: {
					//Accept: "application/vnd.github.v3+json"
				},
				success: function( data, status, xhr ) {
					var links = parseHeaderLink( xhr.getResponseHeader('Link') );
					var next = _.find(links, function(link) {
						if( link.rel == "next" ) {
							return true;
						}
					});

					accumulator.push.apply(accumulator, 
										   _.map(data, function( item ) {
											   return {
												   id: item.id,
												   name: item.name,
												   full_name: item.full_name
											   }
										   })
										  );

					next ? load( next.url, accumulator, cb) : cb( accumulator );
				}
			})
		};

		var matchRepo = function( str ) {
			var matched = _.chain( str.split(' ') )
					.map(function(repo) { return repo.match(/(.+)\/(.+)/i) })
					.compact()
					.first()

			return (!!matched) ? {org: matched[1].replace('.','_'), repo: matched[2].replace('.','_')} : undefined;
		};
		
		return {
			query: function( url, cb ) {
				load( url, [], cb);
			},
			matchRepo: matchRepo
		};
	}
);
