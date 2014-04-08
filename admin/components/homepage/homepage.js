steal('can/util/string', 'can/component', './homepage.mustache', './homepage.less', function(can, Component, homepageView){

  return can.Component({
    tag : 'homepage',
    template : homepageView,
    scope : {
      
    }
  })

});