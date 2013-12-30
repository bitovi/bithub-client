steal(
'can/component',
'./chat.mustache',
'bithub/entities/entity_state.js',
'bithub/entities/shared_helpers.js',
function(Component, chatView, EntityState, sharedHelpers){

	Component.extend({
		tag : 'bh-chat',
		template : chatView,
		scope : {
			expandedMessages : false,
			showMessages : function(){
				return this.attr('expandedMessages') || can.route.attr('category') === 'chat';
			},
			reversedMessages : function(){
				return this.attr('messages').reverse();
			},
			toggleMessages : function(){
				this.attr('expandedMessages', !this.attr('expandedMessages'));
			},
			canBeCollapsed : function(){
				return can.route.attr('category') === 'all';
			}
		},
		helpers : can.extend({
			chatUrl : function(){
				return can.route.url({category : 'chat'});
			},
			showDateHeader : function(opts){

				var date = opts.context.attr('origin_date'),
					momentedDate = moment(date).format('L'),
					should = false;

				if(momentedDate !== this.__currentDate){
					should = true;
					this.__currentDate = momentedDate;
				}

				if(should){
					delete this.__actor;
				}

				return should ? opts.fn({
					date : date
				}) : "";
			},
			separator : function(opts){
				var actor = opts.context.attr('actor');

				if(typeof this.__actor === 'undefined'){
					this.__actor = actor;
					return;
				}

				if(actor !== this.__actor){
					this.__actor = actor;
					return '<hr>';
				}
			}
		}, sharedHelpers)
	})

})