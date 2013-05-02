steal(
	'can',
	'./init.mustache',
	'ui/dropdownselector',
	'bithub/models/country.js',
	'can/model/list',
	'jquerypp/dom/form_params',
	function(can, initView, DropdownSelector, Country){
		return can.Control({
			defaults : {}
		}, {
			init : function( elem, opts ){
				var self = this;

				self.countries = new can.Model.List();					
				Country.findAll({}, function( data ) {
					self.countries.replace( data );
				});

				new DropdownSelector('', {
					state: function( newVal ) {
						//console.log( newVal );
					},
					items: self.countries
				});

				elem.html(initView({
					countries: self.countries,
					user: opts.currentUser
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
