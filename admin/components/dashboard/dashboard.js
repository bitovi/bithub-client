steal('can/util/string', 'can/component', './dashboard.mustache',  'bithub/homepage/event_list', './dashboard.less',function(can, Component, dashboardView, EventList){

	var items = [];

	for(var i = 0; i < 10; i++){
		items.push(i)
	}

	return can.Component({
		tag : 'dashboard',
		template : dashboardView,
		scope : {
			items : new can.List(items),
			onuserpage : '@'
		},
		helpers : {
			stage : function(stage, opts){
				var currentStage = parseInt(can.route.attr('stage') || 0);
				stage = can.isFunction(stage) ? stage() : stage;
				stage = parseInt(stage);

				return stage >= currentStage ? opts.fn() : opts.inverse();
			}
		},
		events : {
			init : function(el){
				setTimeout(function(){
					new EventList(el.find('.activity-wrap'), {
						page: 'homepage',
						view: 'latest',
						project: 'all',
						category: 'all',
						timespan: 'all'
					})
				})
			}
		}
	})

});