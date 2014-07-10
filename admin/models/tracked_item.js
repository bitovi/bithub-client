steal('can/model', 'can/construct/super', function(Model){
	var TrackedItem = {};

	var normalizeString = function(str){
		if(typeof str === 'string'){
			return {name : str, id: str};
		}
		return str;
	}

	TrackedItem.normalizers = {
		github : function(data){
			if(data && data.repos){
				data.repos = can.map(data.repos, normalizeString);
			}

			if(data && data.orgs){
				data.orgs = can.map(data.orgs, normalizeString);
			}

			return data;
		},
		twitter : function(data){
			if(data && data.terms){
				data.terms = can.map(data.terms, normalizeString);
			}

			return data;
		},
		stackexchange : function(data){
			if(data && data.tags){
				data.tags = can.map(data.tags, normalizeString);
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

			if(data && data.terms){
				data.terms = can.map(data.terms, normalizeString);
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
		twitter : function(data){
			var terms = [];

			data.config = data.config || {};

			can.each(data.config.terms || [], function(item){
				terms.push(item.id);
			});

			data.config.terms = terms;

			return data;
		},
		stackexchange : function(data){
			var tags = [];

			data.config = data.config || {};

			can.each(data.config.tags || [], function(item){
				tags.push(item.id);
			});

			data.config.tags = tags;

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
			var groups = [],
				terms = [];

			data.config = data.config || {};

			can.each(data.config.groups || [], function(item){
				groups.push(item);
			});

			can.each(data.config.terms || [], function(item){
				terms.push(item.id);
			});

			data.config.groups = groups;
			data.config.terms = terms;

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
		},
		rss : function(data){
			if(!data.config){
				data.config = {};
			}
			if(!data.config.sites){
				data.config.sites = [];
			}

			delete data.config.urls;

			return data;
		}
	}

	return TrackedItem;
})