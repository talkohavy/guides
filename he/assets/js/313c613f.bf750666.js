"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[5041],{9618:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>d,contentTitle:()=>r,default:()=>h,frontMatter:()=>a,metadata:()=>s,toc:()=>l});const s=JSON.parse('{"id":"video-editing/ffmpeg","title":"FFMPEG","description":"1. Compress Video to H.265","source":"@site/docs/video-editing/ffmpeg.md","sourceDirName":"video-editing","slug":"/video-editing/ffmpeg","permalink":"/guides/he/docs/video-editing/ffmpeg","draft":false,"unlisted":false,"editUrl":"https://github.com/talkohavy/guides/docs/video-editing/ffmpeg.md","tags":[],"version":"current","frontMatter":{},"sidebar":"mySidebar","previous":{"title":"- What is Long-Polling","permalink":"/guides/he/docs/programming/what-is-long-polling"},"next":{"title":"- Subs Encoding","permalink":"/guides/he/docs/video-editing/subtitles-encoding"}}');var t=n(6070),o=n(7010);const a={},r="FFMPEG",d={},l=[{value:"1. Compress Video to H.265",id:"1-compress-video-to-h265",level:2},{value:"Possible Flags:",id:"possible-flags",level:3},{value:"\u2022 Option 1: Video Resolution (flag -s width-x-height)",id:"-option-1-video-resolution-flag--s-width-x-height",level:4},{value:"\u2022 Option 2: Video Encoding (flag -c)",id:"-option-2-video-encoding-flag--c",level:4},{value:"\u2022 Option 3: Preset (flag -preset)",id:"-option-3-preset-flag--preset",level:4},{value:"\u2022 Option 4: Constant Rate Factor (flag -crf)",id:"-option-4-constant-rate-factor-flag--crf",level:4},{value:"\u2022 Option 5: Tune (flag -tune)",id:"-option-5-tune-flag--tune",level:4},{value:"\u2022 Option 6: Filters (flag -vf)",id:"-option-6-filters-flag--vf",level:4},{value:"\u2022 Option 7: Strict (flag -strict)",id:"-option-7-strict-flag--strict",level:4},{value:"\u2022 Option 8: Format (flag -f)",id:"-option-8-format-flag--f",level:4},{value:"2. Compress Video to Webm",id:"2-compress-video-to-webm",level:2},{value:"3. Trim A Video",id:"3-trim-a-video",level:2},{value:"- A. When you know the start point &amp; end point",id:"--a-when-you-know-the-start-point--end-point",level:3},{value:"- B. When you know the start point &amp; the amount of seconds needed",id:"--b-when-you-know-the-start-point--the-amount-of-seconds-needed",level:3},{value:"- C. When the input has multiple audios in different languages",id:"--c-when-the-input-has-multiple-audios-in-different-languages",level:3},{value:"- D. With Accuracy",id:"--d-with-accuracy",level:3},{value:"4. Extract just the Audio",id:"4-extract-just-the-audio",level:2},{value:"5. Shrink Audio",id:"5-shrink-audio",level:2}];function c(e){const i={br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.header,{children:(0,t.jsx)(i.h1,{id:"ffmpeg",children:"FFMPEG"})}),"\n",(0,t.jsx)(i.h2,{id:"1-compress-video-to-h265",children:"1. Compress Video to H.265"}),"\n",(0,t.jsx)(i.p,{children:"Extract a thumbnail:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:'ffmpeg -i aaa.mp4 -vf "thumbnail" -frames:v 1 thumbnail.jpg\n'})}),"\n",(0,t.jsx)(i.p,{children:"Compress the video:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:'ffmpeg -i aaa.mp4 -c:v libx265 -preset medium -crf 28 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -f mp4 aaa-muxed.mp4\n'})}),"\n",(0,t.jsx)(i.p,{children:"Attach the thumbnail:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i aaa-muxed.mp4 -i thumbnail.jpg -map 0 -map 1 -c copy -c:v:1 png -disposition:v:1 attached_pic aaa-muxed-final.mp4\n"})}),"\n",(0,t.jsx)(i.p,{children:"The default -crf value is 28, which is parallel to x263 23. Choose the highest value which still provides an acceptable quality for you."}),"\n",(0,t.jsx)(i.h3,{id:"possible-flags",children:"Possible Flags:"}),"\n",(0,t.jsx)(i.h4,{id:"-option-1-video-resolution-flag--s-width-x-height",children:"\u2022 Option 1: Video Resolution (flag -s width-x-height)"}),"\n",(0,t.jsx)(i.p,{children:"By default, it maintains the resolution of the input video."}),"\n",(0,t.jsx)(i.p,{children:"Options are:"}),"\n",(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsx)(i.li,{children:"3840 x 2160 (or 2160p)"}),"\n",(0,t.jsx)(i.li,{children:"2560 x 1440 (or 1440p)"}),"\n",(0,t.jsx)(i.li,{children:"1920 x 1080 (or 1080p)"}),"\n",(0,t.jsx)(i.li,{children:"1280 x 720 (or 720p)"}),"\n",(0,t.jsx)(i.li,{children:"854 x 480 (or 480p)"}),"\n",(0,t.jsx)(i.li,{children:"640 x 360 (or 360p)"}),"\n"]}),"\n",(0,t.jsxs)(i.table,{children:[(0,t.jsx)(i.thead,{children:(0,t.jsxs)(i.tr,{children:[(0,t.jsx)(i.th,{children:"Resolution Type"}),(0,t.jsx)(i.th,{children:"Common Name"}),(0,t.jsx)(i.th,{children:"Aspect Ratio"}),(0,t.jsx)(i.th,{children:"Pixel Size"})]})}),(0,t.jsxs)(i.tbody,{children:[(0,t.jsxs)(i.tr,{children:[(0,t.jsx)(i.td,{children:"SD (Standard Definition)"}),(0,t.jsx)(i.td,{children:"480p"}),(0,t.jsx)(i.td,{children:"4:3"}),(0,t.jsx)(i.td,{children:"640 x 480"})]}),(0,t.jsxs)(i.tr,{children:[(0,t.jsx)(i.td,{children:"HD (High Definition)"}),(0,t.jsx)(i.td,{children:"720p"}),(0,t.jsx)(i.td,{children:"16:9"}),(0,t.jsx)(i.td,{children:"1280 x 720"})]}),(0,t.jsxs)(i.tr,{children:[(0,t.jsx)(i.td,{children:"Full HD (FHD)"}),(0,t.jsx)(i.td,{children:"1080p"}),(0,t.jsx)(i.td,{children:"16:9"}),(0,t.jsx)(i.td,{children:"1920 x 1080"})]}),(0,t.jsxs)(i.tr,{children:[(0,t.jsx)(i.td,{children:"QHD (Quad HD)"}),(0,t.jsx)(i.td,{children:"1440p"}),(0,t.jsx)(i.td,{children:"16:9"}),(0,t.jsx)(i.td,{children:"2560 x 1440"})]}),(0,t.jsxs)(i.tr,{children:[(0,t.jsx)(i.td,{children:"2K video"}),(0,t.jsx)(i.td,{children:"1080p"}),(0,t.jsx)(i.td,{children:"1:1.77"}),(0,t.jsx)(i.td,{children:"2048 x 1080"})]}),(0,t.jsxs)(i.tr,{children:[(0,t.jsx)(i.td,{children:"4K video or Ultra HD (UHD)"}),(0,t.jsx)(i.td,{children:"4K or 2160p"}),(0,t.jsx)(i.td,{children:"16:9"}),(0,t.jsx)(i.td,{children:"3840 x 2160"})]}),(0,t.jsxs)(i.tr,{children:[(0,t.jsx)(i.td,{children:"8K video or Full Ultra HD"}),(0,t.jsx)(i.td,{children:"8K or 4320p"}),(0,t.jsx)(i.td,{children:"16:9"}),(0,t.jsx)(i.td,{children:"7680 x 4320"})]})]})]}),"\n",(0,t.jsxs)(i.h4,{id:"-option-2-video-encoding-flag--c",children:["\u2022 Option 2: Video Encoding (flag -c",":v",")"]}),"\n",(0,t.jsx)(i.p,{children:"Leave it as-is. This is what activates the H.265 encoding."}),"\n",(0,t.jsx)(i.h4,{id:"-option-3-preset-flag--preset",children:"\u2022 Option 3: Preset (flag -preset)"}),"\n",(0,t.jsxs)(i.p,{children:["Defaults to ",(0,t.jsx)(i.code,{children:"medium"}),".",(0,t.jsx)(i.br,{}),"\n","Options are: ",(0,t.jsx)(i.code,{children:"ultrafast"})," | ",(0,t.jsx)(i.code,{children:"superfast"})," | ",(0,t.jsx)(i.code,{children:"veryfast"})," | ",(0,t.jsx)(i.code,{children:"faster"})," | ",(0,t.jsx)(i.code,{children:"medium"})," | ",(0,t.jsx)(i.code,{children:"slow"})," | ",(0,t.jsx)(i.code,{children:"slower"})," | ",(0,t.jsx)(i.code,{children:"veryslow"})]}),"\n",(0,t.jsx)(i.p,{children:"Use the slowest preset you have patience for, with a crf that is acceptable, given that preset."}),"\n",(0,t.jsxs)(i.ol,{children:["\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:"ultrafast"}),": This preset provides the fastest encoding speed with the lowest compression efficiency. It's suitable for quick previews or when encoding speed is prioritized over output quality."]}),"\n"]}),"\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:"superfast"}),": This preset offers faster encoding speed compared to ",(0,t.jsx)(i.code,{children:"ultrafast"})," with slightly better compression efficiency. It's suitable for situations where speed is important but some compromise on quality is acceptable."]}),"\n"]}),"\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:"veryfast"}),": This preset provides a good balance between encoding speed and output quality. It's suitable for general-purpose encoding where moderate compression efficiency is desired without sacrificing too much speed."]}),"\n"]}),"\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:"faster"}),", ",(0,t.jsx)(i.code,{children:"fast"}),", ",(0,t.jsx)(i.code,{children:"medium"}),", ",(0,t.jsx)(i.code,{children:"slow"}),", ",(0,t.jsx)(i.code,{children:"slower"}),": These presets offer progressively slower encoding speeds with increasing compression efficiency and output quality. medium is often a good balance for general-purpose encoding."]}),"\n"]}),"\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:"veryslow"}),": This preset offers the highest compression efficiency and best output quality but at the expense of significantly slower encoding speed. It's suitable for situations where output quality is paramount and encoding time is not a concern."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(i.p,{children:["Different presets balance encoding ",(0,t.jsx)(i.em,{children:"speed"})," and ",(0,t.jsx)(i.em,{children:"output quality"}),", with faster presets sacrificing quality for speed and slower presets providing better compression efficiency and higher quality output. Here are some common options for the -preset option:"]}),"\n",(0,t.jsx)(i.h4,{id:"-option-4-constant-rate-factor-flag--crf",children:"\u2022 Option 4: Constant Rate Factor (flag -crf)"}),"\n",(0,t.jsx)(i.p,{children:"Use this mode if you want to retain good visual quality and don't care about the exact bitrate or filesize of the encoded file. The mode works exactly the same as in x264, except that maximum value is always 51, even with 10-bit support, so please read the H.264 guide for more info."}),"\n",(0,t.jsx)(i.p,{children:"As with x264, you need to make several choices:"}),"\n",(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsx)(i.p,{children:"Choose a CRF. CRF affects the quality. The default is 28, and it should visually correspond to libx264 video at CRF 23, but result in about half the file size. CRF works just like in x264, so choose the highest value that provides an acceptable quality."}),"\n"]}),"\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsxs)(i.p,{children:["Choose a preset. The default is medium. The preset determines compression options and efficiency and therefore affects encoding speed and size. Valid presets are ",(0,t.jsx)(i.code,{children:"ultrafast"}),", ",(0,t.jsx)(i.code,{children:"superfast"}),", ",(0,t.jsx)(i.code,{children:"veryfast"}),", ",(0,t.jsx)(i.code,{children:"faster"}),", ",(0,t.jsx)(i.code,{children:"fast"}),", ",(0,t.jsx)(i.code,{children:"medium"}),", ",(0,t.jsx)(i.code,{children:"slow"}),", ",(0,t.jsx)(i.code,{children:"slower"}),", ",(0,t.jsx)(i.code,{children:"veryslow"}),", and ",(0,t.jsx)(i.code,{children:"placebo"}),'. Use the slowest preset you have patience for, with a crf that is acceptable, given that preset. Ignore placebo as it provides insignificant returns for a significant increase in encoding time. Note that CRF values are different based on which preset you select, a "slower" preset generates more compression/bit, but may increase filesize. If you compare "ultrafast" with "veryslow" at the same CRF value, "veryslow" may generate a larger file, with overall better compression. So for instance if -preset ultrafast with -crf 15 generates a file with comparable size to "veryslow" -crf 20, the veryslow preset file will have better quality for the same file size. You can also specify a bitrate for a preset (see below), instead of crf, for controlling file size with a certain compression level.']}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsxs)(i.li,{children:["Choose a tune (optional). By default, this is disabled, and it is generally not required to set a tune option. x265 supports the following ",(0,t.jsx)(i.code,{children:"-tune"})," options: ",(0,t.jsx)(i.code,{children:"psnr"}),", ",(0,t.jsx)(i.code,{children:"ssim"}),", ",(0,t.jsx)(i.code,{children:"grain"}),", ",(0,t.jsx)(i.code,{children:"zerolatency"}),", ",(0,t.jsx)(i.code,{children:"fastdecode"}),". They are explained in the H.264 guide."]}),"\n"]}),"\n",(0,t.jsx)(i.h4,{id:"-option-5-tune-flag--tune",children:"\u2022 Option 5: Tune (flag -tune)"}),"\n",(0,t.jsx)(i.p,{children:"You can optionally use -tune to change settings based upon the specifics of your input. Current tunings include:"}),"\n",(0,t.jsx)(i.p,{children:"film \u2013 use for high quality movie content; lowers deblocking\nanimation \u2013 good for cartoons; uses higher deblocking and more reference frames\ngrain \u2013 preserves the grain structure in old, grainy film material\nstillimage \u2013 good for slideshow-like content\nfastdecode \u2013 allows faster decoding by disabling certain filters\nzerolatency \u2013 good for fast encoding and low-latency streaming"}),"\n",(0,t.jsx)(i.p,{children:"For example, if your input is animation then use the animation tuning, or if you want to preserve grain in a film then use the grain tuning. If you are unsure of what to use or your input does not match any of tunings then omit the -tune option. You can see a list of current tunings with -tune help, and what settings they apply with x264 --fullhelp."}),"\n",(0,t.jsx)(i.h4,{id:"-option-6-filters-flag--vf",children:"\u2022 Option 6: Filters (flag -vf)"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:'-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2\n'})}),"\n",(0,t.jsxs)(i.p,{children:['The filtergraph -vf "scale=trunc(iw/2)*2',":trunc",'(ih/2)*2" is a concise way to resize a video using the ',(0,t.jsx)(i.code,{children:"scale"})," filter in FFmpeg. Let's break down what each part of the filtergraph does:"]}),"\n",(0,t.jsxs)(i.ul,{children:["\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:"-vf"}),": This flag indicates that a video filtergraph follows."]}),"\n"]}),"\n",(0,t.jsxs)(i.li,{children:["\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:'"scale=trunc(iw/2)*2:trunc(ih/2)*2"'}),": This is the filter expression that specifies how the video should be scaled. ",(0,t.jsx)(i.code,{children:"scale"})," Specifies the scale filter, indicating that the video will be resized. ",(0,t.jsx)(i.code,{children:"iw"})," & ",(0,t.jsx)(i.code,{children:"ih"})," Represents the input width & height of the video respectively. ",(0,t.jsx)(i.code,{children:"trunc(iw/2)*2"})," essentially divides the width of the video by 2, floors it, and then multiplies it by 2. This is necessary because the result of iw/2 might be a floating-point number. This step ensures that the width is divisible by 2, which is a requirement for many video codecs, thus ensuring compatibility with certain video codecs and maintaining the aspect ratio of the original video as closely as possible."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(i.h4,{id:"-option-7-strict-flag--strict",children:"\u2022 Option 7: Strict (flag -strict)"}),"\n",(0,t.jsx)(i.p,{children:"-strict strict"}),"\n",(0,t.jsx)(i.h4,{id:"-option-8-format-flag--f",children:"\u2022 Option 8: Format (flag -f)"}),"\n",(0,t.jsxs)(i.p,{children:["Options are: ",(0,t.jsx)(i.code,{children:"matroska"})," | ",(0,t.jsx)(i.code,{children:"mp4"})]}),"\n",(0,t.jsx)(i.hr,{}),"\n",(0,t.jsx)(i.h2,{id:"2-compress-video-to-webm",children:"2. Compress Video to Webm"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i aaa.mp4 aaa-muxed.webm\n"})}),"\n",(0,t.jsx)(i.p,{children:"Essentially it is the same as writing it explicitly like so:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i aaa.mp4 -c:v vp9 -c:a libvorbis aaa-muxed.webm\n"})}),"\n",(0,t.jsx)(i.hr,{}),"\n",(0,t.jsx)(i.h2,{id:"3-trim-a-video",children:"3. Trim A Video"}),"\n",(0,t.jsx)(i.h3,{id:"--a-when-you-know-the-start-point--end-point",children:"- A. When you know the start point & end point"}),"\n",(0,t.jsx)(i.p,{children:"Use the '-to' flag"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i aaa.mkv -c:v copy -c:a copy -ss 00:20:39 -to 00:24:00 aaa-muxed.mp4\n"})}),"\n",(0,t.jsx)(i.h3,{id:"--b-when-you-know-the-start-point--the-amount-of-seconds-needed",children:"- B. When you know the start point & the amount of seconds needed"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i aaa.mp4 -c:v copy -c:a copy -ss 00:13:00 -t 10 aaa-muxed.mp4\n"})}),"\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:"t"})," is in seconds. 13 here means 13 minutes. To the left are the hours, and to the right are the seconds."]}),"\n",(0,t.jsx)(i.h3,{id:"--c-when-the-input-has-multiple-audios-in-different-languages",children:"- C. When the input has multiple audios in different languages"}),"\n",(0,t.jsx)(i.p,{children:"If you encounter a case of multi-language video file, then run:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i aaa.mp4\n"})}),"\n",(0,t.jsx)(i.p,{children:"And find out the number of the audio stream file you desire. Typically, 0:0 is the video, 0:1 is the English audio, and going from 0:2 upwards, are the other languages."}),"\n",(0,t.jsxs)(i.p,{children:["Now use ",(0,t.jsx)(i.code,{children:"-map"})," on the input file:"]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i aaa.mkv -map 0:0 -map 0:2 -c:v copy -c:a copy -ss 00:20:39 -t 59 aaa-muxed.mp4\n"})}),"\n",(0,t.jsx)(i.h3,{id:"--d-with-accuracy",children:"- D. With Accuracy"}),"\n",(0,t.jsxs)(i.p,{children:["If you need frame accuracy, don't use -c copy, which means the same as -c",":a"," copy -c",":v"," copy -c",":s"," copy. It copies the bitstream, and if the specified start or end time isn't falling on an I-Frame, you get the nearest one, which can be quite far away from the desired location. See also the Seeking wiki."]}),"\n",(0,t.jsx)(i.p,{children:'You can however re-encode the video to get accurate cutting. The audio can be copied, as basically, an audio stream has "only keyframes". For example, in order to encode the video to H.264 and copy the audio, apply the command:'}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -ss 191 -i aaa.mp4 -c:v libx264 -c:a copy -t 6 aaa-muxed.mp4\n"})}),"\n",(0,t.jsx)(i.p,{children:"Note that this time '-ss' value was the frame number, however '-t' value still remain in seconds."}),"\n",(0,t.jsx)(i.hr,{}),"\n",(0,t.jsx)(i.h2,{id:"4-extract-just-the-audio",children:"4. Extract just the Audio"}),"\n",(0,t.jsxs)(i.p,{children:["Sometimes you don't really care about the video, you just want the audio. Luckily this is very straightforward in FFmpeg with the ",(0,t.jsx)(i.code,{children:"-vn"})," flag:"]}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i input.mkv -vn audio_only.ogg\n"})}),"\n",(0,t.jsx)(i.p,{children:"This command extracts only the audio from the input, encodes it as Vorbis, and saves it into audio_only.ogg. Now you have an isolated audio stream. You can also use the -an and -sn flags in the same manner to strip out audio and subtitle streams."}),"\n",(0,t.jsx)(i.h2,{id:"5-shrink-audio",children:"5. Shrink Audio"}),"\n",(0,t.jsx)(i.p,{children:"When you have an audio file which is too large you can run:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-bash",children:"ffmpeg -i input.mp3 -b:a 128k output.mp3\n"})}),"\n",(0,t.jsxs)(i.p,{children:["Set the audio bit rate to 128 kbps, which is a common compression setting.",(0,t.jsx)(i.br,{}),"\n","You can adjust the bit rate (128k) to a lower value to further reduce the size, but note that lowering the bit rate too much may degrade the audio quality."]})]})}function h(e={}){const{wrapper:i}={...(0,o.R)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},7010:(e,i,n)=>{n.d(i,{R:()=>a,x:()=>r});var s=n(758);const t={},o=s.createContext(t);function a(e){const i=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function r(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),s.createElement(o.Provider,{value:i},e.children)}}}]);