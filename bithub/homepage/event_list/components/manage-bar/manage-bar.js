steal('can/component', './manage-bar.mustache', function(Component, manageBarView){
	Component.extend({
		tag : 'bh-manage-bar',
		template : manageBarView,
		scope : {
			projects : function(){
				return window.PROJECTS;
			},
			categories : function(){
				return window.CATEGORIES;
			}
		}
	})
})