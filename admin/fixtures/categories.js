define(['can/util/string', 'can/util/fixture'], function(can){

  var store = can.fixture.store(100, function(i){
    var id = i + 1; // Make ids 1 based instead of 0 based
    return {
      id   : id,
      name : 'Category ' + id
    }
  });

  can.fixture({
    'GET /categories'         : store.findAll,
    'GET /categories/{id}'    : store.findOne,
    'POST /categories'        : store.create,
    'PUT /categories/{id}'    : store.update,
    'DELETE /categories/{id}' : store.destroy
  });

  return store;

})