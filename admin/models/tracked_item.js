steal('can/model', 'can/construct/super', function(Model){
	var TrackedItem = Model.extend({

	}, {
		
	});

	TrackedItem.normalizers = {
		github : function(data){
			var normalize = function(str){
				return TrackedItem.model({name : str, id: str});
			}

			if(data && data.repos){
				data.repos = can.map(data.repos, normalize);
			}

			if(data && data.orgs){
				data.orgs = can.map(data.orgs, normalize);
			}

			return data;
		},
		facebook : function(data){
			if(data){
				data.pages = can.map(data.pages, function(page){
					return TrackedItem.model(page);
				})
			}
			

			return data;
		}
	}

	TrackedItem.serializers = {
		github : function(data){
			var repos = [],
				orgs = [];

			data.config = data.config || {};

			can.each(data.config.repos || [], function(item){
				repos.push(item.id);
			});

			can.each(data.config.orgs || [], function(item){
				orgs.push(item.id);
			});

			data.config.repos = repos;
			data.config.orgs =  orgs

			return data;
		},
		facebook : function(data){
			var pages = [];

			data.config = data.config || {};

			can.each(data.config.pages || [], function(item){
				pages.push(item);
			});

			data.config.pages = pages;

			return data;
		}
	}

	return TrackedItem;
})