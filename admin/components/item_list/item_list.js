steal('can/component', './item_list.mustache', './item_list.less', function(Component, initView){

	var toString = function(val){
		return val + "";
	}

	return Component.extend({
		tag : 'bh-item-list',
		template : initView,
		scope : {
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
			},
			manageItem : function(ctx, el, ev){
				var val = el.val(),
					items = (this.attr('items') || []);

				if(ev.which === 8 && val === ''){
					items.pop();
				} else if(ev.which === 32 || ev.which === 188 || ev.which === 13){
					this.addItem(ctx, el, ev);
					ev.preventDefault();
				}
			}
		},
		helpers : {
			lowercased : function(str){
				return ((can.isFunction(str) ? str() : str) || "").toLowerCase();
			}
		},
		events : {
			".keyword-list click" : function(el, ev){
				if($(ev.target).is('.keyword-list')){
					el.find('input').focus();
				}
			}
		}
	})
})