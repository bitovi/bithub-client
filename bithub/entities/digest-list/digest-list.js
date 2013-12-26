steal('can/component', './digest-list.mustache', function(Component, digestListView){
	
	var digestDict = {
		actions: {
			fork: 'forked',
			follow: 'followed',
			watch: 'started watching'
		},
		targetUrl: {
			fork: 'http://github.com/',
			watch: 'http://github.com/',
			follow: 'http://twitter.com/'
		},
		targetName: {
			fork: function(repo) { return repo.split('/')[1]; },
			watch: function(repo) { return repo.split('/')[1]; },
			follow: function(account) { return '@' + account; }
		},
		actorUrl: {
			fork: 'http://github.com/',
			watch: 'http://github.com/',
			follow: 'http://twitter.com/'
		}
	};

	var digestTypes = ['follow', 'fork', 'watch'];

	Component.extend({
		tag : 'bh-digest-list',
		template : digestListView,
		scope : {
			digestTypes : ['follow', 'fork', 'watch']
		},
		helpers : {
			digestsFor : function(digestType, opts){
				var digests = this.attr('digest.' + digestType);
				return can.map(can.Map.keys(digests), function(digest){
					return opts.fn({
						project : digest,
						digests : digests.attr(digest),
						type    : digestType
					});
				}).join('');
			},
			isSingular : function(opts){
				var digests = opts.context.digests;
				if(digests.attr('length') === 1){
					return opts.fn(opts.context);
				} else {
					return opts.inverse(opts.context);
				}
			},
			digestUrl : function(digestFn, type, opts){
				var digest = can.isFunction(digestFn) ? digestFn() : digestFn;
				return digestDict.actorUrl[type] + digest.attr('props.origin_author_name');
			},
			digestAction : function(type){
				return digestDict.actions[type];
			},
			targetUrl : function(type, project){
				return digestDict.targetUrl[type] + project;
			},
			targetName : function(type, project){
				return digestDict.targetName[type](project);
			}
		}
	})
})