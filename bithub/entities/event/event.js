steal(
'can/component',
'./event.mustache',
'bithub/entities/shared_helpers.js',
'bithub/homepage/event_list/components/status-bar',
'bithub/homepage/event_list/components/toolbar',
'bithub/homepage/event_list/components/manage-bar',
'bithub/homepage/event_list/components/upvote',
'bithub/homepage/event_list/components/tags',
function(Component, eventView, sharedHelpers){
	can.Component.extend({
		tag : 'bh-event',
		template : eventView,
		scope : {
			dateFormat : function(){
				var format = 'datetime',
					date = this.attr('currentdate');

				if( date && can.route.attr('view') == 'latest' && date == moment.utc(this.attr('origin_ts')).format('YYYY-MM-DD') ) format = 'time';
			
				return format;
			}
		},
		helpers : {
			eventUrl : sharedHelpers.eventUrl
		}
	})
})