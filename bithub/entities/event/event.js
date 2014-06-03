steal(
'can/component',
'./event.mustache!',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
'bithub/entities/events.js',
function(Component, eventView, EntityState, sharedHelpers, sharedEvents){


	can.Component.extend({
		tag : 'bh-event',
		template : eventView,
		scope : EntityState.extend({
			inited : true,
			sortedChildren : function(){
				var children = this.attr('event.children');
				var sorted =  [].sort.call(children, function(a, b){

					var sortA = a.attr('props.response'),
						sortB = b.attr('props.response');
					if(sortA > sortB){
						return -1;
					} else if(sortB > sortA){
						return 1;
					}
					return 0;
				})
				return sorted
			}
		}),
		helpers : can.extend({}, sharedHelpers),
		events : can.extend({}, sharedEvents)
	})
})