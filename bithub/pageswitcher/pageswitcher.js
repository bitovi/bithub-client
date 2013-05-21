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
				elem.html( initView({}) );
				//this.initControl( 'homepage' );
			},

			'{can.route} {routeAttr}': function( route, ev, newVal, oldVal ) {
				var self = this;

				this.options.buffers[oldVal] = this.element.find(" > div").detach();
				
				if( this.options.buffers[newVal] ) {
					this.element.html( this.options.buffers[newVal] );
				} else {
					this.initControl( newVal );
				}
			},

			initControl: function( controlName ) {
				var control = this.options.controls[controlName],
					$div = $('<div/>');

				new control( $div, this.options );
				this.element.html( $div );
			}
		});
	});
