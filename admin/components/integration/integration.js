steal('can/util/string', 'can/component', './integration.mustache', './integration.less', function(can, Component, integrationView){

	return can.Component({
		tag : 'integration',
		template : integrationView,
		scope : {
			currentTab : 'general',
			switchTab : function(ctx, el, ev){
				this.attr('currentTab', el.data('tab'))
			}
		},
		helpers : {
			ifTab : function(tab, opts){
				tab = can.isFunction(tab) ? tab() : tab;
				return this.attr('currentTab') === tab ? opts.fn(opts.context) : ""
			}
		}
	})

});