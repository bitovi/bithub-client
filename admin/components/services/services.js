steal(
'can/component',
'./services.mustache',
'admin/login',
'admin/models/brand_identity.js',
'admin/models/feed_config.js',
'./services.less',
'can/construct/proxy',
'can/map/delegate',
'admin/components/multiselect',
'admin/components/item_list',
function(Component, servicesView, login, BrandIdentity, FeedConfig){

	var activeServices = [];

	return can.Component({
		tag : 'services',
		template : servicesView,
		scope : {
			isSavingConfigs: false,
			hasSavedConfigs: false,
			init : function(){
				this.attr({
					configs : [],
					identities : []
				});
				this.loadConfigs();
			},
			brand : function(){
				return BRAND;
			},
			configsChanged : false,
			loadingConfigs : false,
			loadConfigs : function(){
				this.attr('loadingConfigs', true);
				FeedConfig.findAll({}, this.proxy('updateIdentitiesAndConfigs'));
			},
			isReloading : function(){
				return this.attr('loadingConfigs') || BRAND.attr('_reloading');
			},
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
				});

				configs.push(can.grep(configs, function(c){
					return c.attr('feed_name') === 'rss'
				})[0] || new FeedConfig({
					feed_name : 'rss',
					brand_name : window.BRAND.attr('name')
				}))

				console.log(configs)

				this.attr({
					configs        : configs,
					identities     : identities,
					loadingConfigs : false
				});
			},
			services : ['Twitter', 'GitHub', 'Facebook', 'Disqus', 'StackExchange', 'Meetup', 'RSS'],
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
			saveConfigs : function(){
				this.attr('isSavingConfigs', true);
				$.when(can.map(this.attr('configs'), function(config){
					config.save();
				})).then(this.proxy('savedConfigs'))
			},
			savedConfigs : function(){
				var self = this;
				this.attr('isSavingConfigs', false);
				this.attr('hasSavedConfigs', true);
				clearTimeout(this.__hideHasSavedConfigs);
				this.__hasSavedConfigs = setTimeout(this.proxy('hideHasSavedConfigs'), 5000);
			},
			hideHasSavedConfigs : function(){
				clearTimeout(this.__hideHasSavedConfigs);
				this.attr('hasSavedConfigs', false);
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

				scope.identity = can.grep(activeIdentities, function(id){
					return id.provider === tab;
				})[0];
				scope.config = can.grep(activeConfigs, function(config){
					return config.feed_name === tab;
				})[0];

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
			},
			isConnecting : function(provider, opts){
				var currentlyConnecting = window.CONNECTING_FEED();

				provider = can.isFunction(provider) ? provider() : provider;

				return provider === currentlyConnecting ? opts.fn(opts.scope) : opts.inverse(opts.scope);
			}
		},
		events : {
			"{scope.configs} change" : function(){
				this.scope.attr('configsChanged', true);
			},
			"{BRAND} identities" : function(){
				this.scope.loadConfigs();
			},
			"form submit" : function(el, ev){
				ev.preventDefault();
			}
		}
	})

});