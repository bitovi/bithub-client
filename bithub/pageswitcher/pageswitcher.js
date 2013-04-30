steal(
	'can',
	'./init.ejs',
	function(can, initView){
		return can.Control({
			defaults : {}
		}, {
			init: function( elem, opts ){
				var self = this;

				this.pages = elem.children().map(function (i, el) {
					return {
						id: $(el).attr('id'),
						elem: $(el).detach()
					};
				});
			},

			'{can.route} page': function( route, ev, newVal, oldVal ) {
				var self = this;
				
				$.each( this.pages, function( i, page ) {
					// insert 'new' one
					if( 'page-' + newVal === page.id ) {
						self.element.append(page.elem);
					}

					// detach 'old' page
					if( 'page-' + oldVal === page.id ) {
						page.elem = $('#' + page.id).detach();
					}
				});
			}
		});
	});
