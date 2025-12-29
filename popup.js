document.addEventListener('DOMContentLoaded', () => {
  const collectButton = document.getElementById('collectMedia');
  const resultDiv = document.getElementById('result');
  const versionDiv = document.getElementById('version');

  // 获取并显示版本号
  chrome.management.getSelf(info => {
    versionDiv.textContent = `v${info.version}`;
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = tabs[0].url;
    if (url.includes('taobao.com') || url.includes('tmall.com') || url.includes('aliexpress.')) {
      collectButton.style.display = 'block';
      resultDiv.style.display = 'none';
    } else {
      collectButton.style.display = 'none';
      resultDiv.textContent = 'Please use this plugin on Taobao, Tmall, or AliExpress product pages';
      resultDiv.style.display = 'block';
    }
  });

  collectButton.addEventListener('click', async () => {
    resultDiv.textContent = 'Collecting media...';

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab.url.includes("taobao.com") || tab.url.includes("tmall.com") || tab.url.includes("aliexpress.")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: collectMediaFromPage,
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error('Error executing script:', chrome.runtime.lastError);
          resultDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } else if (results && results[0]) {
          const { mainImages, skuImages, detailImages, videos, reviewImages } = results[0].result;
          const totalImages = mainImages.length + skuImages.length + detailImages.length + reviewImages.length;
          console.log('Collection result:', { mainImages, skuImages, detailImages, videos, reviewImages });
          resultDiv.innerHTML = `
            <p>Found ${totalImages} product-related images and ${videos.length} videos</p>
            <p>Opening result page...</p>
          `;
          
          // Save results to storage and open result page
          chrome.storage.local.set({ collectedMedia: { mainImages, skuImages, detailImages, videos, reviewImages } }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error saving data:', chrome.runtime.lastError);
              resultDiv.textContent = 'Error: Failed to save data. ' + chrome.runtime.lastError.message;
            } else {
              console.log('Data saved to storage');
              // 打开新页面显示结果
              chrome.tabs.create({ url: 'result.html' }, (tab) => {
                if (chrome.runtime.lastError) {
                  console.error('Error creating new tab:', chrome.runtime.lastError);
                  resultDiv.textContent = 'Error: Failed to open result page. ' + chrome.runtime.lastError.message;
                } else {
                  console.log('Result page opened in new tab, tab ID:', tab.id);
                  resultDiv.textContent = 'Result page opened in new tab.';
                }
              });
            }
          });
        } else {
          console.error('No expected results received');
          resultDiv.textContent = 'Collection failed, please try again';
        }
      });
    } else {
      resultDiv.textContent = 'Please use this plugin on Taobao, Tmall, or AliExpress product pages';
    }
  });
});

function collectMediaFromPage() {
  const selectors = {
    mainImages: [
      '.thumbnails--v976to2t img', '.thumbnail--TxeB1sWz img', '.thumbnailPic--QasTmWDm', // 淘宝选择器
      '.slider--img--K0YbWW2 img', '.magnifier--image--EYYoSlr' // 速卖通选择器
    ],
    skuImages: [
      '.valueItem--GzWd2LsV', // 淘宝选择器
      '.sku-item--image--jMUnnGA' // 速卖通选择器
    ],
    detailImages: [
      '.descV8-singleImage img', // 淘宝选择器
      '.descV8-richtext img', // 淘宝详情图选择器
      '.desc-img-block img', // 淘宝详情图选择器
      '.description--product-description--Mjtql28 img', // 速卖通选择器
      '.detailmodule_text img', // 速卖通选择器（文本模块中的图片）
      '.detailmodule_dynamic img' // 速卖通选择器（动态模块中的图片）
    ],
    videos: [
      'video', // 通用选择器
      '.video--videoPlayer--qZSl_Uf', // 速卖通视频选择器
      '.video--wrap--EhkqzuR video' // 新增速卖通视频容器选择器
    ],
    reviewImages: [
      '.album--g1iixJr0 img', // 淘宝选择器
      '.feedback-image-item img' // 速卖通选择器
    ]
  };

  const results = {};

  for (let [type, selectorList] of Object.entries(selectors)) {
    results[type] = [];
    for (let selector of selectorList) {
      const elements = document.querySelectorAll(selector);
      console.log(`${type} - ${selector}: ${elements.length} elements found`);
      if (elements.length > 0) {
        const newItems = Array.from(elements).map(el => {
          try {
            if (type === 'videos') {
              if (el.tagName.toLowerCase() === 'video') {
                const source = el.querySelector('source');
                return source ? source.src : el.src;
              } else {
                // 对于速卖通的视频播放器，尝试获取视频源
                const videoSource = el.querySelector('source');
                return videoSource ? videoSource.src : null;
              }
            } else if (type === 'skuImages') {
              const img = el.querySelector('img');
              const textElement = el.querySelector('.valueItemText--HiKnUqGa');
              if (!img) {
                console.error('No img found in SKU element:', el);
                return null;
              }
              return {
                url: img.src || img.dataset.src || img.getAttribute('src'),
                skuDescription: textElement ? textElement.textContent.trim() : '无描述'
              };
            } else {
              let url = el.dataset.src || el.src || el.getAttribute('src');
              if (url.startsWith('//')) {
                url = 'https:' + url;
              }
              url = url.replace(/\.(jpg|png|gif|webp)_.*\.(jpg|png|gif|webp)$/, '.$1');
              return url;
            }
          } catch (error) {
            console.error(`Error processing ${type} element:`, error, el);
            return null;
          }
        }).filter(item => item !== null);

        // 使用 Set 去除重复项
        results[type] = [...new Set([...results[type], ...newItems])];
        console.log(`${type}: collected ${results[type].length} unique items`);
      }
    }
  }

  // 如果没有找到视频，尝试从页面脚本中提取视频URL
  if (results.videos.length === 0) {
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      const content = script.textContent;
      if (content.includes('videoInfo')) {
        const match = content.match(/"videoUrl":"([^"]+)"/);
        if (match) {
          results.videos.push(match[1]);
          console.log('Video URL extracted from script:', match[1]);
          break;
        }
      }
    }
  }

  console.log('Collection result:', results);
  return results;
}
