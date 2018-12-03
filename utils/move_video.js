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

function move_video() {
  let videoDir = process.argv[2];
  let files = fs.readdirSync(videoDir);
  files.forEach(function (filename) {
    let category = filename.split('_')[0];
    if (effects.indexOf(category) > -1) {
      if (!fs.existsSync(`${videoDir}/${category}`)) {
        fs.mkdirSync(`${videoDir}/${category}`);
      }
      fs.renameSync(`${videoDir}/${filename}`, `${videoDir}/${category}/${filename}`);
    }
  });
}

move_video()