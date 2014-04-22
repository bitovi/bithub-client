steal('can/model', 'can/construct/super', function(Model){
	var TrackedItem = {};

	TrackedItem.normalizers = {
		github : function(data){
			var normalize = function(str){
				return {name : str, id: str};
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
				data.pages = can.map(data.pages || [], function(page){
					return page;
				})
			}
			
			return data;
		},
		meetup : function(data){
			if(data){
				data.groups = can.map(data.groups || [], function(group){
					return group;
				})
			}
			
			return data;
		},
		disqus : function(data){
			if(data){
				data.forums = can.map(data.forums || [], function(forum){
					return forum;
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
		},
		meetup : function(data){
			var groups = [];

			data.config = data.config || {};

			can.each(data.config.groups || [], function(item){
				groups.push(item);
			});

			data.config.groups = groups;

			return data;
		},
		disqus : function(data){
			var forums = [];

			data.config = data.config || {};

			can.each(data.config.forums || [], function(item){
				forums.push(item);
			});

			data.config.forums = forums;

			return data;
		}
	}

	return TrackedItem;
})