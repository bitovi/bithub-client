steal('can/component', './multiselect.mustache', './multiselect.less', function(Component, initView){

	var toString = function(val){
		return val + "";
	}

	return Component.extend({
		tag : 'bh-multiselect',
		template : initView,
		scope : {
			title : "@",
			allowNonExistingItems : "@",
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
					if(typeof i === 'string'){
						return i;
					}
					return toString(i.attr('id'));
				});

				selectedItems.attr && selectedItems.attr('length');

				return can.grep(this.attr('items'), function(item){
					if(typeof item === 'string'){
						return selectedItemIds.indexOf(item) === -1;
					} else {
						return selectedItemIds.indexOf(toString(item.attr('id'))) === -1
					}
				})
			},
			existingSelectedItems : function(){
				var items         = this.attr('items') || [],
					selectedItems = this.attr('selectedItems') || [],
					ids           = can.map(items, function(i){ return toString(i.attr('id')) }),
					names         = can.map(items, function(i){ return toString(i.attr('name')) }),
					filteredItems = []

				items.attr && items.attr('length');
				selectedItems.attr && selectedItems.attr('length');

				if(this.attr('allowNonExistingItems')){
					filteredItems = selectedItems
				} else {
					filteredItems = can.grep(selectedItems, function(item){
						if(typeof item === 'string'){

							return names.indexOf(item) > -1;
						}
						return ids.indexOf(toString(item.attr('id'))) > -1;
					})
				}

				


				return can.map(filteredItems, function(item){
					if(typeof item === 'string'){
						return {
							name : item
						}
					}
					return item;
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