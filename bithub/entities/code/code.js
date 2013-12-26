steal('can/component', function(Component){
	can.Component.extend({
		tag : 'bh-code',
		template : 'foo',
		scope : {
			init : function(){
				console.log(this)
			}
		}
	})
})