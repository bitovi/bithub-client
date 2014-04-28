steal('can/control', './leaderboard.mustache', function(Control, initView){
	return Control.extend({
		init : function(){
			this.element.html(initView({
				users : this.options.users
			}, {
				calcIndex : function(index){
					var val = parseInt((can.isFunction(index) ? index() : index), 10) + 1;
					if(val < 10){
						val = "00" + val;
					} else if(val < 100){
						val = "0" + val;
					}
					return val;
				}
			}))
		}
	})
})