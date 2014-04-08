steal('can/util/string', 'can/component', './organization.mustache', './organization.less', function(can, Component, organizationView){

  return can.Component({
    tag : 'organization',
    template : organizationView,
    scope : {
      organization : new can.Map({
        name : "Bitovi",
        keywords : ['canjs', 'can_js']
      })
    }
  })

});