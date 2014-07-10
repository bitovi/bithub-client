steal('can/model', function(Model){

	var Feed = can.Map.extend({}),
		Keyword = can.Map.extend({})

	return {
		findAll : function(){
			var promise = $.get('/api/v2/tags/tree');
			promise.then(function(res){
				if(res.feeds){
					res.feeds = can.map(res.feeds, function(feed){
						return new Feed(feed);
					})
				}
				if(res.keywords){
					res.keywords = can.map(res.keywords, function(keyword, i){
						return new Keyword({
							id : i + 1,
							name : keyword
						})
					})
				}
			})
			return promise;
		}
	}
})