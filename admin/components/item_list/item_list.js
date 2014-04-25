steal('can/component', './item_list.mustache', './item_list.less', function(Component, initView){

	var toString = function(val){
		return val + "";
	}

	return Component.extend({
		tag : 'bh-item-list',
		template : initView,
		scope : {
			title : "@",
			init : function(){

			},
			addItem : function(ctx, el, ev){
				var val = el.val(),
					items = this.attr('items');
				if(val.length > 0 && items.indexOf(val) === -1){
					items.push(val);
				}
				el.val("");
			},
			removeItem : function(item, el, ev){
				var items = this.attr('items'),
					index = items.indexOf(item);

				items.splice(index, 1);
			}
		},
		helpers : {
			lowercased : function(str){
				return ((can.isFunction(str) ? str() : str) || "").toLowerCase();
			}
		},
		events : {
			'button click' : function(){
				var el = this.element.find('input');
				this.scope.addItem(this.scope, el)
			}
		}
	})
})