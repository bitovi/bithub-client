steal(
	'can',
	'./init.mustache',
	'bithub/models/event.js',
	'./typeahead',
	'bithub/postform',
	function(can, initView, EventModel, initTypeahead){
		/**
		 * @class bithub/newpost
		 * @alias Newpost
		 */

		return can.Control('Bithub.Newpost',
			{ },
			/** @Prototype */
			{
				init : function( el, options ){
					this.currentEvent = can.compute(this.options.currentEvent || new EventModel)

					el.html(initView({
						currentEvent : this.currentEvent
					}));

				},

				'#hide-newpost-form-btn click': function( el, ev ) {
					ev.preventDefault();
					this.options.visibility( !this.options.visibility() );
				},

				'{visibility} change': function( visibility, ev ) {
					var visibility = this.options.visibility(),
						currentEvent = this.currentEvent();

					if(visibility){
						if(!currentEvent){
							this.currentEvent(new EventModel);
						}
						this.element.slideDown();
					} else {
						this.element.slideUp();
					}
				},

				" event.saved" : function() {
					var self = this,
						eventObj = this.currentEvent(),
						attrs = can.route.attr();

					// if can.route remains the same trigger reload
					if( attrs.category === eventObj.category && attrs.project === eventObj.project ) {
						can.trigger(Bithub.Models.Event, 'reload');
					} else {
						can.route.attr({
							page: 'homepage',
							view: 'latest',
							category: eventObj.category,
							project: eventObj.project
						}, true);
					}

					this.options.visibility(false);

					setTimeout(function(){
						self.currentEvent(null);
					}, 500)
				},

				'{can.route} newpost_c': function( route, ev, newVal, oldVal ) {
					//currentCategory( newVal );
				},

				'{can.route} newpost_p': function( route, ev, newVal, oldVal ) {
					//currentProject( newVal );
				}

			});
	});
