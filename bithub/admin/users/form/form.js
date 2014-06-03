steal(
	'can',
	'./form.mustache!',
	'bithub/models/user.js',
	'bithub/profile/info',
	function(can, userFormView, User, UserInfo){
		return can.Control.extend({
			defaults : { 'User': User }
		}, {
			init : function(){
				this.element.html(userFormView({user: this.options.user}));
				new UserInfo(this.element.find('.user-info'), {
					currentUser : this.options.user,
					isEditing : true
				})
			},

			'{can.route} action': function (f, ev, newVal, oldVal) {
			},

			'form submit' : function(el, ev) {
				ev.preventDefault();
				var role = el.find("input[name=role]").val();
				this.options.user.manageRoles('add', role);
				this.element.find('input[name=role]').val("");
			},

			'li button.remove-role click' : function (el, ev) {
				ev.preventDefault();
				if(confirm('Are you sure?')){
					var role = el.closest('li').data('role');
					this.options.user.manageRoles('remove', role);
				}
				
			}
			
		});
	}
);
