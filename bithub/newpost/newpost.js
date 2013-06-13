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

		function errorElementName(name) {
			return '#newpost-form-' + name + ' p.text-error'
		}

		function progress(data){
			return parseInt(data.loaded / data.total * 100, 10);
		}

		function closeNewPostForm(eventId) {
			var self = this;
			can.route.attr({page: 'eventdetails', eventId: eventId})
			setTimeout(function() {
				self.options.visibility(false);
			}, 1000);
		}

		function itemIsPartOfQueryString(query, item) {
			return (item && item.toLowerCase().indexOf(query.trim().toLowerCase()) > -1)
		}

		return can.Control('Bithub.Newpost',
			/** @Static */
			{
				defaults : {
					allowedCategories: ['article', 'app', 'plugin']
				}
			},
			/** @Prototype */
			{
				init : function( el, options ){
					var self = this, filteredCategories;

					el.html(initView({
						projects: options.projects,
						categories: options.categories
					}, {
						categoryFilter: function(categories, opts) {
							var buffer = "";
							categories.each(function(el) {
								if (self.options.allowedCategories.indexOf(el.attr('name')) > -1) {
									buffer += opts.fn(el);
								}
							});
							return buffer;
						},
						ifAdmin: function( opts ) {
							return self.options.currentUser.attr('admin') ? opts.fn(this) : opts.inverse(this);
						}
					}));

					el.find("input[name='event[project]']").val(el.find('#newpost-form-project .btn.select').html());
					el.find("input[name='event[category]']").val(el.find('#newpost-form-category .btn.select').html());

					el.fileupload({
						datatype: 'json',
						limitMultiFileUploads: 1,
						add: function(el, data) {
							self.options.fileData = data;
						}
					});

					el.find('input.typeahead').typeahead({
						minLength: 3,
						source: function(query, process) {
							var	feed = self.element.find('input[name=postas_feed]:checked').val(),
							queryStr = '/api/users/' + feed + '/' + query

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
					
				},

				' fileuploadadd': function( el, ev, data ) {
					var loadingImage = window.loadImage(
						data.files[0],
						function (img) {
							el.find('.image-preview').html(img);
						}, {
							maxWidth: 150,
							maxHeight: 120
						}
					);
				},
				
				' fileuploadprogress' : function( el, ev, data ){
					el.find('.progress').show().find('.bar').width(progress(data) + '%');
				},

				' fileuploaddone' : function( el, ev, data ) {
					var newEvent = new Bithub.Models.Event(data.result);
					closeNewPostForm.call(this, newEvent.id)
				},

				'#newpost-form-project a click': function( el, ev ) {
					el.closest('.btn-group').find('.btn.select').html(el.html());
					el.closest('form').find("input[name='event[project]']").val(can.data(el, 'project').name);
				},
				
				'#newpost-form-category a click': function( el, ev ) {
					el.closest('.btn-group').find('.btn.select').html(el.html());
					el.closest('form').find("input[name='event[category]']").val(can.data(el, 'category').name);
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

					var eventToCheck = new Bithub.Models.Event(el.formParams().event)
					var errors = eventToCheck.errors()

					self.element.find('p.text-error').hide()
					if (this.options.fileData && !errors) {
						this.options.fileData.submit()
					} else if (!this.options.fileData && !errors){
						var event = new Bithub.Models.Event(el.formParams())
						event.save(function(newEvent) {
							closeNewPostForm.call(self, newEvent.id)
						});
					} else {
						for (e in errors) {
							self.element.find(errorElementName(e)).html(errors[e]).show();
						}
					}
				}
			});
	});
