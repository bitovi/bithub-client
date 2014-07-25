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
				init : function(){
					var id = can.route.attr('id');
					if(id){
						id === 'new' ? this.newFunnel() : this.editFunnel(id);
					} else {
						this.loadFunnels();
					}
				},
				loadFunnels : function(){
					this.attr('funnels', new FunnelModel.List({}));
				},
				deleteFunnel : function(ctx){
					if(confirm('Are you sure?')){
						ctx.destroy();
					}
				},
				editFunnel : function(idOrFunnel){
					var self = this,
						funnel;
					if(typeof idOrFunnel === 'string' || typeof idOrFunnel === 'number'){
						idOrFunnel = parseInt(idOrFunnel, 10);
						funnel = can.grep(this.attr('funnels') || [], function(f){
							return f.attr('id') === idOrFunnel
						});
						if(funnel.length){
							this.openFunnelForm(funnel[0]);
						} else {
							console.log('aaaa')
							FunnelModel.findOne({id: idOrFunnel}).then(function(f){
								self.openFunnelForm(f);
							})
						}
					} else {
						this.openFunnelForm(idOrFunnel);
					}
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
							can.route.removeAttr('id');
							self.attr('currentFunnel') && self.attr('currentFunnel', null);
							if(!self.attr('funnels')){
								self.loadFunnels();
							}
						}, 1)
					}

					return val
				}
			},
			events : {
				"{can.route} id" : function(){
					var id = can.route.attr('id');
					if(id === 'new'){
						this.scope.newFunnel();
					} else if(id) {
						this.scope.editFunnel(id);
					} else {
						this.scope.setDoneEditing(true);
					}
				}
			},
			helpers : {
				funnelLink : function(linkTo, opts){
					var params = can.route.attr();

					linkTo = can.isFunction(linkTo) ? linkTo() : linkTo;

					if(typeof linkTo === 'string'){
						params.id = linkTo;
						return can.route.url(params);
					}

					params.id = linkTo.attr('id');
					return can.route.url(params);
				}
			}
		})

	});