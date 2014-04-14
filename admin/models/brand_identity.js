steal('can/util/string', 'can/model', function(can){

  return can.Model({

    findAll : 'GET /api/v2/brand_identities',
    findOne : 'GET /api/v2/brand_identities/{id}'

  }, {

  });

})