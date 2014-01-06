steal(
'can/component',
'./postform.mustache',
'bithub/models/event.js',
'bithub/models/tag.js',
'bithub/models/postas_user.js',
'vendor/fileupload',
function(Component, postformView, EventModel, TagModel, PostAsUserModel){
	return Component.extend({
		tag : 'bh-postform',
		template : postformView,
		scope : {
			event : null,
			imageUploadProgress : 0,
			imageUploadError : false,
			__showAllErrors : false,
			postAsAvatar : null,
			init : function(){
				if(this.attr('event') === null){
					this.attr('event', new EventModel);
				}

				if(!this.attr('event').isNew()){
					this.__oldEvent = this.attr('event');
					this.attr('event', new EventModel(this.attr('event').attr()))
					this.attr('event.project', this.getProjectForEvent())
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
				return window.PROJECTS;
			},
			currentUser : function(){
				return window.CURRENT_USER;
			},
			availableTags : function(){
				var eventTags = this.attr('event.tags');

				window.VISIBLE_TAGS.attr('length'); // trigger live binding
				eventTags.attr('length'); // trigger live binding

				return can.grep(window.VISIBLE_TAGS, function(tag){
					return eventTags.indexOf(tag.attr('name')) === -1;
				});
			},
			eventTags : function(){
				var event    = this.attr('event'),
					category = event.attr('category'),
					project  = event.attr('project')
					tags     = event.attr('tags');

				tags.attr('length'); // trigger live binding

				return _.uniq(can.grep(tags, function(tag){
					return tag !== project && tag !== category;
				}))
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
					return "/api/events";
				}

				return can.sub("/api/events/{id}", event);
			},
			removeTag : function(tag, el, ev){
				var tags = this.attr('event.tags'),
					index = tags.indexOf(tag);

				if(index > -1){
					tags.splice(index, 1);
				}
			},
			addTag : function(tag, el, ev){
				this.attr('event.tags').push(tag.attr('name'));
			}
		},
		helpers : {
			errorsFor : function(attr, opts){
				var errorsForAttr = this.attr('__errors.' + attr),
					dirty         = this.attr('__dirtyAttrs');

				if((this.attr('__showAllErrors') || dirty.indexOf(attr) > -1) && errorsForAttr){
					return opts.fn(errorsForAttr.join('<br>'))
				}
			},
			datepicker : function(){
				return function(el){
					$datepicker = $(el);
					$datepicker.datepicker({format: 'mm/dd/yyyy', weekStart: 0});
				}
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
									}))
								});
							}, 200);
							
						},
						matcher: function(item) {
							return (item && item.toLowerCase().indexOf(this.query.trim().toLowerCase()) > -1)
						},
						updater: function (item) {
							var key = item.split('/')[0].trim();
							selectedUser = can.grep(users, function(user){
								return user.username === key;
							})[0];

							self.attr('event.origin_author_id', selectedUser.id);
							self.attr('event.origin_author_feed', selectedUser.from);

							self.attr('postAsAvatar', selectedUser.profileImageUrl());

							return item;
						}
					});

				}
			},
			removeBrokenPreviewImage : function(){
				return function(el){
					var $el = $(el);
					$el.on('error', function(){
						$el.remove();
					})
				}
			}
		},
		events : {
			" inserted" : function(){
				this.element.fileupload({
					datatype              : 'json',
					limitMultiFileUploads : 1,
					add                   : $.noop,
					type                  : this.scope.attr('event').isNew() ? "POST" : "PUT"
				});
			},
			' fileuploadadd': function( el, ev, data ) {
				for( var i = 0; i < data.files.length; i++ ) {
					if( !data.files[i].name.match( /(\.|\/)(gif|jpe?g|png)$/i ) ) {
						this.scope.attr('imageUploadError', true);
						el.find('.image-uploader .image-preview img').remove();
						delete this.__filedata;
						return;
					}
				}
				
				this.scope.attr('imageUploadError', false);

				this.__fileData = data;
				
				window.loadImage(
					data.files[0],
					function (img) {
						el.find('.image-uploader .image-preview').html(img);
					}, {
						maxWidth: 150,
						maxHeight: 120,
						noRevoke: true
					}
				);
			},
			' fileuploadprogress' : function( el, ev, data ){
				this.scope.attr('imageUploadProgress', parseInt(data.loaded / data.total * 100, 10));
			},
			"{scope.event} change" : function(event, ev, attr, how, newVal, oldVal){
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
			".event-time change" : function(el, ev){
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
			'.newpost-datepicker changeDate': function( el, ev ) {
				var newDate    = moment(this.scope.attr('event.datetime')),
					parsedDate = moment(el.find('input').val(), 'MM/DD/YYYY');

				newDate.date(parsedDate.date());
				newDate.month(parsedDate.month());
				newDate.year(parsedDate.year());

				this.scope.attr('event.datetime', newDate.toDate());

				el.datepicker('hide');
			},
			"form submit" : function(el, ev){
				var event = this.scope.attr('event'),
					errors = event.errors(),
					def;

				ev.preventDefault();

				if(errors){
					can.batch.start();
					this.scope.attr('__errors').attr(errors, true);
					this.scope.attr('__showAllErrors', true);
					can.batch.stop();
					return;
				}

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
			eventErrored : function(){
				this.scope.attr('isLoading', false);
			}
		}
	})
})