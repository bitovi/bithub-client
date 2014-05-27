steal(
'can/util/string',
'can/component',
'./tag_selection.mustache',
'admin/models/tag.js',
'./tag_selection.less',
function(can, Component, tagSelectionView, TagModel){

	return can.Component({
		tag : 'bh-tag-selection',
		template : tagSelectionView,
		scope : {
			init : function(){
				this.attr('tags', new TagModel.List({}));
			}
		}
	})

});