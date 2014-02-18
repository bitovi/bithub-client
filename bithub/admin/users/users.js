steal(
	'can',
	'./users.mustache',
	'bithub/models/user.js',
	'./form/form.js',
	'../paginator.js',
	function(can, usersListView, User, userFormControl, Paginator) {
		
		var isFormAction = function (route) {
			return route === 'edit' || route === 'new';
		}
		
		var paginationUrlParams = {
			page    : 'admin',
			view    : 'users',
			action  : 'list'
		}

		var buildPaginationUrl = function(offset){
			return can.route.url(can.extend({
				offset : offset
			}, paginationUrlParams));
		}

		var paginator;
		return can.Control.extend({
			pluginName: 'admin-users',
			defaults : { }
		}, {
			init : function(element, opts){
				paginator = new Paginator(can.route.attr('offset'));
				if (isFormAction(can.route.attr('action'))) {
					this.loadForm();
				} else {
					this.loadList();
				}
			},

			loadForm: function () {
				var self = this;
				if (can.route.attr('id')) {
					User.findOne({id: can.route.attr('id')}, function(user) {
						new userFormControl(self.element, {user: user});
					});
				} else  {
					new userFormControl(self.element, {user: new User()});
				}
			},

			loadList: function () {
				var self = this;
				User.findAll(can.extend(paginator.currentState(), {order: 'name:asc'}), function(users) {
					self.element && self.element.html(usersListView({
						users: users,
						prevOffsetUrl: function(){
							return buildPaginationUrl(paginator.prevOffset());
						},
						nextOffsetUrl: function(){
							return buildPaginationUrl(paginator.nextOffset());
						}
					}, {
						editUserUrl : function(user){
							return can.route.url({
								page   : 'admin',
								view   : 'users',
								action :'edit',
								id     : user.id
							});
						}
					}));
				});
			},
			
			'{can.route} offset': function(j, d, newVal, oldVal) {
				if(newVal){
					paginator.updateOffset(newVal);
					this.loadList();
				}
			},

			'{can.route} action': function (route, ev, newVal, oldVal) {
				if (isFormAction(newVal)) {
					this.loadForm();
				} else {
					this.loadList();
				}
			},
			'.delete-user click' : function(el, ev){
				var user = el.closest('tr').data('user');
				if(confirm('Are you sure?')){
					user.destroy();
				}
			}
		});
	}
);
