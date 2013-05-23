steal('can','./init.mustache', function(can, initView){

    return can.Control(
		{
			defaults : {}
		}, {
			init : function( elem, opts ){
				this.event = new Bithub.Models.Event();
				elem.html( initView({
					event: this.event
				}));
			},
			'{can.route} eventId': function( data, ev, eventId ) {
				var self = this;
				Bithub.Models.Event.findOne({ id: eventId }, function(event) {
					self.event.attr( event.attr() );
				});
			}
			
		});
});
