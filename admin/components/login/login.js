steal('can/util/string', 'can/component', './login.mustache', './login.less', function(can, Component, loginView){

  return can.Component({
    tag : 'login',
    template : loginView,
    scope : {
      
    }
  })

});