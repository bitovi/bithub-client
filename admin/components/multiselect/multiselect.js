steal('can/component', './multiselect.mustache', './multiselect.less', function(Component, initView){
	return Component.extend({
		tag : 'bh-multiselect',
		template : initView,
		scope : {
			title : "@",
			init : function(){
			},
			selectItem : function(item){
				this.attr('selectedItems').push(item);
			},
			deselectItem : function(item){
				var index = this.attr('selectedItems').indexOf(item);
				this.attr('selectedItems').splice(index, 1);
			},
			notSelectedItems : function(){
				var selectedItems = this.attr('selectedItems') || [];
				var selectedItemIds = can.map(selectedItems, function(i){
					return i.attr('id');
				});

				selectedItems.attr('length')
				return can.grep(this.attr('items'), function(item){
					return selectedItemIds.indexOf(item.attr('id')) === -1;
				})
			}
		},
		helpers : {
			lowercased : function(str){
				return ((can.isFunction(str) ? str() : str) || "").toLowerCase();
			}
		}
	})
})