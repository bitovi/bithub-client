steal(
	'can/util/string',
	'can/component',
	'./categories.mustache',
	'admin/models/funnel.js',
	'admin/components/category_form',
	'./categories.less',
	function(can, Component, categoriesView, FunnelModel){

		return can.Component({
			tag : 'categories',
			template : categoriesView,
			scope : {
				currentFunnel : null,
				doneEditing : true,
				init : function(){
					this.attr('funnels', new FunnelModel.List({}));
				},
				editFunnel : function(ctx){
					this.openFunnelForm(ctx);
				},
				newFunnel : function(){
					this.openFunnelForm(new FunnelModel);
				},
				openFunnelForm : function(funnel){
					this.attr({
						currentFunnel : funnel,
						doneEditing : false
					})
				},
				setDoneEditing : function(val){
					var self = this;
					if(val){
						setTimeout(function(){
							self.attr('currentFunnel') && self.attr('currentFunnel', null);
						}, 1)
					}

					return val
				}
			}
		})

	});