const fs = require('fs')

function generate_errors() {
  let errors = []


  const file = fs.readFileSync(__dirname + '/../error.json');
  const result = JSON.parse(file);
  result['results'].map((pred) => {
    if (pred['prediction'] != pred['truth']) {
      errors.push(pred['video_id'].split('_').join(',') + ',' + pred['prediction'])
    }
  })
  errors.sort().map((id) => {
    console.log(id)
  })
}

generate_errors()