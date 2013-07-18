steal('can',
	'./upvote.js',
	'vendor/moment',
	'can/model/list',
	'can/observe/validations',
	'can/observe/lazy',
	function (can, Upvote) {
		// methods shared by 'regular' Event model and LazyEvent object
		var prototypeMethods = {
			upvote: function( success, error ) {
				(new Upvote({event: this})).upvote();
			},
			
			award_sum: function() {
				return this.attr('award_value') + this.attr('upvotes') + this.attr('anteups');
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
			},

			eventUrl: function() {
				if (this.attr('url')) {
					return "<a href=\"" + this.attr('url') + "\">" + this.attr('title') + "</a>";
				} else if (this.attr('feed') === 'bithub') {
					return can.route.link( this.attr('title'), {id: this.attr('id')}, {} )
				} else {
					return "<a>" + this.attr('title') + "</a>";
				}
			}			
		}

		// 'regular' Event model
		var Event = can.Model('Bithub.Models.Event', {

			init: function () {
				this.validate('title', function(title) {
					if (!title) { return "Title can't blank" }
				});
				this.validate('category', function(category) {
					if (!category) { return "Category can't be blank" }
					if (Bithub.Models.Tag.allowedCategoriesForNewPost.indexOf(category) < 0) { return "Picked category doesn't exist" }
				});
				this.validate('project', function(project) {
					if (!project) { return "Project can't be blank" }
					if (Bithub.Models.Tag.allowedProjectsForNewPost.indexOf(project) < 0) { return "Picked project doesn't exist" }
				});
				this.validate('datetime', function(datetimeStr) {
					if (datetimeStr) {
						var dt = datetimeStr.split('T'),
						date = dt[0], time = dt[1],
						datetime = moment(datetimeStr, "YYYY-MM-DDTHH:mm:ss.S Z");

						if (!time) { return "Time can't be blank" }
						if (!datetime || !datetime.isValid()) { return "Time format invalid.<br/>Should be 'hh:mm AM/PM'" }
					}
				});
			},

			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events',
			update  : 'PUT /api/events/{id}',
			destroy : 'DELETE /api/events/{id}',

			// overriden b/c can.Model would return new can.Observe,
			// so we are here returing only plain object
			model: function( attrs ) {
				return attrs;
			}
		}, prototypeMethods );

		// Event model list with LazyEvent
		can.Model.List('Bithub.Models.Event.List', {

			// creates new event of LazyMap and extends it with instance props from Event model
			Observe: function( data ) {
				var event = new can.LazyMap( data );

				can.extend(
					event,
					prototypeMethods,
					{
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
					}
				);
				
				return event;
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

					for(var i=0; i<days.length; i++) {
						var day = days[i];
						if ( day.date === event.attr('thread_updated_date')) {
							flag = true;
							if ( day[event.attr('category')] ) {
								day[event.attr('category')].push( idx );
							} else {
								day[event.attr('category')] = [idx];
							}
							break;
						}
					};

					if (!flag) {
						var day = {date: event.attr('thread_updated_date')};
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
