# FFMPEG

## 1. Compress Video to H.265

Extract a thumbnail:

```bash
ffmpeg -i aaa.mp4 -vf "thumbnail" -frames:v 1 thumbnail.jpg
```

Compress the video:

```bash
ffmpeg -i aaa.mp4 -c:v libx265 -preset medium -crf 28 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -f mp4 aaa-muxed.mp4
```

Attach the thumbnail:

```bash
ffmpeg -i aaa.mp4 -i thumbnail.jpg -map 0 -map 1 -c copy -c:v:1 png -disposition:v:1 attached_pic aaa-muxed-final.mp4
```

The default -crf value is 28, which is parallel to x263 23. Choose the highest value which still provides an acceptable quality for you.

### Possible Flags:

#### • Option 1: Video Resolution (flag -s width-x-height)

By default, it maintains the resolution of the input video.

Options are:

- 3840 x 2160 (or 2160p)
- 2560 x 1440 (or 1440p)
- 1920 x 1080 (or 1080p)
- 1280 x 720 (or 720p)
- 854 x 480 (or 480p)
- 640 x 360 (or 360p)

| Resolution Type            | Common Name | Aspect Ratio | Pixel Size  |
| -------------------------- | ----------- | ------------ | ----------- |
| SD (Standard Definition)   | 480p        | 4:3          | 640 x 480   |
| HD (High Definition)       | 720p        | 16:9         | 1280 x 720  |
| Full HD (FHD)              | 1080p       | 16:9         | 1920 x 1080 |
| QHD (Quad HD)              | 1440p       | 16:9         | 2560 x 1440 |
| 2K video                   | 1080p       | 1:1.77       | 2048 x 1080 |
| 4K video or Ultra HD (UHD) | 4K or 2160p | 16:9         | 3840 x 2160 |
| 8K video or Full Ultra HD  | 8K or 4320p | 16:9         | 7680 x 4320 |

#### • Option 2: Video Encoding (flag -c:v)

Leave it as-is. This is what activates the H.265 encoding.

#### • Option 3: Preset (flag -preset)

Defaults to `medium`.  
Options are: `ultrafast` | `superfast` | `veryfast` | `faster` | `medium` | `slow` | `slower` | `veryslow`

Use the slowest preset you have patience for, with a crf that is acceptable, given that preset.

1. `ultrafast`: This preset provides the fastest encoding speed with the lowest compression efficiency. It's suitable for quick previews or when encoding speed is prioritized over output quality.

2. `superfast`: This preset offers faster encoding speed compared to `ultrafast` with slightly better compression efficiency. It's suitable for situations where speed is important but some compromise on quality is acceptable.

3. `veryfast`: This preset provides a good balance between encoding speed and output quality. It's suitable for general-purpose encoding where moderate compression efficiency is desired without sacrificing too much speed.

4. `faster`, `fast`, `medium`, `slow`, `slower`: These presets offer progressively slower encoding speeds with increasing compression efficiency and output quality. medium is often a good balance for general-purpose encoding.

5. `veryslow`: This preset offers the highest compression efficiency and best output quality but at the expense of significantly slower encoding speed. It's suitable for situations where output quality is paramount and encoding time is not a concern.

Different presets balance encoding _speed_ and _output quality_, with faster presets sacrificing quality for speed and slower presets providing better compression efficiency and higher quality output. Here are some common options for the -preset option:

#### • Option 4: Constant Rate Factor (flag -crf)

Use this mode if you want to retain good visual quality and don't care about the exact bitrate or filesize of the encoded file. The mode works exactly the same as in x264, except that maximum value is always 51, even with 10-bit support, so please read the H.264 guide for more info.

As with x264, you need to make several choices:

- Choose a CRF. CRF affects the quality. The default is 28, and it should visually correspond to libx264 video at CRF 23, but result in about half the file size. CRF works just like in x264, so choose the highest value that provides an acceptable quality.

- Choose a preset. The default is medium. The preset determines compression options and efficiency and therefore affects encoding speed and size. Valid presets are `ultrafast`, `superfast`, `veryfast`, `faster`, `fast`, `medium`, `slow`, `slower`, `veryslow`, and `placebo`. Use the slowest preset you have patience for, with a crf that is acceptable, given that preset. Ignore placebo as it provides insignificant returns for a significant increase in encoding time. Note that CRF values are different based on which preset you select, a "slower" preset generates more compression/bit, but may increase filesize. If you compare "ultrafast" with "veryslow" at the same CRF value, "veryslow" may generate a larger file, with overall better compression. So for instance if -preset ultrafast with -crf 15 generates a file with comparable size to "veryslow" -crf 20, the veryslow preset file will have better quality for the same file size. You can also specify a bitrate for a preset (see below), instead of crf, for controlling file size with a certain compression level.

* Choose a tune (optional). By default, this is disabled, and it is generally not required to set a tune option. x265 supports the following `-tune` options: `psnr`, `ssim`, `grain`, `zerolatency`, `fastdecode`. They are explained in the H.264 guide.

#### • Option 5: Tune (flag -tune)

You can optionally use -tune to change settings based upon the specifics of your input. Current tunings include:

film – use for high quality movie content; lowers deblocking
animation – good for cartoons; uses higher deblocking and more reference frames
grain – preserves the grain structure in old, grainy film material
stillimage – good for slideshow-like content
fastdecode – allows faster decoding by disabling certain filters
zerolatency – good for fast encoding and low-latency streaming

For example, if your input is animation then use the animation tuning, or if you want to preserve grain in a film then use the grain tuning. If you are unsure of what to use or your input does not match any of tunings then omit the -tune option. You can see a list of current tunings with -tune help, and what settings they apply with x264 --fullhelp.

#### • Option 6: Filters (flag -vf)

```bash
-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2
```

The filtergraph -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" is a concise way to resize a video using the `scale` filter in FFmpeg. Let's break down what each part of the filtergraph does:

- `-vf`: This flag indicates that a video filtergraph follows.

- `"scale=trunc(iw/2)*2:trunc(ih/2)*2"`: This is the filter expression that specifies how the video should be scaled. `scale` Specifies the scale filter, indicating that the video will be resized. `iw` & `ih` Represents the input width & height of the video respectively. `trunc(iw/2)*2` essentially divides the width of the video by 2, floors it, and then multiplies it by 2. This is necessary because the result of iw/2 might be a floating-point number. This step ensures that the width is divisible by 2, which is a requirement for many video codecs, thus ensuring compatibility with certain video codecs and maintaining the aspect ratio of the original video as closely as possible.

#### • Option 7: Strict (flag -strict)

-strict strict

#### • Option 8: Format (flag -f)

Options are: `matroska` | `mp4`

---

## 2. Compress Video to Webm

```bash
ffmpeg -i aaa.mp4 aaa-muxed.webm
```

Essentially it is the same as writing it explicitly like so:

```bash
ffmpeg -i aaa.mp4 -c:v vp9 -c:a libvorbis aaa-muxed.webm
```

---

## 3. Trim A Video

### - A. When you know the start point & end point

Use the '-to' flag

```bash
ffmpeg -i aaa.mkv -c:v copy -c:a copy -ss 00:20:39 -to 00:24:00 aaa-muxed.mp4
```

### - B. When you know the start point & the amount of seconds needed

```bash
ffmpeg -i aaa.mp4 -c:v copy -c:a copy -ss 00:13:00 -t 10 aaa-muxed.mp4
```

`t` is in seconds. 13 here means 13 minutes. To the left are the hours, and to the right are the seconds.

### - C. When the input has multiple audios in different languages

If you encounter a case of multi-language video file, then run:

```bash
ffmpeg -i aaa.mp4
```

And find out the number of the audio stream file you desire. Typically, 0:0 is the video, 0:1 is the English audio, and going from 0:2 upwards, are the other languages.

Now use `-map` on the input file:

```bash
ffmpeg -i aaa.mkv -map 0:0 -map 0:2 -c:v copy -c:a copy -ss 00:20:39 -t 59 aaa-muxed.mp4
```

### - D. With Accuracy

If you need frame accuracy, don't use -c copy, which means the same as -c:a copy -c:v copy -c:s copy. It copies the bitstream, and if the specified start or end time isn't falling on an I-Frame, you get the nearest one, which can be quite far away from the desired location. See also the Seeking wiki.

You can however re-encode the video to get accurate cutting. The audio can be copied, as basically, an audio stream has "only keyframes". For example, in order to encode the video to H.264 and copy the audio, apply the command:

```bash
ffmpeg -ss 191 -i aaa.mp4 -c:v libx264 -c:a copy -t 6 aaa-muxed.mp4
```

Note that this time '-ss' value was the frame number, however '-t' value still remain in seconds.

---

## 4. Extract just the Audio

Sometimes you don't really care about the video, you just want the audio. Luckily this is very straightforward in FFmpeg with the `-vn` flag:

```bash
ffmpeg -i input.mkv -vn audio_only.ogg
```

This command extracts only the audio from the input, encodes it as Vorbis, and saves it into audio_only.ogg. Now you have an isolated audio stream. You can also use the -an and -sn flags in the same manner to strip out audio and subtitle streams.
