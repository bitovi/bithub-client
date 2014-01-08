steal('ui/more', function(){
	return {
		" inserted" : function(){
			this.element.find('.no-more').removeClass('no-more').more();
		},
		"{scope.event} updated" : function(event){
			var project = can.route.attr('project');
			this.scope.attr('inited', false);
			if(project === 'all' || project === event.attr('project')){
				this.scope.attr('inited', true);
			}
		}
	}
})