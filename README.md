# CSS2Code

## Install for Mac

```
brew install ffmpeg
npm install
```

## Generate Dataset

1. generate HTML

```
node utils/generate_html.js
```

2. generate video

```
python utils/record.py --html_path /home/josh/{your_project}/{your_html_path} --video_path data/
```

3. generate annotation file

```
node utils/generate_annotations.js
```

## Training Setup

1. download training video [here]()

2. download annotation file [here]()

3. generate images from video

4. generate n_frames file

## Training

python main.py --root_path ./data --video_path images/ --annotation_path annotations.json --result_path results --dataset ucf101 --model resnet --model_depth 18 --n_classes 77 --batch_size 4 --n_threads 4 --checkpoint 5 --sample_size 240 --sample_duration 70

nohup python main.py --root_path ./data --video_path images/ --annotation_path annotations.json --result_path results_10_noscale --dataset ucf101 --model resnet --model_depth 10 --n_classes 77 --batch_size 4 --n_threads 4 --checkpoint 10 --sample_size 240 --sample_duration 70 --n_val_samples 10 --no_hflip --n_scales 1 > /dev/null &

## revision

remove scale

remove horizontal flipping

extend window size