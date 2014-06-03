steal(
	'can',
	'bithub/models/activity.js',
	'./activities.mustache!',
	function(can, ActivityModel, activitiesView){

		var whitelistedTypes = ['author', 'award', 'internal'];

		var calcPoints = function( event ) {
			var sum = parseInt( event.attr('value') );
			
			if( event.attr('upvotes') ) sum += parseInt( event.attr('upvotes'), 10 );

			return sum;
		}
		
		return can.Control.extend({
			pluginName: 'profile-activities',
			defaults : {}
		}, {
			init : function(element, options){
				var user = options.currentUser,
					routes = options.routes;

				this.params = {
					limit: 200,
					offset : 0
				}

				this.canLoad = true;
				
				this.isLoading = can.compute(false);

				this.activities = new ActivityModel.List();
				
				element.html(activitiesView({
					activities: this.activities,
					routes: routes,
					isLoading : this.isLoading,
					isLoggedIn : function(){
						return user.isLoggedIn();
					}
				}, {
					helpers: {
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
					},
					partials: {}
				}));
				if(user.isLoggedIn()){
					this.loadActivities();
				}
			},
			"{currentUser} authStatus" : function(user, ev, newVal){
				if(newVal === 'loggedIn'){
					this.loadActivities();
				}
			},
			"{window} onbottom" : "loadActivities",
			loadActivities : function(){
				if(this.canLoad){
					this.isLoading(true);

					ActivityModel.findAll(can.extend({
						userId : this.options.currentUser.attr('id')
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
