steal('can/util/string', 'can/component', './dashboard.mustache', 'bithub/models/event.js', 'bithub/homepage/event_list/determine_event_partial.js', 'bithub/models/user.js', 'bithub/homepage/event_list', './dashboard.less',function(can, Component, dashboardView, EventModel, determineEventPartial, UserModel, EventList){

	var __templatesCache = {}

	window.CURRENT_USER = new UserModel

	return can.Component({
		tag : 'dashboard',
		template : dashboardView,
		scope : {
			init : function(){
				EventModel.findAll({}, this.proxy('updateItems'));
			},
			updateItems : function(items){
				this.attr('items', items);
			}
		},
		helpers : {
			stage : function(stage, opts){
				var currentStage = parseInt(can.route.attr('stage') || 0);
				stage = can.isFunction(stage) ? stage() : stage;
				stage = parseInt(stage);

				return stage >= currentStage ? opts.fn() : opts.inverse();
			},
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