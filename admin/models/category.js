steal('can/util/string', 'can/model', function(can){

  return can.Model({

    findAll : 'GET /categories',
    findOne : 'GET /categories/{id}',
    create  : 'POST /categories',
    update  : 'PUT /categories/{id}',
    destroy : 'DELETE /categories/{id}'

  }, {

  });

})