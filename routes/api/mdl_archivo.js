var fileSystem = require('fs');

module.exports = {
  "write": function(data, handler){
    fileSystem.writeFile('database.json', JSON.stringify(data) , handler);
  },
  "read": function(handler){
    fileSystem.readFile('database.json', handler);
  }
}
