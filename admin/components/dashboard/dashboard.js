steal('can/util/string', 'can/component', './dashboard.mustache', 'bithub/models/event.js', 'bithub/homepage/event_list/determine_event_partial.js', 'bithub/models/user.js', 'bithub/homepage/event_list', './dashboard.less',function(can, Component, dashboardView, EventModel, determineEventPartial, UserModel, EventList){

	var __templatesCache = {}

	window.CURRENT_USER = new UserModel

	return can.Component({
		tag : 'dashboard',
		template : dashboardView,
		scope : {
			init : function(){
				this.loadNextPage();
			},
			items: [],
			isLoading : false,
			currentProvider : 'all',
			loadNextPage : function(){
				var params = {
					order: 'thread_updated_ts:desc',
					limit: 50,
					offset: this.attr('items.length')
				}
				var currentProvider = this.attr('currentProvider');

				if(currentProvider !== 'all'){
					params.category = currentProvider;
				}

				this.attr('isLoading', true);
				EventModel.findAll(params, this.proxy('updateItems'));
			},
			updateItems : function(newItems){
				var items = this.attr('items');
				items.push.apply(items, newItems);
				this.attr('isLoading', false);
			},
			identities : function(){
				return window.BRAND.attr('identities');
			}
		},
		events : {
			"{scope} currentProvider" : function(){
				this.scope.attr('items').splice(0);
				this.scope.loadNextPage();
			}
		},
		helpers : {
			renderEntity : function(event){
				var component = determineEventPartial(event.attr('tags')),
					template = '<{c} currentdate="date" event="event" inited="inited" user="user"></{c}>',
					result;

				if(typeof __templatesCache[component] === 'undefined'){
					__templatesCache[component] = can.view.mustache(can.sub(template, {c: component}));
				}

				result = __templatesCache[component].render({
					date   : null,
					event  : event,
					inited : true,
					user   : window.CURRENT_USER
				});

				return result;
			}
		}
	})

});