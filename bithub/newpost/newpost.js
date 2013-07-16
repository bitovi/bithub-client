steal(
	'can',
	'./init.mustache',
	'vendor/fileupload',
	'jquerypp/dom/form_params',
	function(can, initView, fileUpload){
		/**
		 * @class bithub/newpost
		 * @alias Newpost   
		 */

		function constructDateTimeString(rawDateString, rawTimeString) {
			var date = moment(rawDateString, "DD-MM-YYYY"),
				time = moment(rawTimeString, ["hh:mm a"]);

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
				return '#newpost-form-date p.text-error'
			} else {
				return '#newpost-form-' + name + ' p.text-error'
			}
		}

		function progress(data){
			return parseInt(data.loaded / data.total * 100, 10);
		}

		function closeNewPostForm(eventObj) {
			var self = this;
			can.route.attr({
				page: 'homepage',
				view: 'latest',
				category: eventObj.category,
				project: self.options.recentProject
			})
			setTimeout(function() {
				self.options.visibility(false);
			}, 1000);
		}

		function itemIsPartOfQueryString(query, item) {
			return (item && item.toLowerCase().indexOf(query.trim().toLowerCase()) > -1)
		}

		var currentCategory = new can.Observe({displayName: "Pick a category", name: "none"}),
			currentProject = new can.Observe({displayName: "Pick a project", name: "none"});

		return can.Control('Bithub.Newpost',
			/** @Static */
			{ },
			/** @Prototype */
			{
				init : function( el, options ){
					var self = this, filteredCategories;

					el.html(initView({
						projects: options.projects,
						categories: options.categories,
						currentProject: currentProject,
						currentCategory: currentCategory
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
							return moment().format("DD-MM-YYYY");
						},
						ifAdmin: function(opts) {
							return self.options.currentUser.attr('admin') ? opts.fn(this) : opts.inverse(this);
						},
						isOfEventContentType: function(opts) {
							return (currentCategory.attr('name') === 'event') ? opts.fn(this) : opts.inverse(this);
						},
						displayName: function(currObsObj) {
							return currObsObj.attr('displayName');
						},
						name: function(currObsObj) {
							return currObsObj.attr('name');
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

					// Only when admin attr changes, bind the post-as input field as typeahead
					self.options.currentUser.bind('admin', function ( ev, newVal, oldVal ) {
						el.find('#newpost-form-post-as input.typeahead').typeahead({
							minLength: 3,
							source: function(query, process) {
								var	feed = self.element.find('input[name=postas_feed]:checked').val(),
								queryStr = '/api/users/' + feed + '/' + query;

								if (this.timeout) {
									clearTimeout(this.timeout);
								}

								this.timeout = setTimeout(function () {					
									$.get(queryStr, function(data) {
										autocompleteUsers = [];
										mappedResponse = {};
										$.each(data, function (i, user) {
											if (feed === 'twitter') {
												mappedResponse[user.name + '_' + user.screen_name] = user;
												autocompleteUsers.push(user.name + " / " + user.screen_name);
											} else if (feed == 'github') {
												mappedResponse[user.name + '_' + user.username] = user;
												autocompleteUsers.push(user.name + " / " + user.username);
											}
										});
										process(autocompleteUsers);
									});
								}, 500);
							},
							matcher: function(item) {
								return itemIsPartOfQueryString(this.query, item);
							},
							updater: function (item) {
								var key = item.replace(' / ', '_');
								selectedUser = mappedResponse[key];
								var	feed = self.element.find('input[name=postas_feed]:checked').val();
								if (feed == 'twitter') {
									el.find('input.postas_id').val(selectedUser.id); 
									el.find('img.postas.avatar').attr('src', selectedUser.profile_image_url);
								} else if (feed == 'github') {
									el.find('input.postas_id').val(selectedUser.id.replace('user-', '')); 
									$.get('https://api.github.com/users/' + item.id, function (data) {
										el.find('img.postas.avatar').attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar_id + '?s=48'); 
									});
								}
								el.find('input.postas_feed').val(feed); 
								return item;
							}
						});
					});

					currentCategory.bind('name', function ( ev, newVal, oldVal ) {
						if (newVal == 'event') { $('.newpost-datepicker').datepicker() };
					});
					
				},

				' fileuploadadd': function( el, ev, data ) {
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

				'#newpost-form-project a click': function( el, ev ) {
					currentProject.attr('name', (can.data(el, 'project')).name);
					currentProject.attr('displayName', el.html());
				},
				
				'#newpost-form-category a click': function( el, ev ) {
					currentCategory.attr('name', (can.data(el, 'category')).name);
					currentCategory.attr('displayName', el.html());
				},
				
				'#hide-newpost-form-btn click': function( el, ev ) {
					ev.preventDefault();
					this.options.visibility( !this.options.visibility() );
				},

				'{visibility} change': function( el, ev ) {
					this.options.visibility() ? this.element.slideDown() : this.element.slideUp();
				},

				'button click': function( el, ev ) {
					ev.preventDefault();
				},

				'#newpost-form-submit click': function( el, ev ) {
					el.closest('form').submit();
				},

				' submit': function( el, ev ) {
					var self = this;
					ev.preventDefault();

					/* Set hidden datetime field */
					var rawDateString = el.find('.control-group.date input').val(),
						rawTimeString = el.find('.control-group.time input').val();
					el.find("input[name='event[datetime]']").val(constructDateTimeString(rawDateString, rawTimeString));

					var eventToCheck = new Bithub.Models.Event(el.formParams().event)
					var errors = eventToCheck.errors()

					self.element.find('p.text-error').hide()
					self.options.recentProject = el.formParams().event.project;
					if (this.options.fileData && !errors) {
						this.options.fileData.submit()
					} else if (!this.options.fileData && !errors){
						var event = new Bithub.Models.Event(el.formParams())
						event.save(function(newEvent) {
							closeNewPostForm.call(self, newEvent)
						});
					} else {
						for (e in errors) {
							self.element.find(errorElementName(e)).html(errors[e]).show();
						}
					}
				}
			});
	});
