steal(
'can/component',
'./services.mustache',
'admin/login',
'admin/models/brand_identity.js',
'admin/models/feed_config.js',
'./services.less',
'can/construct/proxy',
function(Component, servicesView, login, BrandIdentity, FeedConfig){

	var activeServices = [];

	return can.Component({
		tag : 'services',
		template : servicesView,
		scope : {
			init : function(){
				this.attr({
					configs : [],
					identities : []
				});

				FeedConfig.findAll({}, this.proxy('updateIdentitiesAndConfigs'));
			},
			configsChanged : false,
			updateIdentitiesAndConfigs : function(configs){
				var identities = window.BRAND.attr('identities'),
					hasConfig = can.map(configs, function(config){
						return config.attr('feed_name')
					})

				can.map(identities, function(id){
					var provider = id.attr('provider');
					if(hasConfig.indexOf(provider) < 0){
						configs.push(new FeedConfig({
							feed_name : provider,
							brand_name : window.BRAND.attr('name')
						}))
					}
				})

				this.attr({
					configs : configs,
					identities : identities
				});
			},
			services : ['Twitter', 'GitHub', 'Facebook'/*, 'Disqus', 'Meetup', 'RSS', 'IRC'*/],
			accounts : ['bitovi', 'canjs', 'funcunit'],
			currentTab : 'twitter',
			switchTab : function(ctx, el, ev){
				this.attr('currentTab', el.data('tab').toLowerCase());
			},
			connectService : function(ctx){
				var provider = ctx.provider;
				login.connect({
					feed : provider
				})
			},
			toggleSelection : function(val, el){
				var currentTab = this.attr('currentTab'),
					what       = el.data('what'),
					config     = can.grep(this.attr('configs'), function(config){
						return config.attr('feed_name') === currentTab;
					})[0],
					configOpts, index;

				if(config){
					configOpts = config.attr('config');

					if(!configOpts){
						config.attr('config', {});
						configOpts = config.attr('config');
					}

					configOpts.attr(what, configOpts.attr(what) || []);
					index = configOpts.attr(what).indexOf(val);

					if(index < 0){
						configOpts.attr(what).push(val);
					} else {
						configOpts.attr(what).splice(index, 1);
					}
					
				}
			},
			saveConfigs : function(){
				can.map(this.attr('configs'), function(config){
					config.save();
				})
			}
		},
		helpers : {
			ifTab : function(tab, opts){
				var activeIdentities = this.attr('identities'),
					activeConfigs    = this.attr('configs'),
					length           = activeIdentities.attr('length'),
					scope;

				tab = (can.isFunction(tab) ? tab() : tab).toLowerCase();

				scope = {
					provider : tab
				};

				if(length > 0){
					scope.identity = can.grep(activeIdentities, function(id){
						return id.provider === tab;
					})[0];
					scope.config = can.grep(activeConfigs, function(config){
						return config.feed_name === tab;
					})[0];
				}

				return this.attr('currentTab') === tab ? opts.fn(opts.scope.add(scope)) : ""
			},
			isSelected : function(what, val, opts){
				var config = opts.scope.attr('config'),
					check;

				what = can.isFunction(what) ? what() : what;
				val  = can.isFunction(val) ? val() : val;

				check = (config.attr('config.' + what) || []).indexOf(val) > -1;

				return check ? opts.fn(opts.scope) : opts.inverse(opts.scope);
			},
			isActiveProvider : function(provider, opts){
				var activeIdentities = this.attr('identities'),
					length = activeIdentities.attr('length'),
					providers;

				if(length === 0){
					return opts.inverse(opts.context);
				}

				providers = can.map(activeIdentities, function(id){
					return id.attr('provider');
				});

				provider = can.isFunction(provider) ? provider() : provider;
				return providers.indexOf(provider.toLowerCase()) > -1 ? opts.fn(opts.context) : opts.inverse(opts.context);
			}
		},
		events : {
			"{scope.configs} change" : function(){
				this.scope.attr('configsChanged', true);
			}
		}
	})

});