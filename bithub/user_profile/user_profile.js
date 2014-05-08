steal(
	'can',
	'./user_profile.mustache',
	'bithub/models/user.js',
	'bithub/models/activity.js',
	function(can, initView, UserModel, ActivityModel){

		var currentControl;
		
		return can.Control.extend({
			pluginName: 'user_profile'
		}, {
			init : function (elem, opts) {
				var id = can.route.attr('id'),
					self = this;

				this.params = {
					limit: 200,
					offset : 0
				}
				this.canLoad = true;
				
				this.isLoading = can.compute(false);

				this.activities = new ActivityModel.List();
				this.user = can.compute(null);

				UserModel.findOne({id : id}, function(user){
					self.user(user);
				})

				this.loadActivities();
				this.initControl();
			},

			initControl : function () {
				
				this.element.html(initView({
					activities: this.activities,
					user : this.user,
					isLoading : this.isLoading,
					isLoggedIn : function(){
						return user.isLoggedIn();
					}
				}, {
					addPlus: function(val) {
						val = can.isFunction(val) ? val() : val;
						if(val > 0){
							return "+" + val;
						}
					},
					eventUrl: function() {
						var id;

						if( this.attr('type') == 'author' ) {
							id = this.attr('id');
						} else if( this.attr('type') == 'award' ) {
							id = this.attr('event_id');
						}
						
						return id ? can.route.url({page: 'eventdetails', id: id}) : 'javascript://';
					}
				}));
			},

			"{window} onbottom" : "loadActivities",
			loadActivities : function(){
				if(this.canLoad){
					this.isLoading(true);

					ActivityModel.findAll(can.extend({
						userId : can.route.attr('id')
					}, this.params), this.proxy('updateActivities'))

					this.params.offset = this.params.offset + this.params.limit;
				}
			},
			updateActivities :  function(activities){
				this.activities.push.apply(this.activities, activities);
				this.isLoading(false);

				if(activities.length < this.params.limit){
					this.canLoad = false
				}
			}
			
		});
	}
);
