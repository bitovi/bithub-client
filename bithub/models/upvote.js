steal(
	'can',
	'can/model',
	'can/construct/proxy',
	'can/construct/super',
	function (can, Model) {
		return Model('Bithub.Models.Upvote', {
			
			update : 'POST /api/v2/entities/{eventId}/upvote',
			destroy : 'DELETE /api/v2/entities/{eventId}/upvote'

		}, {

			init : function(){
				var event = this.attr('event');
				event && this.attr('eventId', event.attr('id'));
			},
			upvote: function () {
				var self = this;
				this.sumUpvotes();
				return this.save().fail( function() { self.sumUpvotes(-1) } );
			},
			unvote: function () {
				var self = this;
				this.sumUpvotes(-1);
				
				return this.destroy().fail( function() { self.sumUpvotes(1) } );
			},
			sumUpvotes: function ( value ) {
				var upvotedEvents = window.CURRENT_USER.attr('upvoted_events'),
					eventId = this.event.attr('id'),
					index;

				value = value || 1;

				this.event.attr('upvotes', this.event.attr('upvotes') + value);
				if(value > 0){
					upvotedEvents.push(eventId);
				} else {
					index = upvotedEvents.indexOf(eventId);
					if(index > -1){
						upvotedEvents.splice(index, 1);
					}
				}
			},
			isNew : function(){
				return false;
			}
		});
	});
