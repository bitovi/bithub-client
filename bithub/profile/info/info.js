steal(
	'can',
	'./info.mustache',
	'ui/bootstrap_dropdown',
	'bithub/models/country.js',
	'can/model/list',
	'jquerypp/dom/form_params',
	function(can, profileInfoView, Dropdown, Country){

		var countriesParams = {
			order: ['priority:desc', 'name'],
			limit: 500
		}
		
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
					routes: opts.routes
				}, {
					helpers: {
						hasProvider: function( provider, opts ) {
							return self.options.currentUser.getIdentity( provider ) ? opts.fn(this) : opts.inverse(this);
						}
					},
					partials: {}
				}));
			},

			loadCountries: function() {
				var self = this,
					blankCountry = {
						iso:'',
						name: '--',
						display_name: '--'
					};
				var	countries = new can.Observe.List([ blankCountry ]);

				Country.findAll( countriesParams, function (data) {
					countries.push.apply(countries, data);
					self.element.find('#countryISO').val( self.options.currentUser.attr('country.iso') );
				});

				return countries;	
			},

			' submit': function( el, ev ) {
				var $submitBtn = this.element.find('button');

				ev.preventDefault();
				
				$submitBtn.button('loading');

				this.options.currentUser
				.attr( el.formParams() )
				.save(
					function( user ) {
					$submitBtn.button('reset');
					el.find('.form-status .success').show().delay(1000).fadeOut();
				},
				function( xhr ) {
					$submitBtn.button('reset');
					el.find('.form-status .error').show().delay(1000).fadeOut();
				});
			},

			'#login-github-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login('github');
			},

			'#login-twitter-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login('twitter');
			}
		});
	}
);
