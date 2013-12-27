steal(
'can/component',
'./default.mustache',
'bithub/entities/shared_helpers.js',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
function(Component, defaultView, sharedHelpers){
	can.Component.extend({
		tag : 'bh-default',
		template : defaultView,
		scope : {
			childrenExpanded : false,
			childrenExistAndExpanded : function(){
				return this.attr('childrenExpanded') && this.attr('event.children').attr('length') > 0;
			}
		},
		helpers : {
			isEventUpvoted : sharedHelpers.isEventUpvoted,
			eventUrl : sharedHelpers.eventUrl,
			renderChildEvent : sharedHelpers.renderChildEvent
		}
	})
})