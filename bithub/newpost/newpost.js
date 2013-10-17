steal(
	'can',
	'./init.mustache',
	'vendor/fileupload',
	'bithub/models/postas_user.js',
	'./typeahead',
	'jquerypp/dom/form_params',
	function(can, initView, fileUpload, PostasUser, initTypeahead){
		/**
		 * @class bithub/newpost
		 * @alias Newpost   
		 */

		function constructDateTimeString(rawDateString, rawTimeString) {
			var date = moment(rawDateString, "YYYY-MM-DD"),
				longTime = moment(rawTimeString, "hh:mm a"),
				shortTime = moment(rawTimeString, "hh a"),
				time;

			if (longTime || shortTime)
				time = longTime.isValid() ? longTime : shortTime;

			if (date && time && date.isValid() && time.isValid()) {
				date.hours(time.hours()); date.minutes(time.minutes());
				return date.toISOString();
			} else if (date && date.isValid() && (!time || !time.isValid())) {
				return date.format("YYYY-MM-DD")+"T"+rawTimeString;
			} else if (time && time.isValid() && (!date || !date.isValid())) {
				return rawDateString+"T"+time.format("HH:mm");
			} else {
				return rawDateString+"T"+rawTimeString;
			}
		}

		function errorElementName(name) {
			if (name == 'datetime') {
				return '#newpost-form-time p.text-error'
			} else {
				return '#newpost-form-' + name + ' p.text-error'
			}
		}

		function progress(data){
			return parseInt(data.loaded / data.total * 100, 10);
		}

		function closeNewPostForm(eventObj) {
			var self = this,
				attrs = can.route.attr();

			// if can.route remains the same trigger reload
			if( attrs.category === eventObj.category && attrs.project === self.options.recentProject ) {
				$([Bithub.Models.Event]).trigger('reload');
			} else {
				can.route.attr({
					page: 'homepage',
					view: 'latest',
					category: eventObj.category,
					project: self.options.recentProject
				});
			}

			setTimeout(function() { self.options.visibility(false) }, 1000);
			setTimeout(function() { self.resetForm.call(self) }, 1500);
		}

		var currentCategory = new can.compute(''),
			currentProject  = new can.compute(''),
			currentDateTime = new can.Observe({}),

			currentDateTimeStamp = can.compute(function() {
				var date = moment(currentDateTime.attr('date'), "MM/DD/YYYY").format("YYYY-MM-DD"),
					time = currentDateTime.attr('time'),
					combinedDateTime = constructDateTimeString(date, time);
				return combinedDateTime;
			});

		return can.Control('Bithub.Newpost',
			{ },
			/** @Prototype */
			{
				init : function( el, options ){
					var self = this, filteredCategories;

					options.category && currentCategory( options.category );
					options.project && currentProject( options.project );

					el.html(initView({
						projects: options.projects,
						categories: options.categories,
						category: currentCategory,
						project: currentProject,
						currentUser: options.currentUser,
						currentDateTimeStamp: currentDateTimeStamp
					}, {
						categoryFilter: function(categories, opts) {
							var buffer = "";
							categories.each(function(el) {
								if (Bithub.Models.Tag.allowedCategoriesForNewPost.indexOf(el.attr('name')) > -1) {
									buffer += opts.fn(el);
								}
							});
							return buffer;
						},
						today: function() {
							return moment().format("MM/DD/YYYY");
						},
						ifAdmin: function(arg, opts) {
							return arg.isAdmin() ? opts.fn(this) : opts.inverse(this);
						},
						isOfEventContentType: function(opts) {
							return (currentCategory() === 'event') ? opts.fn(this) : opts.inverse(this);
						},
						displayName: function(currObsObj) {
							return currObsObj.attr('displayName');
						},
						name: function(currObsObj) {
							return currObsObj.attr('name');
						},
						typeahead : initTypeahead(this.element),
						datepicker : function(){
							return function(el){
								$datepicker = $(el);
								$datepicker.datepicker({format: 'mm/dd/yyyy', weekStart: 0});
								currentDateTime.attr('date', $datepicker.find('input').val());
							}
						}
					}));

					el.fileupload({
						datatype: 'json',
						limitMultiFileUploads: 1,
						//acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
						add: function(el, data) {
							// check file names manually, `acceptFileTypes` seems not to be working
							for( var i=0; i < data.files.length; i++ ) {
								if( !data.files[i].name.match( /(\.|\/)(gif|jpe?g|png)$/i ) ) {
									return;
								}
							}
							self.options.fileData = data;
						}
					});
				},

				' fileuploadadd': function( el, ev, data ) {
					for( var i=0; i < data.files.length; i++ ) {
						if( !data.files[i].name.match( /(\.|\/)(gif|jpe?g|png)$/i ) ) {
							return;
						}
					}
					
					var loadingImage = window.loadImage(
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
					el.find('.progress').show().find('.bar').width(progress(data) + '%');
				},

				' fileuploaddone' : function( el, ev, data ) {
					var newEvent = new Bithub.Models.Event(data.result);
					closeNewPostForm.call(this, newEvent)
				},

				'#newpost-form-project select change': function( el, ev ) {
					ev.preventDefault();
					currentProject( el.val() );
				},

				'#newpost-form-category select change': function( el, ev ) {
					ev.preventDefault();
					currentCategory( el.val() );
				},

				'#newpost-form-date changeDate': function( el, ev ) {
					currentDateTime.attr('date', el.find('input').val());
					el.find('.newpost-datepicker').datepicker('hide');
				},

				'#newpost-form-time input blur': function( el, ev ) {
					currentDateTime.attr('time', el.val());
					
					var errors = new Bithub.Models.Event(this.element.formParams().event).errors();
					if (errors && errors.hasOwnProperty('datetime')) {
						el.closest('.control-group').find('p.text-error').html(errors['datetime']).show();
					} else {
						el.closest('.control-group').find('p.text-error').html("").hide();
					}
				},
				
				'#hide-newpost-form-btn click': function( el, ev ) {
					ev.preventDefault();
					this.options.visibility( !this.options.visibility() );
				},

				'{currentUser} isLoggedIn': function( wat, ev, attr, how, newVal, oldVal) {
					//if (!newVal || newVal === false) this.element.slideUp();
				},

				'{projects} length': function() {
					setTimeout(function() {
						// trigger change on currentProject
						var cur = currentProject();
						currentProject('');
						currentProject(cur);
					}, 0);
				},

				'{categories} length': function() {
					setTimeout(function() {
						// trigger change on currentCategory
						var cur = currentCategory();
						currentCategory('');
						currentCategory(cur);
					}, 0);
				},

				'{visibility} change': function( el, ev ) {
					this.options.visibility() ? this.element.slideDown() : this.element.slideUp();
				},

				'button click': function( el, ev ) {
					ev.preventDefault();
				},

				'#newpost-form-submit click': function( el, ev ) {
					el.button('loading');
					el.closest('form').submit();
				},

				' submit': function( el, ev ) {
					ev.preventDefault();

					if( !this.options.currentUser.isLoggedIn() ) {
						this.options.modals.showLogin();
						return;
					}
					
					var self = this;
					var submitBtn = el.find('#newpost-form-submit');

					var eventToCheck = new Bithub.Models.Event(el.formParams().event)
					var errors = eventToCheck.errors()

					self.element.find('p.text-error').hide()
					self.options.recentProject = el.formParams().event.project;
					if (this.options.fileData && !errors) {
						this.options.fileData.submit();
					} else if (!this.options.fileData && !errors){
						var event = new Bithub.Models.Event(el.formParams())
						event.save(function(newEvent) {
							closeNewPostForm.call(self, newEvent);
						});
					} else {
						submitBtn.button('reset');
						for (e in errors) {
							self.element.find(errorElementName(e)).html(errors[e]).show();
						}
					}
				},

				resetForm: function() {
					var el = this.element;

					// reset submit button
					el.find('#newpost-form-submit').button('reset');

					// clear input fields (including hidden ones)
					el.find('input').val('');
					el.find('textarea').val('');
					el.find('select').val('');

					// hide post-as avatar
					el.find('.postas.avatar').attr('src','');
					
					// reset category and project dropdown
					currentCategory('');

					// clear image
					delete this.options.fileData;
					el.find('.progress').hide().find('.bar').width('0%');
					el.find('.image-uploader .image-preview').html('');
				},

				'{can.route} newpost_c': function( route, ev, newVal, oldVal ) {
					currentCategory( newVal );
				},
				
				'{can.route} newpost_p': function( route, ev, newVal, oldVal ) {
					currentProject( newVal );
				}
				
			});
	});
