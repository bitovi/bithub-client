steal('ui/more', function(){
	return {
		" inserted" : 'applyMore',
		"{scope} inited" : 'applyMore',
		"{scope.event} updated" : function(event){
			var project = can.route.attr('project');
			this.scope.attr('inited', false);
			if(project === 'all' || project === event.attr('project')){
				this.scope.attr('inited', true);
			}
		},
		applyMore : function(){
			var self = this;
			setTimeout(function(){
				var $el, width;

				if(!self.element){ 
					return;
				}

				$el   = self.element.find('.no-more');
				width = $el.width();

				if(width){
					$el.removeClass('no-more').more();
				}
				
			}, 1);
		}
	}
})