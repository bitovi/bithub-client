steal(
'can/component',
'./digest-list.mustache!',
'bithub/entities/entity_state.js',
function(Component, digestListView, EntityState){
	
	// We use `wtch` instead of `watch` because of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch

	var digestDict = {
		actions: {
			fork: 'forked',
			follow: 'followed',
			wtch: 'started watching'
		},
		targetUrl: {
			fork: 'http://github.com/',
			wtch: 'http://github.com/',
			follow: 'http://twitter.com/'
		},
		targetName: {
			fork: function(repo) { return repo.split('/')[1]; },
			wtch: function(repo) { return repo.split('/')[1]; },
			follow: function(account) { return '@' + account; }
		},
		actorUrl: {
			fork: 'http://github.com/',
			wtch: 'http://github.com/',
			follow: 'http://twitter.com/'
		}
	};


	Component.extend({
		tag : 'bh-digest-list',
		template : digestListView,
		scope : EntityState.extend({
			digestTypes : ['follow', 'fork', 'wtch']
		}),
		helpers : {
			digestsFor : function(digestType, opts){
				var digests = this.attr('digest.' + digestType);
				var result = can.map(can.Map.keys(digests), function(digest){
					return opts.fn({
						project        : digest,
						digests        : digests.attr(digest),
						type           : digestType,
						normalizedType : digestType === 'wtch' ? 'watch' : digestType
					});
				}).join('');

				can.__clearReading();

				return result;
			},
			isSingular : function(opts){
				var digests = opts.context.digests,
					result;
					
				if(digests.attr('length') === 1){
					result = opts.fn(opts.context);
				} else {
					result = opts.inverse(opts.context);
				}

				can.__clearReading();

				return result;
			},
			digestUrl : function(digestFn, type, opts){
				var digest = can.isFunction(digestFn) ? digestFn() : digestFn,
					author = digest.attr('props.origin_author_name');

				type = can.isFunction(type) ? type() : type;

				can.__clearReading();

				type = type === 'watch' ? 'wtch' : type;
				
				return digestDict.actorUrl[type] + author;
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