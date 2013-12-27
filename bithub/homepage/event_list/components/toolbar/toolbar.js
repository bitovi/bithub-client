steal('can/component', './toolbar.mustache', function(Component, toolbarView){
	can.Component.extend({
		tag : 'bh-toolbar',
		template : toolbarView
	})
})