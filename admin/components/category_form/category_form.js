steal(
'can/util/string',
'can/component',
'./category_form.mustache',
'admin/models/feed.js',
'admin/models/tag.js',
'./category_form.less',
'admin/components/multiselect',
function(can, Component, categoryFormView, FeedModel, TagModel){

	return can.Component({
		tag : 'category-form',
		template : categoryFormView,
		scope : {
			isSaving : false,
			init : function(){
				this.attr('feeds', new FeedModel.List({}));
				this.attr('tags', new TagModel.List({}));
			},
			addConstraint : function(){
				this.attr('category').addConstraint();
			},
			removeConstraint : function(constraint){
				this.attr('category').removeConstraint(constraint);
			},
			saveCategory : function(){
				var self = true;
				this.attr('isSaving', true);
				this.attr('category').save(function(){
					self.cancelEdit();
					self.attr('isSaving', false);
				});
			},
			cancelEdit : function(){
				this.attr('category', null);
			}
		},
		helpers : {
			availableTypes : function(opts){
				var context = opts.context,
					feedName = context.attr('feed_name'),
					feed;

				if(feedName !== ""){
					feed = can.grep(this.attr('feeds'), function(f){
						return f.attr('name') === feedName;
					})[0];

					if(feed){
						return can.map(feed.attr('types'), function(type){
							return opts.fn(opts.contexts.add(type));
						}).join('');
					}
				}

				return "";
			}
		},
		events : {
			"{scope.category.constraints} change" : function(constraints, ev, attr, how, newVal, oldVal){
				if(how === "set" && attr.split('.').pop() === "feed_name"){
					this.scope.attr('category.constraints.' + (attr.replace(/feed/, 'type')), "");
				}
				
			}
		}
	})

});