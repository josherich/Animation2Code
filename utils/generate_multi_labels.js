const fs = require('fs');
const css = require('css');

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

const content = fs.readFileSync(__dirname + '/../resource/animate.css', 'utf8');
let ast = css.parse(content);

const clean_value = (val) => {
  val = val.replace(/\d*.?\d+?s/, 'sec') // replace second 1.4s
  return val.replace(/\(.+?\)/g, '') // replace value in parenthesis
}

const properties = {}
const values = {}

const list_all_property_values = () => {
  ast['stylesheet']['rules'].filter((rule) => {
    rule['declarations'] && rule['declarations'].map((dec) => {
      if (!properties[dec['property']]) {
        // console.log(dec['property']);
        properties[dec['property']] = true
      }
      if (!values[clean_value(dec['value'])]) {
        console.log(dec['value'], ":", clean_value(dec['value']));
        values[clean_value(dec['value'])] = true
      }
    })
    rule['keyframes'] && rule['keyframes'].map((kf) => {
      kf['declarations'].map((dec) => {
        if (!properties[dec['property']]) {
          // console.log(dec['property']);
          properties[dec['property']] = true
        }
        if (!values[clean_value(dec['value'])]) {
          console.log(dec['value'], ":", clean_value(dec['value']));
          values[clean_value(dec['value'])] = true
        }
      })
    })
  })
}

const rename_pv = (declaration) => {
  const pmapping = {
    "transform": "tf",
    "opacity": "op",
    "animation-name": "an",
    "transform-origin": "to",
    "animation-timing-function": "atf",
    "animation-duration": "ad",
    "backface-visibility": "bv",
    "visibility": "v",
    "animation-fill-mode": "afm",
    "animation-iteration-count": "aic",
    "animation-delay": "al",
  }
  const vmapping = {
    "1": "1",
    "0": "0",
    "sec": "s",
    "top": "top",
    "left": "left",
    "right": "right",
    "bottom": "bottom",
    "center": "center",
    "cubic-bezier": "cb",
    "translate3d": "t3",
    "scale3d": "s3",
    "translateX": "tx",
    "translateY": "ty",
    "translateZ": "tz",
    "rotateX": "rx",
    "rotateY": "ry",
    "rotateZ": "rz",
    "ease-in": "ei",
    "ease-out": "eo",
    "ease-in-out": "eio",
    "rotate3d": "r3",
    "skewX": "kx",
    "skewY": "ky",
    "perspective": "per",
    "visible": "vi",
    "!important": "!",
    "scale": "sc",
    "rotate": "rt",
    "hidden": "h",
  }
  const map_value = (val) => {
    console.log(vmapping[val], val)
    return vmapping[val] ? vmapping[val] : val
  }
  declaration['property'] = pmapping[declaration['property']]
  declaration['value'] = clean_value(declaration['value'])
  declaration['value'] = declaration['value'].split(' ').map(map_value).join(' ')
  return declaration
}

const generate_full_string = () => {
  const dict = {}
  const values = {} // list all values
  effects.map((eff, effIndex) => {
    // keyframe points
    let keyframes = ast['stylesheet']['rules'].filter((rule) => {
      return rule['type'] === 'keyframes' && rule['vendor'] == undefined && rule['name'] === eff
    })

    keyframes[0]['keyframes'] = keyframes[0]['keyframes'].map((keyframe) => {
      // remove vendor name
      keyframe['declarations'] = keyframe['declarations'].filter((dec) => {
        return dec['property'].indexOf('-webkit') == -1
      })
      // and rename
      keyframe['declarations'] = keyframe['declarations'].map((dec) => {
        // list all values
        if (!values[clean_value(dec['value'])]) {
          // console.log(clean_value(dec['value']));
          values[clean_value(dec['value'])] = true
        }
        return rename_pv(dec);
      })
      return keyframe
    })
    // remove keyframe name
    keyframes[0]['name'] = ""

    let rules = ast['stylesheet']['rules'].filter((rule) => {
      return rule['type'] === 'rule' && rule['selectors'][0] == `.${eff}`
    })
    // remove class name and animation-name
    rules[0]['selectors'] = ['sel']
    rules[0]['declarations'] = rules[0]['declarations'].filter((dec) => {
      return dec['property'].indexOf('animation-name') == -1 && dec['property'].indexOf('-webkit') == -1
    })
    // and rename
    rules[0]['declarations'] = rules[0]['declarations'].map((dec) => {
      // list all values
      if (!values[clean_value(dec['value'])]) {
        // console.log(clean_value(dec['value']));
        values[clean_value(dec['value'])] = true
      }
      return rename_pv(dec)
    })

    patterns.map((pat) => {
      speeds.map((spd) => {
        const _rule = {
          "type": "rule",
          "selectors": ["sel"],
          "declarations": [
            {
              "type": "declaration",
              "property": "ad",
              "value": spd
            },
            {
              "type": "declaration",
              "property": "pat",
              "value": pat
            }
          ]
        }

        dict[`${eff}_${pat}_${spd}${effIndex}`] = css.stringify({
          "type": "stylesheet",
          "stylesheet":
          {
            "rules": keyframes.concat(rules).concat([_rule])
          }
        })
      })
    })

    rules[0]['declarations'].push({
      "type": "declaration",
      "property": "ad",
      "value": "bounce",
    })


  })
  return dict;
}

const validation_sample_ratio = 59;

const write_src_tgt_for_onmt = (dict) => {
  let src_train = ""
  let tgt_train = ""
  let src_val = ""
  let tgt_val = ""
  let trainDir = 'data/video';

  let files = fs.readdirSync(trainDir);
  
  let i = 1;
  files.forEach(function (filename) {
    let key = filename.split('.')[0]
    let index = effects.indexOf(key.split('_')[0])
    if (i % validation_sample_ratio == 0) {
      src_val += `${key+index}\n`
      tgt_val += dict[key+index].replace(/\n/g, ' ').replace(/\s{1,}/g, ' ').replace(/;/g, ' ;').replace(/:/g, ' :').replace(/,/g, ' :') + '\n'
    } else {
      src_train += `${key+index}\n`
      tgt_train += `${dict[key+index]}`.replace(/\n/g, ' ').replace(/\s{1,}/g, ' ').replace(/;/g, ' ;').replace(/:/g, ' :').replace(/,/g, ' :')  + '\n'
    }
    i++
  })
  let max = 0
  tgt_train.split('\n').map((line) => {
    if (line.split(' ').length > max) {
      max = line.split(' ').length
    }
  })
  tgt_val.split('\n').map((line) => {
    if (line.split(' ').length > max) {
      max = line.split(' ').length
    }
  })
  console.log(max)

  const srcTrainDataBuffer = Buffer.from(src_train, 'utf-8');
  const tgtTrainDataBuffer = Buffer.from(tgt_train, 'utf-8');
  const srcValDataBuffer = Buffer.from(src_val, 'utf-8');
  const tgtValDataBuffer = Buffer.from(tgt_val, 'utf-8');

  fs.writeFileSync(`src-train.txt`, srcTrainDataBuffer);
  fs.writeFileSync(`tgt-train.txt`, tgtTrainDataBuffer);
  fs.writeFileSync(`src-val.txt`, srcValDataBuffer);
  fs.writeFileSync(`tgt-val.txt`, tgtValDataBuffer);

}

const dict = generate_full_string()
write_src_tgt_for_onmt(dict)

// let string = JSON.stringify(dict).replace(/\\n/g, '')
// const dataBuffer = Buffer.from(string, 'utf-8');
// fs.writeFileSync(`full_labels.json`, dataBuffer);