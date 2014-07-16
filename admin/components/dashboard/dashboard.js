steal('can/util/string', 'can/component', './dashboard.mustache', 'bithub/models/event.js', 'bithub/homepage/event_list/determine_event_partial.js', 'bithub/models/user.js', 'bithub/models/funnel.js', 'bithub/homepage/event_list', './dashboard.less',function(can, Component, dashboardView, EventModel, determineEventPartial, UserModel, FunnelModel, EventList){

	var __templatesCache = {}

	window.CURRENT_USER = new UserModel

	return can.Component({
		tag : 'dashboard',
		template : dashboardView,
		scope : {
			init : function(){
				var self = this;
				this.loadNextPage();
				FunnelModel.findAll({}, function(data){
					self.attr('funnels').replace(data);
				});
			},
			items: [],
			funnels : [],
			isLoading : false,
			currentFunnel : null,
			loadNextPage : function(){
				var params = {
					order: 'thread_updated_ts:desc',
					limit: 50,
					offset: this.attr('items.length')
				}

				var currentFunnel = this.attr('currentFunnel');

				if(currentFunnel){
					params.funnel_name = currentFunnel;
				}

				this.attr('isLoading', true);
				EventModel.findAll(params, this.proxy('updateItems'));
			},
			updateItems : function(newItems){
				var items = this.attr('items');
				items.push.apply(items, newItems);
				this.attr('isLoading', false);
			}
		},
		events : {
			"{scope} currentFunnel" : function(){
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