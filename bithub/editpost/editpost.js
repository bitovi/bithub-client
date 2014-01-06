steal('can/control', './editpost.mustache', 'bithub/postform', function(Control, editPostView){
	return Control.extend({
		open : function(event){
			var div = $('.edit-post-modal');
			if(div.length === 0){
				div = $('<div></div>').addClass('edit-post-modal modal hide fade');
				new this(div);
				$('#container').append(div);
			}
			div.trigger('openModal', [event]);
		}
	}, {
		init : function(){
			this.currentEvent = can.compute(null);

			this.element.html(editPostView({
				currentEvent: this.currentEvent
			})).modal()
		},
		" openModal" : function(el, ev, event){
			this.currentEvent(null);
			this.currentEvent(event);
			this.element.modal('show')
		},
		" event.saved" : function(el, ev, event){
			this.element.modal('hide');
		}
	})
})