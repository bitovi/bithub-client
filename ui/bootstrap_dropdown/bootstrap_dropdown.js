steal(
	'can',
	'./init.mustache',
	function( can, initView ){
		return can.Control({
			defaults : {}
		}, {
			init : function( elem, opts ){
				var self = this;
				 
				this.element.html(initView({
					htmlId: opts.htmlId,
					items: opts.items
				}, {
					'selectedValue': function() {
						var value ="";
						opts.items.each( function( item ) {
							if (item.key === opts.selected()) {
								value = item.value;
							}
						});
						return value;
					}
				}));
			},

			'a click': function( el, ev ) {
				ev.preventDefault();

				this.options.selected( (can.data(el, 'option')).key );
				//this.element.find('.select').html( (can.data(el, 'option')).value );
				//this.options.selected( (can.data(el, 'option')).key );
				//this.element.trigger('change', can.data(el, 'option'));

			},

			'button click': function( el, ev ) {
				ev.preventDefault();
			}
		});
	});
