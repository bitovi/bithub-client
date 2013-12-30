steal(
'can/component',
'./push.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
function(Component, pushView, EntityState, sharedHelpers){
	can.Component.extend({
		tag : 'bh-push',
		template : pushView,
		scope : EntityState.extend({
			inited : true
		}),
		helpers : can.extend({}, sharedHelpers)
	})
})