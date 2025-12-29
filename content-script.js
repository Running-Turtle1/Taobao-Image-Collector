function getSkuImages() {
  const skuImages = [];
  
  // 淘宝和天猫
  const tbTmallSkuItems = document.querySelectorAll('.valueItemImg--Jd1OD58R');
  console.log('淘宝/天猫 SKU 图片元素数量:', tbTmallSkuItems.length);
  tbTmallSkuItems.forEach((item, index) => {
    let originalUrl = item.src;
    console.log(`原始 URL ${index}:`, originalUrl);
    let processedUrl = originalUrl
      .replace(/_(\.webp|\.jpg\.webp|\d+x\d+\.jpg\.webp|\d+x\d+q\d+\.jpg\.webp)$/, '') // 移除各种.webp后缀
      .replace(/_(q\d+|Q\d+)(\.jpg)?$/, '') // 移除质量参数
      .replace(/(_\d+x\d+)?(\.jpg)?$/, ''); // 移除尺寸参数，但不强制添加.jpg后缀
    
    // 保留原始文件扩展名
    const extension = originalUrl.split('.').pop().split('_')[0];
    processedUrl = processedUrl + '.' + extension;
    
    console.log(`处理后 URL ${index}:`, processedUrl);
    
    // 获取SKU描述
    const skuDescription = item.getAttribute('alt') || '无描述';
    
    skuImages.push({url: processedUrl, skuDescription: skuDescription});
  });

  // AliExpress
  const aliexpressSkuItems = document.querySelectorAll('.sku-item--image--jMUnnGA img');
  console.log('AliExpress SKU 图片元素数量:', aliexpressSkuItems.length);
  aliexpressSkuItems.forEach((item, index) => {
    let originalUrl = item.src;
    console.log(`原始 URL ${index}:`, originalUrl);
    let processedUrl = originalUrl
      .replace(/_\d+x\d+\.jpg_\.webp$/, '')  // 移除尺寸参数和webp后缀
      .replace(/\.jpg_\d+x\d+\.jpg_\.webp$/, '')  // 处理可能的双重后缀
      .replace(/(_\d+x\d+)?(\.jpg)?$/, ''); // 移除可能的尺寸参数，但不添加.jpg后缀
    
    // 尝试获取更高质量的图片
    processedUrl = processedUrl.replace(/\.jpg_\d+x\d+\./, '.');
    
    console.log(`处理后 URL ${index}:`, processedUrl);
    
    // 获取SKU描述
    const skuDescription = item.getAttribute('alt') || '无描述';
    
    skuImages.push({url: processedUrl, skuDescription: skuDescription});
  });

  console.log('处理后的 SKU 图片:', skuImages);

  return skuImages;
}

function getMainImages() {
  let mainImages = [];

  // 淘宝和天猫
  const tbTmallMainImages = document.querySelectorAll('#J_UlThumb img, #J_ThumbView img');
  tbTmallMainImages.forEach(img => {
    let url = img.src;
    url = url.replace(/_\d+x\d+.*\.jpg/, '.jpg');
    mainImages.push(url);
  });

  // AliExpress
  const aliExpressMainImages = document.querySelectorAll('.images-view-item img');
  aliExpressMainImages.forEach(img => {
    let url = img.src;
    // 保留原始URL，不进行处理
    mainImages.push(url);
  });

  // 去重
  mainImages = [...new Set(mainImages)];

  console.log('Main Images:', mainImages);
  return mainImages;
}

function getVideos() {
  let videos = [];

  // 淘宝视频
  const tbVideoElements = document.querySelectorAll('video.lib-video');
  tbVideoElements.forEach(video => {
    let url = video.src || video.getAttribute('src');
    if (url) {
      // 确保URL是完整的
      if (url.startsWith('//')) {
        url = 'https:' + url;
      }
      console.log('找到淘宝视频 URL:', url);
      videos.push(url);
    }
  });

  // 去重
  videos = [...new Set(videos)];

  console.log('找到的视频:', videos);
  return videos;
}
