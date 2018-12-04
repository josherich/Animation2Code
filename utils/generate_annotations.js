const fs = require('fs');

const effects = ['bounce','flash', 'pulse', 'rubberBand',
'shake', 'headShake', 'swing', 'tada',
'wobble','jello', 'bounceIn','bounceInDown',
'bounceInLeft','bounceInRight', 'bounceInUp','bounceOut',
'bounceOutDown', 'bounceOutLeft', 'bounceOutRight','bounceOutUp',
'fadeIn','fadeInDown','fadeInDownBig', 'fadeInLeft',
'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig','fadeInUp',
'fadeInUpBig', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig',
'fadeOutLeft', 'fadeOutLeftBig','fadeOutRight','fadeOutRightBig',
'fadeOutUp', 'fadeOutUpBig','flipInX', 'flipInY',
'flipOutX','flipOutY','lightSpeedIn','lightSpeedOut',
'rotateIn','rotateInDownLeft','rotateInDownRight', 'rotateInUpLeft',
'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight',
'rotateOutUpLeft', 'rotateOutUpRight','hinge', 'jackInTheBox',
'rollIn','rollOut', 'zoomIn','zoomInDown',
'zoomInLeft','zoomInRight', 'zoomInUp','zoomOut',
'zoomOutDown', 'zoomOutLeft', 'zoomOutRight','zoomOutUp',
'slideInDown', 'slideInLeft', 'slideInRight','slideInUp',
'slideOutDown','slideOutLeft','slideOutRight', 'slideOutUp',
'heartBeat'];

const patterns = [
  'text',
  'square',
  'line',
  'image'
];

const speeds = [
  'slow',
  'slower',
  'fast',
  'faster'
];

const validation_sample_ratio = 59;

function generate_annotations_classification() {
  let data = {}
  let trainDir = 'data/video';
  let database = {};

  data['labels'] = effects;
  let files = fs.readdirSync(trainDir);
  let i = 1;
  let split = 'training';
  files.forEach(function (filename) {
    if (i % validation_sample_ratio == 0) {
      split = 'validation'
    } else {
      split = 'training'
    }
    database[filename.split('.')[0]] = {
      'subset': split,
      'annotations': {
        'label': filename.split('.')[0].split('_')[0],
      }
    }
    i++;
  });
  data['database'] = database;
  const dataBuffer = Buffer.from(JSON.stringify(data), 'utf-8');
  fs.writeFileSync(`annotations.json`, dataBuffer);
}

function generate_annotaions_seq() {
  let data = {}
  let trainDir = 'data/video';
  let database = {};

  const code = fs.readFileSync(__dirname + '../full_labels.json');
  const codemap = JSON.parse(code);

  data['labels'] = effects;
  let files = fs.readdirSync(trainDir);
  let i = 1;
  let split = 'training';
  files.forEach(function (filename) {
    if (i % validation_sample_ratio == 0) {
      split = 'validation'
    } else {
      split = 'training'
    }
    database[filename.split('.')[0]] = {
      'subset': split,
      'annotations': {
        'label': code.map(filename.split('.')[0].split('_')[0]),
      }
    }
    i++;
  });
  data['database'] = database;
  const dataBuffer = Buffer.from(JSON.stringify(data), 'utf-8');
  fs.writeFileSync(`annotations_seq.json`, dataBuffer);
}

generate_annotations()