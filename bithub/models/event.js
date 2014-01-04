steal('can',
	'./upvote.js',
	'vendor/moment',
	'can/list',
	'can/map/validations',
	'can/map/attributes',
	function (can, Upvote) {
		// methods shared by 'regular' Event model and LazyEvent object
		var prototypeMethods = {

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
			hasAwardValue : function(){
				return this.attr('props.awarded_value') && this.attr('props.awarded_value') >= 0;
			},
			authorName : function(){
				return this.attr('author.name') || this.attr('props.origin_author_name');
			}

			/*
			destroy: function( success, error ) {
				return can.ajax({
					url: '/api/events/' + this.attr('id'),
					type: 'DELETE',
					async: false,
					dataType: 'json',
					success: success,
					error: error
				});
			}
			 */
		}

		var Event = can.Model('Bithub.Models.Event', {

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
				this.validate('datetime', function(datetimeStr) {
					if (datetimeStr) {
						var dt = datetimeStr.split('T'),
						date = dt[0], time = dt[1],
						datetime = moment(datetimeStr, "YYYY-MM-DDTHH:mm:ss.S Z");

						if (!time) { return "Time can't be blank" }
						if (!datetime || !datetime.isValid()) { return "Time format should be<br> hh:mm am/pm" }
					}
				});
				this.validate('url', function(url) {
					if( url ) {
						if( !url.match("^http[s]?:\\/\\/(www\\.)?") ) { return "Invalid URL (don't forget 'http[s]://')" }
					}
				});
				this.validate('location', function(location) {
					if (location != undefined && location == '') { return "Events should have a location" }
				});

			},

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
				if(can.isFunction(params.thread_updated_date)){
					params.thread_updated_date = params.thread_updated_date();
					if(typeof params.thread_updated_date === 'undefined'){
						deferred = $.Deferred();
						success && deferred.done(success);
						deferred.resolve({data : []});
						return deferred;
					}
				}
				return this.findAll.apply(this, arguments);
			},

			attributes : {
				children : 'Bithub.Models.Event.models'
			}

			
		}, prototypeMethods );


		
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
