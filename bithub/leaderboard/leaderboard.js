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
			}));

			this.__updatedUsers = false;
		},
		"{users} length" : function(){
			if(!this.__updatedUsers){
				this.replaceUsers(this.element.find('.include-admins'));
				this.__updatedUsers = true;
			}
		},
		".include-admins change" : "replaceUsers",
		replaceUsers : function(el, ev){
			var val = el.val(),
				users = val === 'include-admins' ? this.options.users : filterAdmins(this.options.users),
				self = this,
				appendUsers = function(){
					self.users.push.apply(self.users, users.splice(0, 20));
					if(users.length > 0){
						self.__appendUsers = setTimeout(appendUsers, 1);
					}
				}

			clearTimeout(this.__appendUsers);
			this.users.splice(0);
			appendUsers();
			
		}
	})
})