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
				currentFunnel : null,
				init : function(){
					this.attr('funnels', new FunnelModel.List({}));
				},
				editFunnel : function(ctx){
					this.attr('currentFunnel', ctx);
				},
				newFunnel : function(){
					this.attr('currentFunnel', new FunnelModel);
				}
			}
		})

	});