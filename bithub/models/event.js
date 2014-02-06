steal('can',
	'./upvote.js',
	'./award.js',
	'vendor/moment',
	'can/list',
	'can/map/validations',
	'can/map/attributes',
	'can/map/setter',
	'can/construct/super',
	function (can, Upvote, Award) {

		var formatAttrName = function(key, prefix){
			if(prefix){
				return can.sub('{prefix}[{key}]', {
					prefix : prefix,
					key    : key
				});
			}
			return key;
		}

		var imageFormat = function(imageUrl, format){
			var imageUrlArr = imageUrl.split('/');

			imageUrlArr[imageUrlArr.length - 1] = format + "_" + imageUrlArr[imageUrlArr.length - 1];

			return imageUrlArr.join('/');
		}

		var whiteListedForUpdate = [
			'title',
			'body',
			'category',
			'project',
			'type',
			'tags',
			'url',
			'location',
			'datetime',
			'origin_author_feed',
			'origin_author_id',
			'feed',
			'id'
		];

		var Event = can.Model('Bithub.Models.Event', {

			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/v1/events',
			update  : 'PUT /api/v1/events/{id}',
			destroy : 'DELETE /api/v1/events/{id}',

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
				this.validate('body', function() {
					var body            = this.isNew() ? this.attr('body') : this.attr('source_body'),
						category        = this.attr('category'),
						checkCategories = Bithub.Models.Tag.allowedCategoriesForNewPost;

					if (can.inArray(category, checkCategories) > -1 && !body){
						return "Please write something about this"
					}
				});
				this.validate('category', function(category) {
					var method;
					if (!category) { return "Please choose a category" }

					method = this.isNew() ? 'NewPost' : 'ExistingPost';

					if (Bithub.Models.Tag['allowedCategoriesFor' + method].indexOf(category) < 0) { return "Picked category doesn't exist" }
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
				this.validate('location', function() {
					var normalizedLocation = can.trim(location || "");

					if(this.isEvent() && normalizedLocation === ''){
						return "Events should have a location"
					}
				});
			},
			model : function(data){
				if(data.id && data.props && data.props.location){
					data.location = data.props.location;
				}
				return this._super(data);
			}

		}, {

			upvote: function( success, error ) {
				return (new Upvote({event: this})).upvote();
			},
			unvote: function( success, error ) {
				return (new Upvote({event: this})).unvote();
			},
			upvoteOrUnvote : function(){
				var method = CURRENT_USER.hasVotedFor(this) ? 'unvote' : 'upvote';
				this[method]();
			},
			award : function(){
				return (new Award({event: this})).award();
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
			isAwardable : function(){
				return this.attr('tags').indexOf('issue_comment_event') >= 0;
			},
			isEvent : function(){
				return this.attr('category') === 'event';
			},
			isOrCanBeAwarded : function(){
				return (this.attr('props.thread_awarded') || this.attr('upvotes') > 0);
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

				if(!this.isNew()){
					data.body = data.source_body;
					for(var k in data){
						if(whiteListedForUpdate.indexOf(k) === -1){
							delete data[k];
						}
					}
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
			},
			awardedValue : function(){
				var children = this.attr('children') || [],
					length = children.attr ? children.attr('length') : children.length,
					awardedValue;

				for(var i = 0; i < length; i++){
					awardedValue = children[i].attr('props.awarded_value');
					if(awardedValue){
						return awardedValue;
					}
				}

				return 0;
			},
			postImageUrl : function(){
				var imageUrl = this.attr('original_image_url');
				if(imageUrl){
					return imageFormat(imageUrl, '140x110')
				}
				return null;
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
