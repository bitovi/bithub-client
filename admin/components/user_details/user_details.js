steal('can/util/string', 'can/component', './user_details.mustache', './user_details.less', function(can, Component, userDetailsView){

  return can.Component({
    tag : 'user-details',
    template : userDetailsView,
    scope : {
      
    }
  })

});