console.log('淘宝商品媒体采集器已加载');

function detectWebsite() {
  const url = window.location.href;
  if (url.includes('taobao.com')) {
    return 'taobao';
  } else if (url.includes('tmall.com')) {
    return 'tmall';
  } else if (url.includes('aliexpress.')) {
    return 'aliexpress';
  }
  return null;
}

function checkPageStructure() {
  const selectors = {
    '主图': ['.thumbnails--v976to2t img', '.thumbnail--TxeB1sWz img', '.thumbnailPic--QasTmWDm'],
    'SKU图': ['.valueItem--GzWd2LsV img', '.valueItemImg--Jd1OD58R'],
    '详情图': ['.descV8-singleImage img'],
    '视频': ['video']
  };

  for (let [type, selectorList] of Object.entries(selectors)) {
    for (let selector of selectorList) {
      const elements = document.querySelectorAll(selector);
      console.log(`${type} - ${selector}: ${elements.length}`);
      if (elements.length > 0) {
        console.log('样例元素:', elements[0].outerHTML);
        console.log('样例URL:', elements[0].dataset.src || elements[0].src);
      }
    }
  }

  // 添加所有图片的检查
  const allImages = document.querySelectorAll('img');
  console.log('页面上所有图片数量:', allImages.length);
  if (allImages.length > 0) {
    console.log('前10个图片URL:');
    Array.from(allImages).slice(0, 10).forEach(img => {
      const src = img.dataset.src || img.src || img.getAttribute('src');
      if (src && !src.includes('placeholder') && !src.endsWith('.svg') && src !== '//g.alicdn.com/s.gif') {
        console.log(src);
      }
    });
  }
}

// 在页面加载完成后执行检查
document.addEventListener('DOMContentLoaded', (event) => {
  console.log('页面已完全加载');
  checkPageStructure();
});

// 也在窗口加载完成后执行检查，以防有延迟加载的内容
window.addEventListener('load', (event) => {
  console.log('窗口已完全加载');
  checkPageStructure();
});

// 每隔5秒检查一次，以防有动态加载的内容
setInterval(checkPageStructure, 5000);
