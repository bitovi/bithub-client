steal(
	'can/util/string',
	'can/component',
	'./settings.mustache',
	'admin/components/tag_form',
	'./settings.less'
	, function(can, Component, settingsView){

	return can.Component({
		tag : 'settings',
		template : settingsView,
		scope : {
			brand : function(){
				return window.BRAND;
			},
			canAddKeywords : function(){
				var keywords = (this.brand().attr('keywords') || []);
				return (keywords.attr ? keywords.attr('length') : keywords.length) < 4;
			},
			addKeyword : function(ctx, el, ev){

				var brand = this.brand(),
					keywords = brand.attr('keywords'),
					val = el.val();

				if(!keywords){
					brand.attr('keywords', []);
					keywords = brand.attr('keywords');
				}

				if(val.length > 0){
					keywords.push(el.val());
					el.val("");
				}
				
			},
			removeKeyword : function(keyword, el, ev){
				var keywords = (this.brand().attr('keywords') || []),
					index = keywords.indexOf(keyword);

				keywords.splice(index, 1);
			},
			saveBrand : function(){
				var brand = this.brand();
				brand.save();
			}
		},
		events : {
			"form submit" : function(el, ev){
				ev.preventDefault();
			}
		}
	})

});