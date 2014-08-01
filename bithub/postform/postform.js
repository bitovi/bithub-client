steal(
'can/component',
'./postform.mustache',
'bithub/models/event.js',
'bithub/models/tag.js',
'bithub/models/postas_user.js',
'vendor/fileupload',
function(Component, postformView, EventModel, TagModel, PostAsUserModel){

	var users;

	return Component.extend({
		tag : 'bh-postform',
		template : postformView,
		scope : {
			event : null,
			imageUploadProgress : 0,
			imageUploadError : false,
			__showAllErrors : false,
			postAsAvatar : null,
			serverError : null,
			hasImage : false,
			init : function(){
				if(this.attr('event') === null){
					this.attr('event', new EventModel());
				}

				if(!this.attr('event').isNew()){
					this.__oldEvent = this.attr('event');
					this.attr('event', new EventModel(this.attr('event').attr()));
					this.attr('event.project', this.getProjectForEvent());
				} else {
					this.attr('event').attr({
						project : can.route.attr('newpost_p'),
						category : can.route.attr('newpost_c')
					})
				}

				this.attr('__dirtyAttrs', []);
				this.attr('__errors', {});

			},
			eventCategories : function(){
				var categories = [],
					method = this.attr('event').isNew() ? 'NewPost' : 'ExistingPost';

				window.CATEGORIES.each(function(cat){
					if(TagModel['allowedCategoriesFor' + method].indexOf(cat.attr('name')) > -1){
						categories.push(cat);
					}
				});
				return categories;
			},
			eventProjects : function(){
				var projects = [],
					method = this.attr('event').isNew() ? 'NewPost' : 'ExistingPost';

				window.PROJECTS.each(function(project){
					if(TagModel['allowedProjectsFor' + method].indexOf(project.attr('name')) > -1){
						projects.push(project);
					}
				});
				return projects;
			},
			currentUser : function(){
				return window.CURRENT_USER;
			},
			availableTags : function(){
				var eventTags = this.attr('event.tags') || new can.List,
					category  = this.attr('event.category'),
					project   = this.attr('event.project');

				window.VISIBLE_TAGS.attr('length'); // trigger live binding
				eventTags.attr('length'); // trigger live binding

				return can.grep(window.VISIBLE_TAGS, function(tag){
					var tagName = tag.attr('name'),
						check = eventTags.indexOf(tagName) === -1;
					check = check && tagName !== category;
					check = check && tagName !== project;
					return check;
				}).sort(function(a, b){
					if(a.attr('name') > b.attr('name')){
						return 1;
					} else if(a.attr('name') < b.attr('name')){
						return -1;
					}
					return 0;
				});
			},
			eventTags : function(){
				var event    = this.attr('event')  || new can.List,
					category = event.attr('category') || new can.List,
					project  = event.attr('project') || new can.List,
					tags     = event.attr('tags') || new can.List;

				tags.attr('length'); // trigger live binding

				return _.uniq(can.grep(tags, function(tag){
					return tag !== project && tag !== category;
				}));
			},
			getProjectForEvent : function(){
				var event = this.attr('event'),
					tags = event.attr('tags').attr(),
					allowedTags = TagModel.allowedProjectsForNewPost;

				for(var i = 0; i < tags.length; i++){
					if(can.inArray(tags[i], allowedTags) > -1){
						return tags[i];
					}
				}
			},
			formAction : function(){
				var event = this.attr('event');

				if(event.isNew()){
					return '/api/v2/entities';
				}

				return can.sub('/api/v2/entities/{id}', event);
			},
			removeTag : function(tag){
				var tags = this.attr('event.tags'),
					index = tags.indexOf(tag);

				if(index > -1){
					tags.splice(index, 1);
				}
			},
			addTag : function(tag){
				this.attr('event.tags').push(tag.attr('name'));
			},
			removeImage : function(){
				this.attr('hasImage', false);
			}
		},
		helpers : {
			errorsFor : function(attr, opts){
				var errorsForAttr = this.attr('__errors.' + attr),
					dirty         = this.attr('__dirtyAttrs');

				if((this.attr('__showAllErrors') || dirty.indexOf(attr) > -1) && errorsForAttr){
					return opts.fn(errorsForAttr.join('<br>'));
				}
			},
			datepicker : function(){
				return function(el){
					var $datepicker = $(el);
					$datepicker.datepicker({format: 'mm/dd/yyyy', weekStart: 0});
				};
			},
			fileupload : function(){
				var self = this;
				return function(el){
					$(el).fileupload({
						datatype              : 'json',
						limitMultiFileUploads : 1,
						add                   : $.noop,
						type                  : self.attr('event').isNew() ? 'POST' : 'PUT',
						replaceFileInput      : false,
						url                   : self.formAction(),
						forceIframeTransport  : true,
						progress : function(e, data){
							self.attr('imageUploadProgress', parseInt(data.loaded / data.total * 100, 10));
						},
						fail : function(){
							self.attr('serverError', ['There was a problem with the image upload, please try again.']);
						}
					});
				};
			},
			typeahead : function(){
				var self = this;

				if(!this.attr('event.origin_author_feed')){
					this.attr('event.origin_author_feed', 'github');
				}

				return function(el){

					var $el = $(el);
					$el.typeahead({
						minLength: 3,
						source: function(query, process) {
							var feed = self.attr('event.origin_author_feed');

							clearTimeout(this.timeout);
							this.timeout = setTimeout(function () {
								PostAsUserModel.findAll({user : query, feed: feed}).then(function(list){
									users = list;
									process(can.map(list, function(user){
										return user.fullName();
									}));
								});
							}, 200);

						},
						matcher: function(item) {
							return (item && item.toLowerCase().indexOf(this.query.trim().toLowerCase()) > -1);
						},
						updater: function (item) {
							var key = item.split('/')[0].trim(),
								selectedUser;

							selectedUser = can.grep(users, function(user){
								return user.username === key;
							})[0];

							self.attr('event.origin_author_id', selectedUser.id);
							self.attr('event.origin_author_feed', selectedUser.from);
							self.attr('event.origin_author_name', selectedUser.fullName());

							self.attr('postAsAvatar', selectedUser.profileImageUrl());

							return item;
						}
					});

				};
			},
			removeBrokenPreviewImage : function(){
				return function(el){
					var $el = $(el);
					$el.on('error', function(){
						$el.remove();
					});
				};
			},
			isCurrentProject : function(name, opts){
				name = can.isFunction(name) ? name() : name;
				return name === this.attr('event.project') ? opts.fn() : "";
			},
			isCurrentCategory : function(name, opts){
				name = can.isFunction(name) ? name() : name;
				return name === this.attr('event.category') ? opts.fn() : "";
			}
		},
		events : {
			' fileuploadadd': function( el, ev, data ) {
				for( var i = 0; i < data.files.length; i++ ) {
					if( !data.files[i].name.match( /(\.|\/)(gif|jpe?g|png)$/i ) ) {
						this.scope.attr({
							imageUploadError : true,
							hasImage : false,
							imageUploadProgress : 0
						});
						el.find('.image-uploader .image-preview img').remove();

						delete this.__filedata;
						return;
					}
				}

				this.scope.attr({
					imageUploadError : false,
					hasImage : true
				});

				this.__fileData = data;

				window.loadImage(
					data.files[0],
					function (img) {
						el.find('.image-uploader .image-preview').html(img);
					}, {
						maxWidth: 140,
						maxHeight: 110,
						noRevoke: true
					}
				);
			},
			'{scope} hasImage' : function(hasImage, ev, newVal){
				var imageUrl;
				if(newVal === false){
					delete this.__fileData;

					this.element.find('.image-uploader .image-preview img').remove();
					imageUrl = this.scope.attr('event').postImageUrl();

					if(imageUrl){
						this.element.find('.image-uploader .image-preview').html('<img src="'+imageUrl+'">');
					}
				}
			},
			'{scope.event} change' : function(event, ev, attr, how, newVal){
				var dirty = this.scope.attr('__dirtyAttrs');
				if(dirty.indexOf(attr) === -1){
					dirty.push(attr);
				}
				this.scope.attr('__errors').attr(event.errors(), true);

				if(attr === 'category'){
					if(newVal === 'event'){
						this.scope.attr('event.datetime', moment().toDate());
					} else {
						this.scope.removeAttr('event.datetime');
					}
				}
			},
			'.event-time change' : function(el){
				var newTime = can.trim(el.val()).toUpperCase(),
					currentDateTime = this.scope.attr('event.datetime'),
					parsedTime = moment(newTime, [
						'H',
						'HH',
						'H:m',
						'H:mm',
						'HH:m',
						'HH:mm',
						'hA',
						'hhA',
						'h:mA',
						'h:mmA',
						'hh:mA',
						'hh:mmA'
					]),
					newDate;

				if(parsedTime && parsedTime.isValid()){
					newDate = moment(currentDateTime);
					newDate.hour(parsedTime.hour());
					newDate.minute(parsedTime.minute());

					this.scope.attr('event.datetime', newDate.toDate());
				}
				el.val(this.scope.attr('event').time());
			},
			'.newpost-datepicker changeDate': function( el ) {
				var newDate    = moment(this.scope.attr('event.datetime')),
					parsedDate = moment(el.find('input').val(), 'MM/DD/YYYY');

				newDate.date(parsedDate.date());
				newDate.month(parsedDate.month());
				newDate.year(parsedDate.year());

				this.scope.attr('event.datetime', newDate.toDate());

				el.datepicker('hide');
			},
			'form submit' : function(el, ev){
				var event = this.scope.attr('event'),
					errors = event.errors(),
					def;

				ev.preventDefault();

				this.scope.attr('serverError', null);

				if(errors){
					can.batch.start();
					this.scope.attr('__errors').attr(errors, true);
					this.scope.attr('__showAllErrors', true);
					can.batch.stop();
					return;
				}

				console.log(this.__fileData)

				if(this.__fileData){
					this.__fileData.formData = event.serializeToArray('event');
					def = this.__fileData.submit();
				} else {
					def = event.save();
				}

				this.scope.attr('isLoading', true);

				def.done(this.proxy('eventSaved'));
				def.fail(this.proxy('eventErrored'));
			},
			eventSaved : function(event){
				if(!(event instanceof EventModel)){
					event = EventModel.model(event);
				}

				if(this.scope.__oldEvent){
					this.scope.__oldEvent.attr(event.attr());
					can.trigger(this.scope.__oldEvent, 'updated');
				}

				this.element.trigger('event.saved');
			},
			eventErrored : function(req){
				var errorJSON = JSON.parse(req.responseText || '{}');
				this.scope.attr('serverError', errorJSON.errors || null);
				this.scope.attr('isLoading', false);
			}
		}
	});
});