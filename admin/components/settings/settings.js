steal(
	'can/util/string',
	'can/component',
	'./settings.mustache',
	'admin/components/tag_form',
	'./settings.less'
	, function(can, Component, settingsView){

	return can.Component({
		tag : 'settings',
		template : settingsView,
		scope : {
			
		}
	})

});