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
				funnels : [],
				init : function(){
					var id = can.route.attr('id');
					if(id){
						id === 'new' ? this.newFunnel() : this.editFunnel(id);
					} else {
						this.loadFunnels();
					}
				},
				loadFunnels : function(){
					var self = this;

					if(this.__loadFunnelsReq) return;

					this.__loadFunnelsReq = FunnelModel.findAll({}, function(data){

						can.batch.start();
						self.attr('funnels').splice(0);
						self.attr('funnels').replace(data);
						can.batch.stop();

						delete self.__loadFunnelsReq;
					});

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
						clearTimeout(this.__loadFunnels);
						this.__loadFunnels = setTimeout(function(){
							var funnels = self.attr('funnels');
							can.route.removeAttr('id');
							self.attr('currentFunnel') && self.attr('currentFunnel', null);
							self.loadFunnels();
						}, 1)
					}

					return val
				},
				moveUp : function(funnel){
					var funnels = this.attr('funnels'),
						index = funnels.indexOf(funnel);

					can.batch.start();
					funnels.splice(index, 1);
					funnels.splice(index - 1, 0, funnel);
					funnel.moveUpAndSave();
					can.batch.stop();
				},
				moveDown : function(funnel){
					var funnels = this.attr('funnels'),
						index = funnels.indexOf(funnel);

					can.batch.start();
					funnels.splice(index, 1);
					funnels.splice(index + 1, 0, funnel);
					funnel.moveDownAndSave();
					can.batch.stop();
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
				},
				isFirst : function(opts){
					var index = opts.scope.attr('@index');

					index = can.isFunction(index) ? index() : index;

					return index === 0 ? opts.fn() : "";
				},
				isLast : function(opts){
					var index = opts.scope.attr('@index');

					index = can.isFunction(index) ? index() : index;

					return index === this.attr('funnels').attr('length') - 1 ? opts.fn() : "";
				}
			}
		})

	});