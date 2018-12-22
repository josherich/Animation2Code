# PyTorch implementation of popular two-stream frameworks for video action recognition

This repository is based on this implementation of the two-stream framework [github](https://github.com/bryanyzhu/two-stream-pytorch). The code was originally designed for UCF101, but modifications were made to have it run on the Animation2Code dataset.

## Installation

Dependencies
```
Python: 3.5
CUDA: 8.0
OpenCV3
dense_flow
```
In order to extract optical flow, use the [dense_flow](https://github.com/yjxiong/dense_flow/) library. To simplify the installation process run using OpenCV 2.4.13. After extraction, 

If you need to use OpenCV3, the installation process is significantly more tedious, but a branch supporting OpenCV3 can be [here](https://github.com/yjxiong/dense_flow/tree/opencv-3.1).

## Data Preparation

This repository already contains the annotations files that are required to run and the extracted optical flow dataset should also be 

Convert video to frames and extract optical flow
```
python build_of.py --src_dir ./UCF-101 --out_dir ./ucf101_frames --df_path <path to dense_flow>
```
Build the annotations files for the dataset
```
python build_file_list.py --frame_path ./ucf101_frames --out_list_path ./settings
```

## Training

For spatial stream (single RGB frame), run:
```
python main_single_gpu.py ../two_stream_dataset/frames -m rgb -a rgb_resnet18 --new_length=1
--epochs 250 --lr 0.001 --lr_steps 100 200 --workers 2 --batch-size 5
```
For temporal stream (10 consecutive optical flow images), run:
```
python main_single_gpu.py ../two_stream_dataset/frames -m flow -a flow_resnet18 --new_length=50 --epochs 350 --lr 0.001 --lr_steps 200 300 --workers 2 --batch-size 5
```

Substitute ../two_stream_dataset/frames with where you keep the Animation2Code optical flow dataset

## Testing

Go into "scripts/eval_ucf101_pytorch" folder, run `python spatial_demo.py` to obtain spatial stream result, and run `python temporal_demo.py` to obtain temporal stream result.


## Related Projects

[TSN](https://github.com/yjxiong/temporal-segment-networks): Temporal Segment Networks: Towards Good Practices for Deep Action Recognition

[Hidden Two-Stream](https://github.com/bryanyzhu/Hidden-Two-Stream): Hidden Two-Stream Convolutional Networks for Action Recognition
