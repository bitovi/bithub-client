steal(
	'can',
	'bithub/homepage/event_list/views/_event_children.ejs',
	'bithub/homepage/event_list/views/_event_child_event.ejs',
	'bithub/homepage/event_list/views/_digest.ejs',
	'bithub/homepage/event_list/views/_code.ejs',
	'bithub/homepage/event_list/views/_manage_bar.ejs',
	'bithub/homepage/event_list/determine_event_partial.js',
	function(can, eventChildrenPartial, eventChildEventPartial, digestPartial, codePartial, manageBarPartial, determineEventPartial) {

		return {
			determineEvent: determineEventPartial,
			digest: digestPartial,
			code: codePartial,
			eventChildren: eventChildrenPartial,
			eventChildEvent: eventChildEventPartial,
			manageBar: manageBarPartial
		}
	})
