const fs = require('fs');

let effects = ['bounce','flash', 'pulse', 'rubberBand',
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

let patterns = [
  'text',
  'square',
  'line',
  'image'
];

let speeds = [
  'slow',
  'slower',
  'fast',
  'faster'
];

function generate_annotations() {
  let data = {}
  let trainDir = 'train_video';
  let database = {};

  data['labels'] = effects;
  let files = fs.readdirSync(trainDir);
  let i = 1;
  let split = 'training';
  files.forEach(function (filename) {
    if (i % 59 == 0) {
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

generate_annotations()