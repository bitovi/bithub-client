steal('can/util/string', 'can/component', './services.mustache', 'admin/login', './services.less', function(can, Component, servicesView, login){

	var activeServices = []

	return can.Component({
		tag : 'services',
		template : servicesView,
		scope : {
			services : ['Twitter', 'GitHub', 'Disqus', 'Meetup', 'RSS', 'IRC'],
			accounts : ['bitovi', 'canjs', 'funcunit'],
			currentTab : 'twitter',
			switchTab : function(ctx, el, ev){
				this.attr('currentTab', el.data('tab').toLowerCase())
			},
			connectGithub : function(){
				login.connect({
					feed : 'github'
				})
			},
			connectTwitter : function(){
				login.connect({
					feed : 'twitter'
				})
			},
			connectMeetup : function(){
				login.connect({
					feed : 'meetup'
				})
			},
			connectDisqus : function(){
				login.connect({
					feed : 'disqus'
				})
			}
		},
		helpers : {
			ifTab : function(tab, opts){
				tab = can.isFunction(tab) ? tab() : tab;
				tab = tab.toLowerCase();
				return this.attr('currentTab') === tab ? opts.fn(opts.context) : ""
			},
			activeService : function(service){
				service = can.isFunction(service) ? service() : service;
				return activeServices.indexOf(service.toLowerCase()) > -1 ? 'active-service' : '';
			}
		}
	})

});