steal(
'can/component',
'./default.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
function(Component, defaultView, EntityState, sharedHelpers){
	can.Component.extend({
		tag : 'bh-default',
		template : defaultView,
		scope : EntityState.extend({
			inited : true
		}),
		helpers : can.extend({}, sharedHelpers)
	})
})