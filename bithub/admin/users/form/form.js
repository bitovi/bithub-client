steal(
	'can',
	'./form.ejs',
	'bithub/models/user.js',
	function(can, userFormView, User){
		return can.Control.extend({
			defaults : { 'User': User }
		}, {
			init : function(element, opts){
				element.html(userFormView({user: opts.user}));
			},

			'{can.route} action': function (f, ev, newVal, oldVal) {
			},

			'form submit' : function(el, ev) {
				ev.preventDefault();
				var role = el.find("input[name=role]").val();
				this.options.user.manageRoles('add', role);
			},

			'li button.remove-role click' : function (el, ev) {
				var role = el.closest('li').data('role');
				this.options.user.manageRoles('remove', role);
			},

			'{User} updated' : function(el, ev) {
			}
			
		});
	}
);
