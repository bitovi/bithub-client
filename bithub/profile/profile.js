steal(
	'can',
	'./init.mustache',
	'ui/bootstrap_dropdown',
	'bithub/models/country.js',
	'can/model/list',
	'jquerypp/dom/form_params',
	function(can, initView, Dropdown, Country){
		return can.Control({
			defaults : {}
		}, {
			init : function( elem, opts ){
				var self = this,
					countryISO = can.compute();

				this.countries = new can.Model.List();
				
				Country.findAll({}, function( data ) {
					var buffer = new can.Model.List();
						data.each( function( item, index ) {
							buffer.push( new can.Observe({
								key: item.iso,
								value: item.display_name
							}));
						});
					self.countries.replace( buffer );
				});

				opts.currentUser.bind('country.iso', function( ev, attr ) {
					countryISO( attr.iso );
				});

				elem.html(initView({
					user: opts.currentUser,
					country: countryISO
				}, {
					'hasProvider': function( provider, opts ) {
						var flag = false;

						if ( self.options.currentUser.attr('loggedIn') ) {
							self.options.currentUser.attr('identities').each( function (value) {
								if (value.provider === provider) flag = true;
							});
						}
						return flag ? opts.fn(this) : opts.inverse(this);
					}
				}));

				new Dropdown(elem.find('#country-container'), {
					items: self.countries,
					selected: countryISO
				});
			},

			'form#edit-profile-form submit': function( el, ev ) {
				ev.preventDefault();

				el.find('.form-status .loading').show();
				
				this.options.currentUser
					.attr( el.formParams() )
					.save(
						function( user ) {
							el.find('.form-status .loading').hide();
							el.find('.form-status .success').show().delay(1000).fadeOut();
						},
						function( xhr ) {
							el.find('.form-status .loading').hide();
							el.find('.form-status .error').show().delay(1000).fadeOut();
						});
			},

			'#login-github-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login({url: '/api/auth/github' });
			},
			
			'#login-twitter-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login({url: '/api/auth/twitter' });
			}
			
		});
	});
