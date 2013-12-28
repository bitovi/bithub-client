steal(
'can/component',
'./issue.mustache',
'./child.mustache',
'bithub/entities/shared_helpers.js',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
function(Component, issueView, childEventView, sharedHelpers){
	can.Component.extend({
		tag : 'bh-issue',
		template : issueView,
		scope : {
			inited : false,
			childrenExpanded : false,
			childrenExistAndExpanded : function(){
				return this.attr('childrenExpanded') && this.attr('event.children').attr('length') > 0;
			}
		},
		helpers : {
			isEventUpvoted : sharedHelpers.isEventUpvoted,
			eventUrl : sharedHelpers.eventUrl,
			renderChildEvent : sharedHelpers.renderChildEvent,
			isAwarded : function(event, opts){
				return event.attr('props.thread_awarded');
			},
			double : function(val){
				val = can.isFunction(val) ? val() : val;
				can.__clearReading();
				return parseInt(val) * 2;
			},
			canBeAwarded : function(event, opts){
				var user = this.attr('user'),
					check;

				check = this.attr('data.awardBtn') && !event.attr('props.thread_awarded');
				check = check && user.loggedIn() && user.isAdmin();

				return check ? opts.fn() : "";
			}
		}
	})
})