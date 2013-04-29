steal(
	'can',
	'./init.mustache',
	'bithub/models/country.js',
	'can/model/list',	
	function(can, initView, Country){
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
					
					this.element.html(initView({
						countries: self.countries,
						user: opts.currentUser
					}));
				}

			});
	});
