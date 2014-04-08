steal('can/util/string', 'can/component', './getting_started.mustache', './getting_started.less', function(can, Component, gettingStartedView){

  return can.Component({
	tag : 'getting-started',
	template : gettingStartedView,
	scope : {
	  
	},
	helpers : {
		stage : function(stage, opts){
			var currentStage = parseInt(can.route.attr('stage') || 0);
			stage = can.isFunction(stage) ? stage() : stage;
			stage = parseInt(stage);

			return stage >= currentStage ? opts.fn() : opts.inverse();
		}
	}
  })

});