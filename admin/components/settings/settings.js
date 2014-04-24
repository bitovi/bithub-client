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
			manageKeywords : function(ctx, el, ev){
				var val = el.val(),
					keywords = (this.brand().attr('keywords') || [])
				if(ev.which === 8 && val === ''){
					keywords.pop();
				} else if(ev.which === 32 || ev.which === 188){
					this.addKeyword(ctx, el, ev);
				}
			},
			saveBrand : function(){
				
			},
			saveBrand : function(){
				var brand = this.brand();
				this.attr('isSavingBrand', true);
				brand.save().then(this.proxy('savedBrand'));
				
			},
			savedBrand : function(){
				var self = this;
				this.attr('isSavingBrand', false);
				this.attr('hasSavedBrand', true);
				clearTimeout(this.__hideHasSavedBrand);
				this.__hasSavedBrand = setTimeout(this.proxy('hideHasSavedBrand'), 5000);
			},
			hideHasSavedBrand : function(){
				clearTimeout(this.__hideHasSavedBrand);
				this.attr('hasSavedBrand', false);
			}
		},
		events : {
			"form submit" : function(el, ev){
				ev.preventDefault();
			},
			".keyword-list click" : function(el, ev){
				if($(ev.target).is('.keyword-list')){
					el.find('input').focus();
				}
			}
		}
	})

});