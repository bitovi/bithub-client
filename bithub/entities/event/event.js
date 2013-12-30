steal(
'can/component',
'./event.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
function(Component, eventView, EntityState, sharedHelpers){
	can.Component.extend({
		tag : 'bh-event',
		template : eventView,
		scope : EntityState.extend({
			inited : true
		}),
		helpers : can.extend({}, sharedHelpers)
	})
})