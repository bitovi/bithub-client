steal('can',
	'./upvote.js',
	'bithub/helpers/group.js',
	'can/model/list',
	'can/observe/validations',
	function (can, Upvote, helpers) {
		var Event = can.Model('Bithub.Models.Event', {

			init: function () {
				this.validate('title', function(title) {
					if (!title) { return "Title can't blank" }
				});
				this.validate('category', function(category) {
					var validCategories = ['app', 'article', 'plugin'];
					if (!category) { return "Category can't be blank" }
					if (validCategories.indexOf(category) < 0) { return "Picked category doesn't exist" }
				});
				this.validate('project', function(project) {
					var validProjects = ['canjs', 'jquerypp', 'donejs', 'javascriptmvc', 'funcunit', 'stealjs', 'canui'];
					if (!project) { return "Project can't be blank" }
					if (validProjects.indexOf(project) < 0) { return "Picked project doesn't exist" }
				});
			},

			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events',
			update  : 'PUT /api/events/{id}',
			destroy : 'DELETE /api/events/{id}'

		}, {
			upvote: function( success, error ) {
				(new Upvote({event: this})).upvote();
			},
			
			award_sum: function() {
				return this.award_value + this.attr('upvotes') + this.attr('anteups');
			},

			award_closed: function() {
				var closed = false;
				this.attr('children').forEach( function( child ) {
					if (child.attr('props').attr('awarded')) closed = true;
				});
				return closed;
			},
			
			getAuthorName: function() {
				if (this.author && this.author.name) {
					return this.author.name;
				} else if (this.props && this.props.origin_author_name) {
					return this.props.origin_author_name;
				} else {
					return '';
				}
			}
		});

		can.Model.List('Bithub.Models.Event.List', {
			latest: function () {
				var days = [];

				// group into days and categories
				this.each( function( event, index ) {
					var flag = false;
					
					$.each( days, function( i, day ) {
						if ( day.date === event.attr('origin_date') ) {
							flag = true;
							if ( day[event.attr('category')] ) {
								day[event.attr('category')].push( event );
							} else {
								day[event.attr('category')] = [event];
							}
						}
					});

					if (!flag) {
						var day = {date: event.attr('origin_date')};
						day[event.attr('category')] = [event];
						days.push( day );
					}
				});

				// group digest for every day
				$.each(days, function( i, day) {
					if (day.digest) {
						var digestGrouped = {
							followers: [],
							watchers: [],
							forkers: []
						};

						$.each(day.digest, function( i, event ) {							
							if ( event.tags.indexOf('follow_event') >= 0 ) {
								digestGrouped.followers.push(event);
							}
							if ( event.tags.indexOf('watch_event') >= 0 ) {
								digestGrouped.watchers.push(event);
							}
							if ( event.tags.indexOf('fork_event') >= 0 ) {
								digestGrouped.forkers.push(event);
							}
						});

						digestGrouped.followers = helpers.groupIntoArray( digestGrouped.followers, ['props.target'] );
						digestGrouped.watchers = helpers.groupIntoArray( digestGrouped.watchers, ['props.repo'] );
						digestGrouped.forkers = helpers.groupIntoArray( digestGrouped.forkers, ['props.repo'] );
						
						day.digest = digestGrouped;
					}
				});
				
				return days;				
			}
		});
		
		return Event;
	});
