steal(
	'can',
	'./init.mustache',
	function(can, initView){
		return can.Control({
			defaults : {
				buffers: {}
			}
		}, {
			init: function( elem, opts ){
				this.element.html( initView({}) );
			},

			'{can.route} {routeAttr}': function( route, ev, newVal, oldVal ) {
				var self = this;

				this.options.buffers[oldVal] = this.element.find(" > div").detach();
				
				if( this.options.buffers[newVal] ) {
					this.element.html( this.options.buffers[newVal] );
				} else {
					var control = this.options.controls[newVal],
						$div = $('<div/>');
					
					new control( $div, self.options );
					this.element.html( $div );
				}

			}
		});
	});
