steal(
	'can',
	'./user_profile.mustache!',
	'bithub/models/user.js',
	'bithub/models/activity.js',
	'bithub/homepage/event_list/determine_event_partial.js',
	'bithub/homepage/event_list/latest_events_sorter.js',
	'bithub/homepage/event_list/handlers',
	'bithub/entities',
	function(can, initView, UserModel, ActivityModel, determineEventPartial, LatestEventsSorter, Handlers){

		var currentControl;

		var __templatesCache = {};

		var latestCategories = ['event', 'twitter', 'bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'uncategorized'];

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

				this.events = new LatestEventsSorter()

				UserModel.findOne({id : id}, function(user){
					self.user(user);
				})

				new Handlers(this.element, {
					currentUser: this.options.currentUser,
					modals: this.options.modals
				});

				this.hasEvents = can.compute(false);
				this.loadedEvents = can.compute(false);

				this.loadActivities();
				this.initControl();
			},

			initControl : function () {
				var self = this;
				this.element.html(initView({
					user : this.user,
					isLoading : this.isLoading,
					data : this.events,
					loadedEvents : function(){
						return self.loadedEvents() && self.user();
					},
					hasEvents : this.hasEvents,
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
					},
					userUrls : function(user){
						return can.map(user.attr('reduced_identities'), function(identity){
							return can.sub('<a href="{url}" class="clearfix identity"><span class="login-{provider}"></span> {name}</a>', {
								url : identity.attr('profile_url'),
								name : identity.attr('username') || identity.attr('name'),
								provider : identity.attr('provider'),
							})
						}).join('')
					},
					pointInflector : function(score){
						score = can.isFunction(score) ? score() : score;
						return score === 1 ? "point" : "points"
					},
					dailyCategories : function(opts){
						return can.map(latestCategories, function(category){
							var events = opts.context.attr('types').attr(category);
							if(events && events.length){
								return opts.fn({
									currentCategory : category,
									events : events
								})
							}
							return '';
						}).join('');
					},
					entityComponent : function(events){

						if(typeof events.length === 'undefined'){
							events = [events];
						}

						return can.map(events, function(event){
							var component = determineEventPartial(event.attr('tags')),
								template = '<{c} event="event" inited="inited" user="user"></{c}>',
								result;

							if(typeof __templatesCache[component] === 'undefined'){
								__templatesCache[component] = can.view.mustache(can.sub(template, {c: component}));
							}

							result = __templatesCache[component].render({
								event  : event,
								inited : true,
								user   : self.user
							});

							return result;

						}).join('');
					}
				}));
			},

			//"{window} onbottom" : "loadActivities",
			loadActivities : function(){
				var id = can.route.attr('id')
				if(this.canLoad){
					/*this.isLoading(true);

					ActivityModel.findAll(can.extend({
						userId : can.route.attr('id')
					}, this.params), this.proxy('updateActivities'))

					this.params.offset = this.params.offset + this.params.limit;*/
					Bithub.Models.Event.findAll({
						author_id: id,
						order: 'thread_updated_ts:desc',
						limit: 500
					}, this.proxy('updateActivities'));
				}
			},
			updateActivities: function( events ) {
				this.events.appendEvents(events);
				this.loadedEvents(true);
				this.hasEvents(events.length > 0);
			}

		});
	}
);
