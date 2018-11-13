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

// effects = ['pulse']

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

async function generateVideo(effect) {
    let client;
    try {
        // connect to endpoint
        client = await CDP();
        // extract domains
        const {Network, Page} = client;
        // setup handlers
        Network.requestWillBeSent((params) => {
            console.log('req will be sent: ', params.request.url);
        });
        // enable events then start!
        await Network.enable();
        await Page.enable();
        await Page.setDeviceMetricsOverride({width: 256, height: 256, deviceScaleFactor: 0, mobile: false});
        await Page.navigate({url: `file:///Users/chenjosh/projects/CSS2Code/html/${effect}.html`});
        console.log('render page: ', effect);
        await Page.loadEventFired();
        await Page.startScreencast({format: 'png', quality: 80, everyNthFrame: 1, maxWidth: 256, maxHeight: 256});

        let counter = 0;
        while(counter < 120){
          const {data, metadata, sessionId} = await Page.screencastFrame();
          await Page.screencastFrameAck({sessionId: sessionId});
          const imgbuffer = Buffer.from(data, 'base64');
          fs.writeFileSync(`images/${effect}_${counter}.png`, imgbuffer);
          counter++;
        }
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

function generateAVI(effect) {
  const cmd = `ffmpeg -y -framerate 60 -pattern_type glob -i 'images/${effect}_*.png' -c:v ffv1 video/${effect}.avi`
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

effects.map((eff) => {
  generateHTML(eff);
})

effects.map((eff) => {
  generateVideo(eff);
  generateAVI(eff);
})

// file:///Users/chenjosh/projects/CSS2Code/bounce.html
// ffmpeg -r 4 -i frame%5d.png -pix_fmt yuv420p -r 10 output.mp4
// ffmpeg -framerate 30 -pattern_type glob -i 'images/bounce_*.png' -c:v ffv1 video/bounce.avi
// https://github.com/muralikg/puppetcam