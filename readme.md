# 目标
## 视频处理
### <del>1. 把数据发给ext的back处理（fail</del>
#### 流程
1. content script拿到capture的stream -> blob
2. chrome.sendMessage给background.js发送 `blobToBase64(blob)`
3. background.js收到 `base64ToBlob(bae64)`
4. <del>background.js启动muxer.js **（! v3的background不支持worker，卡住了）**</del>
5. ...
----
### 2. 把数据放在page里处理
#### 首先要注意的点
1. v3对于脚本的限制，或许真要考虑放弃v3

#### 流程
1. popup点击inject script时插入muxer.js
2. content script拿到capture的stream -> blob
3. muxer.js处理成fmp4
4. 启动下载
----
## 视频获取
### 1. 把可以下载的视频下载下来，然后ffmpeg等切片（未证明完全可行
#### 概括
只能针对y2b这种把地址暴露的，有些局限

----
### 2. 发送range的请求给传统media source的（未证明完全可行
#### 概括
- 只能针对传统range类型的请求，有些局限
- 从range:0-??下载下来的完全可以播，但是把这个和range后随机一段合并就后面的播不了了

----
### 3. stream recorder的capture模式做法
#### 简单概括
inject script to hack `MediaSource`原型，在`addSourceBuffer`方法上拿到**缓存的buffer**，然后发给新tab
#### 流程(->为自己插件的插入流程)
1. 启动capture模式时，系统刷新页面content inject相关script，hack `MediaSource`原型的`addSourceBuffer`方法
2. ->输入开始结束时间和video容器
3. ->`video容器.currentTime = 开始时间`，监听`onProgress`事件，如果
   1. 满足的结束时间，通过*dom通信*给content发送停止事件
   2. 不满时间且没有继续触发`onProgress`事件（加载不是一直进行的时候），跳到该`buffered - 1~2秒`处让系统继续加载
4. 拿到的buffer转化成**URL(buffer)**，通过*dom通信*给content发送该url
5. content给ext的新页面发送该url
6. 新页面通过**ajax该url拿到该buffer数据**
7. 合并成mp4

#### 发现的一些东西
- capture模式是可以跳着缓存然后合并成一段，其中
  - 如果是上一段缓存后面的，完全可以拼上
  - 如果不是上一段，也能合并，但是声音有很大的延迟
----


## y2b广告处理
### 1. fetch拦截
#### 流程
1. injecter插入fetch的head拦截代码
2. 匹配host的url和[开源y2b广告host list](https://raw.githubusercontent.com/Ewpratten/youtube_ad_blocklist/master/blocklist.txt)匹配的，直接返回`response = new Blob([])`
3. **结果：host list不准确，有些广告可以屏蔽，有些不在list里，有些实际视频也会被屏蔽**、

### 2. adblock开源copy
地址： https://github.com/betafish-inc/adblock-releases

# TODO
[ ] 单页多个video下vb的

[ ] （长期）webm接入方案

[ ] （长期）buffer生成的视频裁剪精确时间方案

[ x ] 长时间段的buffer录制

[ x ] 蒙层和独立视频控制器
    [ x ] 蒙层
    [ x ] 音量控制器，静音功能与插件结合
    [ x ] 劫持原有按键控制

[ x ] modal component