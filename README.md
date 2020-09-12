# CSS2Code

[[paper]](https://github.com/josherich/Animation2Code/blob/master/generating-code-from-animation.pdf)

## Install

```
sudo apt-get install xvfb ffmpeg
npm install

# xvbf is only available on linux
pip install selenium xvfbwrapper

# download ChromeDriver and put it in PATH
https://sites.google.com/a/chromium.org/chromedriver/getting-started

# install chrome
https://computingforgeeks.com/install-google-chrome-browser-on-debian/
```

## Generate Dataset

1. generate HTML

```
node scripts/generate_html.js
```

2. generate video and images

```
python scripts/record.py --html-path /home/josh/{your_project}/{your_html_path} --video-path data/
python scripts/video_jpg.py path/to/video path/to/img
python scripts/n_frames.py path/to/img
```

3. generate annotation file

```
node scripts/generate_annotations.js
```

## Training

```bash
python main.py
  --root_path ./data
  --video_path images/
  --annotation_path annotations.json
  --result_path results
  --model resnet
  --model_depth 18
  --n_classes 77
  --batch_size 4
  --n_threads 4
  --checkpoint 5
  --sample_size 240
  --sample_duration 70
```

```bash
nohup python main.py
  --root_path ./data
  --video_path images/
  --annotation_path annotations.json
  --result_path results_10_noscale
  --model resnet
  --model_depth 10
  --n_classes 77
  --batch_size 4
  --n_threads 4
  --checkpoint 10
  --sample_size 240
  --sample_duration 70
  --n_val_samples 10
  --no_hflip
  --n_scales 1 > /dev/null &
```

# Evaluation

```bash
python main.py
  --root_path ./data
  --video_path images/
  --annotation_path annotations.json
  --result_path results
  --model resnet
  --model_depth 18
  --n_classes 77
  --batch_size 4
  --n_threads 4
  --checkpoint 5
  --sample_size 240
  --sample_duration 70
  --resume_path save_60.pth
```

# Saving features

```bash
python main.py
  --root_path ./data
  --video_path images/
  --annotation_path annotations.json
  --result_path results_features
  --model resnet
  --model_depth 10
  --n_classes 77
  --batch_size 4
  --n_threads 4
  --checkpoint 1
  --sample_size 240
  --sample_duration 70
  --resume_path save_60.pth
  --n_epochs=61
  --dataset ucf101
```