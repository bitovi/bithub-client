steal(
	'can',
	'./info.mustache',
	'ui/bootstrap_dropdown',
	'bithub/models/country.js',
	'can/list',
	'jquerypp/dom/form_params',
	function(can, profileInfoView, Dropdown, Country){

		var countriesParams = {
			order: ['priority:desc', 'name'],
			limit: 500
		}

		var sizes = ["Small", "Medium", "Large", "X-Large", "2X-Large"];
		
		var blankCountry = {
			iso:'',
			name: '--',
			display_name: '--'
		}


		return can.Control.extend({
			pluginName: 'profile-info',
			defaults : { 
				isEditing : false
			}
		}, {
			init: function() {
				var self = this;

				this.countries = new can.Observe.List([ blankCountry ]);

				this.element.html(profileInfoView({
					countries: this.countries,
					user: this.options.currentUser,
					isEditing : this.options.isEditing,
					unlinkIdentity : this.proxy('unlinkIdentity'),
					sizes: sizes
				}, {
					helpers: {
						hasProvider: function( provider, opts ) {
							var identity = self.options.currentUser.getIdentity( provider );
							return identity ? opts.fn(identity) : opts.inverse(this);
						}
					},
					partials: {}
				}));

				if(this.options.isEditing){
					this.element.find(':input').prop('disabled', true).addClass('disabled');
				}

				if(this.options.currentUser.isLoggedIn()){
					this.loadCountries();
				}
			},

			loadCountries: function() {
				var self = this;
				if(this.countries.attr('length') === 1){
					Country.findAll( countriesParams, function (data) {
						self.countries.push.apply(self.countries, data);
						self.element && self.element.find('#countryISO').val(
							self.options.currentUser.attr('country.iso')
						);
					});
				}
			},

			'{currentUser} authStatus' : function (fn, ev, newVal, oldVal) {
				if (newVal == 'loggedIn') this.loadCountries();
			},

			unlinkIdentity : function(identity, el, ev){
				var self = this;
				if(confirm("Are you sure you want to unlink this identity?")){
					identity.destroy(function(){
						self.options.currentUser.refreshSession();
					});
				}
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
			},

			'#login-meetup-link click': function( el, ev ) {
				ev.preventDefault();
				this.options.currentUser.login('meetup');
			},
			"{window} userLinkError" : function(el, ev, msg){
				alert(msg);
			}
		});
	}
);
