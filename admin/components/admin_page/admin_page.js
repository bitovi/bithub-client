steal('can/util/string', 'can/component', './admin_page.mustache', './admin_page.less', function(can, Component, adminPageView){

  return can.Component({
    tag : 'admin-page',
    template : adminPageView,
    scope : {
      title : '@'
    }
  })

});