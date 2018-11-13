const fs = require('fs');
var _ = require('underscore')._;
const CDP = require('chrome-remote-interface');
var exec = require('child_process').exec;

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

let client;
let Network, Page;

function generateHTML(effect) {
    var templatePath = fs.readFileSync(__dirname + '/template.html', 'utf8');
    var data = {
        title: effect,
        effect: effect
    };
    const page = _.template(templatePath)(data);
    const pagebuffer = Buffer.from(page, 'utf-8');
    fs.writeFileSync(`html/${effect}.html`, pagebuffer);
}

async function generateImages(effect) {
  try {
        await Page.enable();
        await Page.setDeviceMetricsOverride({width: 256, height: 256, deviceScaleFactor: 0, mobile: false});
        await Page.navigate({url: `file:///Users/chenjosh/projects/CSS2Code/html/${effect}.html`});
        await Page.loadEventFired();
        await Page.startScreencast({format: 'png', quality: 80, everyNthFrame: 1, maxWidth: 256, maxHeight: 256});
        
        console.log('generating images: ', effect);

        let counter = 0;
        while(counter < 120){
          const {data, metadata, sessionId} = await Page.screencastFrame();
          const imgbuffer = Buffer.from(data, 'base64');
          fs.writeFileSync(`images/${effect}_${counter}.png`, imgbuffer);
          counter++;
          await Page.screencastFrameAck({sessionId: sessionId});
        }
        Page.stopScreencast();
    } catch (err) {
        console.error('error in generating images: ', err);
    }
}

async function generateVideo(effect) {
  console.log('generating video: ', effect)
  const cmd = `ffmpeg -y -framerate 60 -pattern_type glob -i 'images/${effect}_*.png' -c:v ffv1 video/${effect}.avi`;
  dir = exec(cmd, function(err, stdout, stderr) {
    if (err) {
      console.log(err);
    }
    console.log(stdout);
  });

  dir.on('exit', function (code) {
    console.log('exit', code);
  });
}

async function run(eff) {
    await generateHTML(eff);
    await generateImages(eff);
    await generateVideo(eff);
}


async function main() {
  try {
    // connect to endpoint
    client = await CDP();
    // extract domains
    Network = client.Network;
    Page = client.Page;
    // setup handlers
    Network.requestWillBeSent((params) => {
      console.log('request will be sent: ', params.request.url);
    });
    // enable events then start!
    await Network.enable();
    
    for (let i = 0; i < effects.length; i++) {
      await run(effects[i]);
    }

  } catch (err) {
    console.error('error in generating images: ', err);
  } finally {
    if (client) {
        await client.close();
    }
  }
}

main();

// file:///Users/chenjosh/projects/CSS2Code/bounce.html
// ffmpeg -r 4 -i frame%5d.png -pix_fmt yuv420p -r 10 output.mp4
// ffmpeg -framerate 30 -pattern_type glob -i 'images/bounce_*.png' -c:v ffv1 video/bounce.avi
// https://github.com/muralikg/puppetcam