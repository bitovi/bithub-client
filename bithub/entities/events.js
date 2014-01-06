steal(function(){
	return {
		"{scope.event} updated" : function(event){
			console.log('UPDATED')
			var project = can.route.attr('project');
			this.scope.attr('inited', false);
			if(project === 'all' || project === event.attr('project')){
				this.scope.attr('inited', true);
			}
		}
	}
})