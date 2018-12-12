#### 1. untar feats.tar and val_feats.tar to `data/features` and `data/val_features`

```bash
tar -xvcf feats.tar
tar -xvcf val_feats.tar
```

#### 2. build vocabulary

#### 3. train

```bash
python train.py
```

#### 4. validate

```bash
python sample.py --image [some feature map] --image_dir data/val_feats --decoder_path models/[some trained model].ckpt
```