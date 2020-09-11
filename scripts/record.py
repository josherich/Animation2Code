from selenium import webdriver
import sys, getopt, time, subprocess, shlex
from xvfbwrapper import Xvfb
import argparse

effects = ['bounce','flash', 'pulse', 'rubberBand',
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
  'heartBeat']

patterns = [
  'text',
  'square',
  'line',
  'image'
]

speeds = [
  'slow',
  'slower',
  'fast',
  'faster'
]

def record(xvfb, browser, effect, pattern, speed, html_path, video_path):
    url = 'file://%s/%s_%s_%s.html' % (html_path, effect, pattern, speed)
    destination = '%s/%s/%s_%s_%s.flv' % (video_path, effect, effect, pattern, speed)
    browser.get(url)

    # normal quality, lagging in the first part on the video. filesize ~7MB
    # ffmpeg_stream = 'ffmpeg -f x11grab -s 1280x720 -r 24 -i :%d+nomouse -c:v libx264 -preset superfast -pix_fmt yuv420p -s 1280x720 -threads 0 -f flv "%s"' % (xvfb.new_display, destination)

    # high quality, no lagging but huge. file size ~50MB
    # ffmpeg_stream = 'ffmpeg -y -r 30 -f x11grab -s 256x256 -i :%d+nomouse -c:v libx264 -pix_fmt yuv420p video/bounce_text.mp4'  % xvfb.new_display

    # crop
    ffmpeg_stream = 'ffmpeg -y -f x11grab -s 256x512 -r 24 -t 5 -i :%d+nomouse -filter:v "crop=256:256:0:128" -c:v libx264 -preset superfast -pix_fmt yuv420p -f flv "%s"' % (xvfb.new_display, destination)
    args = shlex.split(ffmpeg_stream)
    p = subprocess.Popen(args)

    time.sleep(6) # record for 6 secs

def run(opt):
    print('Sreencast webpage animation')
    xvfb = Xvfb(width=256, height=512, colordepth=24)
    xvfb.start()
    browser = webdriver.Chrome()

    for effect in effects:
        for pattern in patterns:
            for speed in speeds:
                record(xvfb, browser, effect, pattern, speed, opt.html_path, opt.video_path)

    browser.quit()
    xvfb.stop()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--video-path',
        default='./data/video',
        type=str,
        help='Root directory path of video generated')
    parser.add_argument(
        '--html-path',
        default='./data/html',
        type=str,
        help='Root directory path of html generated')
    args = parser.parse_args()
    run(args)

