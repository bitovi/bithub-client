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
			
		var EventObj = can.LazyMap.extend( prototypeMethods );

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
				this.validate('url', function(url) {
					if( url ) {
						if( !url.match("^http[s]?:\\/\\/(www\\.)?") ) { return "Invalid URL (don't forget 'http[s]://')" }
					}
				});
			},

			findAll : 'GET /api/events',
			findOne : 'GET /api/events/{id}',
			create  : 'POST /api/events',
			update  : 'PUT /api/events/{id}',
			destroy : 'DELETE /api/events/{id}',

			// overriden b/c can.Model would return new can.Observe,
			model: function( attrs ) {
				return new EventObj( attrs );
			}
			
		}, prototypeMethods );
		
		return Event;
	});
