steal(
	'can',
	'./form.mustache!',
	'bithub/models/tag.js',
	'jquerypp/dom/form_params',
	function(can, tagFormView, Tag){
		return can.Control.extend({
			defaults : { 'Tag': Tag }
		}, {
			init : function(element, opts){
				element.html(tagFormView({tag: opts.tag}));
			},
			' submit' : function(el, ev) {
				ev.preventDefault();
				this.options.tag.attr(this.element.formParams());
				this.options.tag.save();
			},
			
			'{Tag} created' : function(el, ev) {
				can.route.attr({ page: 'admin', view: 'tags', action: 'list' });
			},

			'{Tag} updated' : function(el, ev) {
				can.route.attr({ page: 'admin', view: 'tags', action: 'list' });
			}
		});
	}
);
