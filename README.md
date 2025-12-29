# Taotao Fast Image Collector（淘宝/天猫/速卖通 图片视频采集器）

一个 Chrome 扩展：在淘宝、天猫、AliExpress 商品页一键采集媒体资源（主图 / SKU 图 / 详情图 / 买家秀 / 视频），并在结果页按分类预览与下载。

English: A Chrome extension to collect and download media URLs from Taobao/Tmall/AliExpress product pages.

## 功能特性

- 一键采集：主图 / SKU 图 / 详情图 / 买家秀 / 视频链接
- 结果页预览：按分类展示，支持打开原图链接
- 一键下载：单张下载 + 分类批量下载（默认全选图片）
- 自动分文件夹：下载时创建时间戳文件夹（便于整理）

## 安装（Load unpacked）

1. 下载或 `git clone` 本仓库到本地
2. 打开 Chrome 扩展页：`chrome://extensions/`
3. 右上角开启 `Developer mode`（开发者模式）
4. 点击 `Load unpacked`（加载已解压的扩展程序）
5. 选择本项目目录（包含 `manifest.json` 的文件夹）

## 使用方法

1. 打开任意商品页（支持域名：`taobao.com` / `tmall.com` / `aliexpress.*`）
2. 点击浏览器工具栏扩展图标，打开弹窗
3. 点击 `Collect Media`
4. 会自动打开 `Collection Results` 新标签页：
   - 图片默认已全选：直接点击各分类的 `Download Selected ... Images` 即可开始下载
   - 侧边栏提供：一键全选 / 一键取消 / 切换主题

## 常见问题

- 找不到内容/数量为 0：部分页面是动态加载的，滚动页面或稍等几秒后再采集。
- 下载失败：检查 Chrome 下载权限、目标站点是否限制访问、以及图片链接是否为原图地址。

## 开发说明

- 入口：`popup.html` / `popup.js`
- 采集脚本：`content-script.js`
- 结果页：`result.html` / `result.js`
- 配置：`manifest.json`（MV3，使用 `scripting` / `storage` / `downloads` 等权限）

## 隐私声明

本扩展不上传任何浏览数据。采集结果仅保存在浏览器本地（`chrome.storage.local`）。

## License

MIT

## 作者 / 联系方式

- GitHub: https://github.com/Running-Turtle1
- Issues: https://github.com/Running-Turtle1/Taobao-Image-Collector/issues
