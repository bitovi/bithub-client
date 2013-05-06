steal(
	'can',
	'./upvote.js',
	'bithub/helpers/group.js',
	'can/model/list',
	function (can, Upvote, helpers) {
		var Event = can.Model('Bithub.Models.Event', {
			init: function () {},

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
					return "unknown";
				}
			}
		});

		can.Model.List('Bithub.Models.Event.List', {
			latest: function () {
				this.attr('length');

				// group events by 'origin_date' into array of days
				var days = helpers.groupIntoArray( this, ['origin_date'] );

				// then for every day group events by 'category' into object with categories as keys
				$.each( days, function( i, day ) {
					day.value = helpers.groupIntoObject( day.value, ['category'] );

					// additionally group digest events by some miracle
					if (day.value.digest) {
						var digestGrouped = {
							followers: [],
							watchers: [],
							forkers: []
						};

						$.each(day.value.digest, function( i, event ) {							
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
						
						day.value.digest = digestGrouped;
					}
					
				});

				return days;				
			}
		});
		
		return Event;
	});
