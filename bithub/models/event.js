steal('can',
	'./upvote.js',
	'bithub/helpers/group.js',
	'can/model/list',
	'can/observe/validations',
	'can/observe/lazy',
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
			destroy : 'DELETE /api/events/{id}',

			model: function( attrs ) {
				return attrs;
			}
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
				return this.attr('author.name') || this.attr('props.origin_author_name') || '';
			}
		});

		var LazyEvent = function( data ) {
			$.extend(this, (new can.LazyMap(data)) );
		}
		LazyEvent.prototype = Event.prototype;
		

		can.Model.List('Bithub.Models.Event.List', {
			Observe: function( data ) {
				//return new LazyEvent( data );
				return new can.LazyMap( data );				
			}
		}, {
			latest: function ( offset ) {
				var self = this,
					days = [];
				
				offset = offset || 0;

				// group into days and categories
				this.each( function( event, idx ) {
					var flag = false;

					idx += offset;

					$.each( days, function( i, day ) {
						if ( day.date === event.attr('origin_date') ) {
							flag = true;
							if ( day[event.attr('category')] ) {
								day[event.attr('category')].push( idx );
							} else {
								day[event.attr('category')] = [idx];
							}
						}
					});

					if (!flag) {
						var day = {date: event.attr('origin_date')};
						day[event.attr('category')] = [idx];
						days.push( day );
					}
				});

				// group digest for every day
				$.each(days, function( i, day) {
					if (day.digest) {
						var digestGrouped = {
							followers: {_keys: []},
							watchers: {_keys: []},
							forkers: {_keys: []}
						}, prop;
						
						$.each(day.digest, function( i, idx ) {
							idx -= offset;
							
							var tags = self[idx].attr('tags');
							
							if ( tags.indexOf('follow_event') >= 0 ) {
								prop = self[idx].attr('props.target');
								
								if( digestGrouped.followers[ prop ] ) {
									digestGrouped.followers[ prop ].push( idx+offset );
								} else {
									digestGrouped.followers[ prop ] = [idx+offset ];
									digestGrouped.followers._keys.push( prop );
								}
							} else 	if ( tags.indexOf('watch_event') >= 0 ) {
								prop = self[idx].attr('props.repo');
								
								if( digestGrouped.watchers[ prop ] ) {
									digestGrouped.watchers[ prop ].push( idx+offset );
								} else {
									digestGrouped.watchers[ prop ] = [idx+offset];
									digestGrouped.watchers._keys.push( prop );
								}
								
							} else if ( tags.indexOf('fork_event') >= 0 ) {
								prop = self[idx].attr('props.repo');
								
								if( digestGrouped.forkers[ prop ] ) {
									digestGrouped.forkers[ prop ].push( idx+offset );
								} else {
									digestGrouped.forkers[ prop ] = [idx+offset];
									digestGrouped.forkers._keys.push( prop );
								}
								
							}
						});
						
						day.digest = digestGrouped;
					}
				});

				return days;				
			}
		});
		
		return Event;
	});
