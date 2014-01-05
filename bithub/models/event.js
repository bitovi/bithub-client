steal('can',
	'./upvote.js',
	'vendor/moment',
	'can/list',
	'can/map/validations',
	'can/map/attributes',
	'can/map/setter',
	'can/construct/super',
	function (can, Upvote) {

		var formatAttrName = function(key, prefix){
			if(prefix){
				return can.sub('{prefix}[{key}]', {
					prefix : prefix,
					key    : key
				});
			}
			return key;
		}

		var Event = can.Model('Bithub.Models.Event', {

			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events',
			update  : 'PUT /api/events/{id}',
			destroy : 'DELETE /api/events/{id}',

			findGreatest : function(){
				return this.findAll.apply(this, arguments);
			},

			findLatest : function(params, success, error){
				var deferred;
				// If we are loading the latest, we need the thread_updated_date
				// param, but sometimes it doesn't exist because there is nothing
				// in the current category, so we resolve with the empty data set
				if(can.isFunction(params.thread_updated_date)){
					params.thread_updated_date = params.thread_updated_date();
					if(typeof params.thread_updated_date === 'undefined'){
						deferred = $.Deferred();
						success && deferred.done(success);
						deferred.resolve(Event.models({data : []}));
						return deferred;
					}
				}
				return this.findAll.apply(this, arguments);
			},

			attributes : {
				children : 'Bithub.Models.Event.models'
			},
			init: function () {
				var self = this;
				
				this.validate('title', function(title) {
					if (!title) { return "Please add a title" }
				});
				this.validate('body', function(body) {
					if (!body) { return "Please write something about this" }
				});
				this.validate('category', function(category) {
					if (!category) { return "Please choose a category" }
					if (Bithub.Models.Tag.allowedCategoriesForNewPost.indexOf(category) < 0) { return "Picked category doesn't exist" }
				});
				this.validate('project', function(project) {
					if (!project) { return "Please choose a project" }
					if (Bithub.Models.Tag.allowedProjectsForNewPost.indexOf(project) < 0) { return "Picked project doesn't exist" }
				});
				this.validate('url', function(url) {
					if( url ) {
						if( !url.match("^http[s]?:\\/\\/(www\\.)?") ) { 
							return "Invalid URL (don't forget 'http[s]://')" 
						}
					}
				});
				this.validate('location', function(location) {
					var normalizedLocation = can.trim(location || "");

					if(this.isEvent() && normalizedLocation === ''){
						return "Events should have a location"
					}
				});
			}

		}, {

			upvote: function( success, error ) {
				(new Upvote({event: this})).upvote();
			},
			isPush : function(){
				return this.attr('tags').indexOf('pull_request_event') >= 0;
			},
			isPullRequest : function(){
				return this.attr('tags').indexOf('pull_request_event') >= 0;
			},
			isPushOrPullReq : function(){
				return this.isPush() || this.isPullRequest();
			},
			isIssue : function(){
				return this.attr('tags').indexOf('issues_event') >= 0;
			},
			isEvent : function(){
				return this.attr('category') === 'event';
			},
			hasAwardValue : function(){
				return this.attr('props.awarded_value') && this.attr('props.awarded_value') >= 0;
			},
			authorName : function(){
				return this.attr('author.name') || this.attr('props.origin_author_name');
			},
			serializeToArray : function(prefix){
				var data = this.serialize().event,
					result = [];

				for(var k in data){
					if(data.hasOwnProperty(k)){
						result.push({
							name : formatAttrName(k, prefix),
							value : data[k]
						})
					}
				}

				return result;
			},
			serialize : function(){
				var data = this._super.apply(this, arguments);
				if(typeof data.datetime !== 'string'){
					data.datetime = moment(data.datetime).format('YYYY-MM-DDTHH:mm');
				}
				if(typeof data.feed === 'undefined'){
					data.feed = 'bithub';
				}
				return {
					event : data
				};
			},
			setDatetime : function(raw){
				if(typeof raw === 'string'){
					return moment(raw).toDate();
				}
				return raw;
			},
			date : function(){
				return moment(this.attr('datetime')).format('MM/DD/YYYY');
			},
			time : function(){
				return moment(this.attr('datetime')).format('hh:mmA');
			}
		});
		
		can.Model.List('Bithub.Models.Event.List', {
			sortByOriginTS : function(){
				return [].sort.call(this, function(a, b){
					var aTS = moment(a.attr('origin_ts')).toDate().getTime(),
						bTS = moment(b.attr('origin_ts')).toDate().getTime();
					if(aTS < bTS){
						return -1;
					} else if(aTS > bTS){
						return 1;
					}
					return 0;
				});
			}
		});
		
		return Event;
	});
