steal('can/control', './leaderboard.mustache', function(Control, initView){

	var filterAdmins = function(users){
		return can.grep(users, function(user){
			return !user.attr('roles') || user.attr('roles').length === 0;
		})
	}

	return Control.extend({
		init : function(){
			var self = this;
			this.users = new Bithub.Models.User.List(filterAdmins(this.options.users));
			this.element.html(initView({
				users : this.users,
				isAdmin : function(){
					return self.options.currentUser.isAdmin();
				}
			}, {
				calcIndex : function(index){
					var val = parseInt((can.isFunction(index) ? index() : index), 10) + 1;
					if(val < 10){
						val = "00" + val;
					} else if(val < 100){
						val = "0" + val;
					}
					return val;
				}
			}))
		},
		"{users} length" : function(){
			this.replaceUsers(this.element.find('.include-admins'));
		},
		".include-admins change" : "replaceUsers",
		replaceUsers : function(el, ev){
			var val = el.val();
			if(val === 'include-admins'){
				this.users.replace(this.options.users);
			} else {
				this.users.replace(filterAdmins(this.options.users));
			}
		}
	})
})