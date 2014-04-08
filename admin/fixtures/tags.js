define(['can/util/string', 'can/util/fixture'], function(can){

  var store = can.fixture.store(100, function(i){
    var id = i + 1; // Make ids 1 based instead of 0 based
    return {
      id   : id,
      name : 'Tag ' + id
    }
  });

  can.fixture({
    'GET /tags'         : store.findAll,
    'GET /tags/{id}'    : store.findOne,
    'POST /tags'        : store.create,
    'PUT /tags/{id}'    : store.update,
    'DELETE /tags/{id}' : store.destroy
  });

  return store;

})