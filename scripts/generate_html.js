const fs = require('fs');
const path = require('path');
const _ = require('underscore')._;
const seedrandom = require('seedrandom');
seedrandom('polandspring', { global: true });

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

function randomText() {
  let len = 10;
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 `;,./][=-+了；刷到九分是欧威";

  for (let i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function generateHTML(effect, pattern, speed) {
  let text = randomText();
  let templatePath = fs.readFileSync(path.resolve(__dirname, '../resource/template.html'), 'utf8');
  let data = {
    title: effect,
    effect: effect,
    text: text,
    pattern: pattern,
    speed: speed
  };
  const page = _.template(templatePath)(data);
  const pagebuffer = Buffer.from(page, 'utf-8');
  console.log('generating html: ', effect, pattern, speed);
  fs.writeFileSync(path.resolve(__dirname, `../data/html/${effect}_${pattern}_${speed}.html`), pagebuffer);
}

function main() {
  const htmlPath = path.resolve(__dirname, '../data/html')
  if (!fs.existsSync(htmlPath)) {
    fs.mkdirSync(htmlPath);
  }
  fs.copyFileSync(path.resolve(__dirname, '../resource/animate.css'), path.resolve(__dirname, '../data/html/animate.css'));
  fs.copyFileSync(path.resolve(__dirname, '../resource/pixels.png'), path.resolve(__dirname, '../data/html/pixels.png'));
  for (let i = 0; i < effects.length; i++) {
    for (let j = 0; j < patterns.length; j++) {
      for (let k = 0; k < speeds.length; k++) {
        generateHTML(effects[i], patterns[j], speeds[k]);
      }
    }
  }
}

main();