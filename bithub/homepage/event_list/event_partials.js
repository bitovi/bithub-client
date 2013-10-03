steal(
	'can',
	'bithub/homepage/event_list/views/_event_children.ejs',
	'bithub/homepage/event_list/views/_event_child_event.ejs',
	'bithub/homepage/event_list/views/_digest.ejs',
	'bithub/homepage/event_list/views/_code.ejs',
	'bithub/homepage/event_list/views/__status_bar.ejs',
	'bithub/homepage/event_list/views/__manage_bar.ejs',
	'bithub/homepage/event_list/views/__toolbar.ejs',
	'bithub/homepage/event_list/views/__upvote.ejs',
	'bithub/homepage/event_list/determine_event_partial.js',
	function(can, eventChildrenPartial, eventChildEventPartial, digestPartial, codePartial, statusBarPartial, manageBarPartial, toolbarPartial, upvotePartial, determineEventPartial) {

		return {
			determineEvent: determineEventPartial,
			digest: digestPartial,
			code: codePartial,
			eventChildren: eventChildrenPartial,
			eventChildEvent: eventChildEventPartial,
			statusBar: statusBarPartial,
			manageBar: manageBarPartial,
			upvote: upvotePartial,
			toolbar: toolbarPartial
		}
	})
