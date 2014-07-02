steal('can/component', './multiselect.mustache', './multiselect.less', function(Component, initView){

	var toString = function(val){
		return val + "";
	}

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
					return toString(i.attr('id'));
				});

				selectedItems.attr && selectedItems.attr('length');

				return can.grep(this.attr('items'), function(item){
					return selectedItemIds.indexOf(toString(item.attr('id'))) === -1;
				})
			},
			existingSelectedItems : function(){
				var items         = this.attr('items') || [],
					selectedItems = this.attr('selectedItems'),
					ids           = can.map(items, function(i){ return toString(i.attr('id')) });

				items.attr && items.attr('length');
				selectedItems.attr && selectedItems.attr('length');

				return can.grep(this.attr('selectedItems') || [], function(item){
					return ids.indexOf(toString(item.attr('id'))) > -1;
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