var exceltojson = require("xlsx-to-json-lc");

  exceltojson({
    input:"sample.xlsx",
    output: null
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result.length);
      //result will contain the overted json data
    }
  });