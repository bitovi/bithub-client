steal('can/component', function(Component){
	
	Component.extend({
		tag : 'bh-tags',
		template : '<ul class="tag-list nav">{{{eventTags tags}}}</ul>',
		scope : {
			visibleTags : function(){
				return window.VISIBLE_TAGS || new can.List();
			}
		},
		helpers : {
			eventTags: function (tags, opts) {
				var buffer, linkTags, visibleTags;
				
				tags        = can.isFunction(tags) ? tags() : tags;
				buffer      = "";
				linkTags    = can.route.attr('page') === 'homepage';
				visibleTags = this.visibleTags();

				visibleTags.attr('length');
				
				can.each(tags, function( eventTag ) {
					var matched = false;

					can.each(visibleTags, function( visibleTag ) {
						var name = visibleTag.attr('name'),
							url = "",
							routeParams = can.extend({}, can.route.attr());

						if( name == eventTag && !matched ) {
							if( linkTags ) {
								routeParams[visibleTag.attr('type')] = name;
								url = can.route.url( routeParams, false );
								buffer += "<li class=\"tag-name " + name +  "\"><a href=\"" + url +  "\"><small>" + name + "</small></a></li>";
							} else {
								buffer += "<li class=\"tag-name " + name +  "\"><small>" + name + "</small></li>";
							}
							matched = true;
						}
					});
				});
				
				return buffer;
			}
		}
	})
})