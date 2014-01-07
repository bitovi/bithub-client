steal(
	'can',
	'can/model',
	'can/construct/proxy',
	'can/construct/super',
	function (can, Model) {
		return Model('Bithub.Models.Upvote', {
			id: 'eventId',
			
			create : 'POST /api/events/{eventId}/upvote',
			destroy : 'DELETE /api/events/{eventId}/upvote'

		}, {

			upvote: function () {
				var self = this;
				this.sumUpvotes();
				return this.save().fail( function() { self.sumUpvotes(-1) } );
			},
			unvote: function () {
				var self = this;
				this.sumUpvotes(-1);

				this.attr('eventId', this.attr('event.id'));				
				
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
			serialize : function(){
				return {
					eventId : this.attr('event.id')
				}
			}
		});
	});
