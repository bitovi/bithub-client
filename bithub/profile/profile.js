steal(
	'can',
	'./init.mustache',
	'ui/dropdownselector',
	'bithub/models/country.js',
	'can/model/list',
	'jquerypp/dom/form_params',
	function(can, initView, DropdownSelector, Country){
		/**
		 * @class bithub/profile
		 * @alias Profile   
		 */
		return can.Control(
			/** @Static */
			{
				defaults : {}
			},
			/** @Prototype */
			{
				init : function( el, opts ) {
					var self = this;

					self.countries = new can.Model.List();					
					Country.findAll({}, function( data ) {
						self.countries.replace( data );
					});

					new DropdownSelector('', {
						state: function( newVal ) {
							console.log( newVal );
						},
						items: self.countries
					});
					
					this.element.html(initView({
						countries: self.countries,
						user: opts.currentUser
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
					
					
				}

			});
	});
