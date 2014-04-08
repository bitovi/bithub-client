steal('can/util/string', 'can/component', './tag_groups.less', function(can, Component, tagGroupsView){

  return can.Component({
    tag : 'tag-groups',
    template : tagGroupsView,
    scope : {
      hello: '@'
    }
  })

});