steal(
	'can/util/string',
	'can/component',
	'./categories.mustache',
	'admin/models/funnel.js',
	'admin/components/category_form',
	function(can, Component, categoriesView, FunnelModel){

		return can.Component({
			tag : 'categories',
			template : categoriesView,
			scope : {
				init : function(){
					this.attr('currentCategory', new FunnelModel)
				}
			}
		})

	});