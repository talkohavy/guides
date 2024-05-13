---
sidebar_label: '2.1. ffmpeg'
sidebar_position: 1
---

# FFMPEG

## 1. Compress Video (H.265)

```bash
ffmpeg -i aaa.mp4 -c:v libx265 -preset slow -crf 28 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" output.mkv
```

The default -crf value is 28, which is parallel to x263 23. Choose the highest value which still provides an acceptable quality for you.

### Possible Flags:

#### • Option 1: Video Encoding (flag -c:v)

Leave it as-is. This is what activates the H.265 encoding.

#### • Option 2: Preset (flag -preset)

Defaults to `medium`.  
Options are: `ultrafast` | `superfast` | `veryfast` | `faster` | `medium` | `slow` | `slower` | `veryslow`

Use the slowest preset you have patience for, with a crf that is acceptable, given that preset.

1. `ultrafast`: This preset provides the fastest encoding speed with the lowest compression efficiency. It's suitable for quick previews or when encoding speed is prioritized over output quality.

2. `superfast`: This preset offers faster encoding speed compared to `ultrafast` with slightly better compression efficiency. It's suitable for situations where speed is important but some compromise on quality is acceptable.

3. `veryfast`: This preset provides a good balance between encoding speed and output quality. It's suitable for general-purpose encoding where moderate compression efficiency is desired without sacrificing too much speed.

4. `faster`, `fast`, `medium`, `slow`, `slower`: These presets offer progressively slower encoding speeds with increasing compression efficiency and output quality. medium is often a good balance for general-purpose encoding.

5. `veryslow`: This preset offers the highest compression efficiency and best output quality but at the expense of significantly slower encoding speed. It's suitable for situations where output quality is paramount and encoding time is not a concern.

Different presets balance encoding _speed_ and _output quality_, with faster presets sacrificing quality for speed and slower presets providing better compression efficiency and higher quality output. Here are some common options for the -preset option:

#### • Option 3: Constant Rate Factor (flag -crf)

Use this mode if you want to retain good visual quality and don't care about the exact bitrate or filesize of the encoded file. The mode works exactly the same as in x264, except that maximum value is always 51, even with 10-bit support, so please read the H.264 guide for more info.

As with x264, you need to make several choices:

- Choose a CRF. CRF affects the quality. The default is 28, and it should visually correspond to libx264 video at CRF 23, but result in about half the file size. CRF works just like in x264, so choose the highest value that provides an acceptable quality.

- Choose a preset. The default is medium. The preset determines compression options and efficiency and therefore affects encoding speed and size. Valid presets are `ultrafast`, `superfast`, `veryfast`, `faster`, `fast`, `medium`, `slow`, `slower`, `veryslow`, and `placebo`. Use the slowest preset you have patience for, with a crf that is acceptable, given that preset. Ignore placebo as it provides insignificant returns for a significant increase in encoding time. Note that CRF values are different based on which preset you select, a "slower" preset generates more compression/bit, but may increase filesize. If you compare "ultrafast" with "veryslow" at the same CRF value, "veryslow" may generate a larger file, with overall better compression. So for instance if -preset ultrafast with -crf 15 generates a file with comparable size to "veryslow" -crf 20, the veryslow preset file will have better quality for the same file size. You can also specify a bitrate for a preset (see below), instead of crf, for controlling file size with a certain compression level.

* Choose a tune (optional). By default, this is disabled, and it is generally not required to set a tune option. x265 supports the following `-tune` options: `psnr`, `ssim`, `grain`, `zerolatency`, `fastdecode`. They are explained in the H.264 guide.

#### • Option 4: Tune (flag -tune)

You can optionally use -tune to change settings based upon the specifics of your input. Current tunings include:

film – use for high quality movie content; lowers deblocking
animation – good for cartoons; uses higher deblocking and more reference frames
grain – preserves the grain structure in old, grainy film material
stillimage – good for slideshow-like content
fastdecode – allows faster decoding by disabling certain filters
zerolatency – good for fast encoding and low-latency streaming

For example, if your input is animation then use the animation tuning, or if you want to preserve grain in a film then use the grain tuning. If you are unsure of what to use or your input does not match any of tunings then omit the -tune option. You can see a list of current tunings with -tune help, and what settings they apply with x264 --fullhelp.

#### • Option 5: Filters (flag -vf)

```bash
-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2
```

#### • Option 6: Strict (flag -strict)

-strict strict

#### • Option 7: Format (flag -f)

Options are: `matroska` | `mp4`

---

## 2. Trim Video

```bash

```
