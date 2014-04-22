steal('can/util', 'can/component', './select.mustache', function(can, Component, initView){
	can.Component.extend({
		tag :'foo-select',
		template : initView,
		scope : {
			changeValue : function(item, el){
				var self = this;
				can.map(this.attr('fitness'), function(f){
					if(f.attr('id') == el.val()){
						f.attr('selected', true);
					} else {
						f.attr('selected', false);
					}
				})
			},
			selectedModel : function(){
				return can.grep(this.attr('fitness'), function(f){
					return f.attr('selected') === true;
				})[0];
			}
		}
	})
})