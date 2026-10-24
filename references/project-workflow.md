# 便携工程与验证

## 初始化

```sh
python3 <skill目录>/scripts/init_project.py --template demo --output <新目录>
# 或 --template coastal
cd <新目录>
npm install
node render.mjs --sheet=.7,2.8,5.4,7.5,10.5 --cols=3 --out=out/review.jpg --chrome=/path/to/chrome
node build.mjs --chrome=/path/to/chrome --ffmpeg=/path/to/ffmpeg
```

Node.js、Chrome/Chromium和FFmpeg需环境提供；npm只需puppeteer-core。p5 2.3.3、p5.brush 2.2.3及字体在初始化时复制到项目，浏览器加载绘画依赖不联网。初始化不安装软件、不覆盖目录。Chrome路径、运行时路径不写死进素材。

`demo`为11秒264帧；`coastal`为90.4秒、ceil(90.4×24)=2170帧，编码长度90.416667秒。coastal为无音乐/无原歌词的可运行画面库，镜头按旧作时间布局；换剧本就改`SHOTS`、config、事件、字幕，不只换一个标题。

## 修改位置

`config.js`片长/BPM/起拍/音频；`core.js`纸纹、绘画、光照、相机；`clawd.js`关键视角、情绪、肢体及配件hooks；`timeline.js`镜头注册；`scenes`剧情。详细参数查engine-api。

动作是`t`的纯函数。不要依赖上一帧位置或累加`vy`；跳跃使用解析式或可重置固定种子模拟。用`renderAt(晚时刻)→早时刻→晚时刻`检查乱序一致性。子幻想绘画退出时恢复`T/BOILN/CAM`等，避免影响后续世界。

## 声音和节奏

技能不附用户商业歌曲。需要配乐时用用户本次提供或确认的文件，填`PROJECT.audio`或`node build.mjs --audio=assets/song.wav`。按音频实际时长、歌词和起拍调整时轴，不把示例62.275 BPM当新歌曲速度。人声、NPC字音、环境声按当前请求选择，不默认加“hey”或机械旁白。海浪、鸟、脚步、纸张和魔法音分轨；强拍动作与拟音共用事件表，结尾音乐自然淡出。

## 看实际输出

```sh
node render.mjs --strip=2.7:3.3 --crop=600,400,700,600 --w=400 --out=out/motion.jpg --chrome=/path/to/chrome
node render.mjs --clip --range=0:1 --out=out/test.mp4 --chrome=/path/to/chrome --ffmpeg=/path/to/ffmpeg
```

看关键帧和连续帧，尤其眼睛、手持物、脚落点、相机覆盖、遮罩边界、切镜前后、最后笑脸。修改已有片段时限定代码作用时间，比较未改帧/音轨，不能靠旧版本通过记录担保。

`build.mjs`默认每144帧新浏览器、两页面、每72帧重建，缓解原生绘画资源积累。帧写入为原子写且有源指纹；断点后只续同版本，不复用错版本缓存。若设备失败，先看GPU/浏览器错误，减并发或批次，再有限重试；不偷偷改成无水彩填色。

导出后使用FFmpeg全解码：`ffmpeg -v error -i out/video.mp4 -f null -`。用ffprobe或容器检查确认分辨率、帧率、实际时长和音轨；验证连续帧数、可读性及混音无削波。ZIP排除node_modules、帧缓存、用户私有绝对路径。保留字库/引擎许可证，不替未来仓库选择整体开源许可。
