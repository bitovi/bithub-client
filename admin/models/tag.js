steal('can/util/string', 'can/model', function(can){

  return can.Model({

    findAll : 'GET /tags',
    findOne : 'GET /tags/{id}',
    create  : 'POST /tags',
    update  : 'PUT /tags/{id}',
    destroy : 'DELETE /tags/{id}'

  }, {

  });

})