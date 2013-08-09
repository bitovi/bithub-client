steal(
	'can',
	'./info.mustache',
	'../_navbar.mustache',
	'ui/bootstrap_dropdown',
	'bithub/models/country.js',
	'can/model/list',
	'jquerypp/dom/form_params',
	function(can, profileInfoView, NavbarPartial, Dropdown, Country){

		return can.Control.extend({
			pluginName: 'profile-info',
			defaults : { }
		}, {
			init: function(element, opts) {
				var self = this,
					countries = this.loadCountries();

				element.html(profileInfoView({
					countries: countries,
					user: opts.currentUser,
					routes: opts.subpageRoutes
				}, {
					helpers: {
						hasProvider: function( provider, opts ) {
							var flag = false
							if (self.options.currentUser.attr('isLoggedIn') === true) {
								self.options.currentUser.attr('identities').each( function (value) {
									if (value.provider === provider) flag = true;
								});
							}
							return flag ? opts.fn(this) : opts.inverse(this);
						}
					},
					partials: {
						navbarPartial: NavbarPartial
					}
				}));
			},

			loadCountries: function() {
				var self = this,
				countries = new can.Observe.List();

				Country.findAll({order: 'name'}, function( data ) {
					countries.replace( data );
					self.element.find('#countryISO').val( self.options.currentUser.attr('country.iso') );
				});

				return countries;	
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
	}
);
