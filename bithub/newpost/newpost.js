steal(
	'can',
	'./init.mustache',
	'jquerypp/dom/form_params',
	function(can, initView){
		/**
		 * @class bithub/newpost
		 * @alias Newpost   
		 */
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

					this.element.html(initView({
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
						}
					}));

					el.find("input[name='event[project]']").val(el.find('#newpost-form-project .btn.select').html());
					el.find("input[name='event[category]']").val(el.find('#newpost-form-category .btn.select').html());
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

				'form submit': function( el, ev ) {
					ev.preventDefault();
					var event = new Bithub.Models.Event(el.formParams());
					event.save();
				}
				
			});
	});
