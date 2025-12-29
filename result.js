// 在文件顶部添加一个全局变量来存储文件夹名
let currentFolderName = '';

const THEME_KEY = 'taotaoCollectorTheme';

function generateFolderName() {
  const now = new Date();
  return `TaotaoCollector_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
}

function applySavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
    return;
  }
  // Default to system preference
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.dataset.theme = prefersLight ? 'light' : 'dark';
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
}

function getAllImageItems() {
  return document.querySelectorAll('.media-item[data-media-kind="image"]');
}

function getSelectedImageItems() {
  return document.querySelectorAll('.media-item[data-media-kind="image"].selected');
}

function selectAllImages() {
  getAllImageItems().forEach(item => item.classList.add('selected'));
  updateSelectionStatus();
}

function clearAllSelections() {
  document.querySelectorAll('.media-item.selected').forEach(item => item.classList.remove('selected'));
  updateSelectionStatus();
}

function updateSelectionStatus() {
  const status = document.getElementById('selectionStatus');
  if (!status) return;
  const total = getAllImageItems().length;
  const selected = getSelectedImageItems().length;
  status.textContent = `已选中：${selected} / ${total}`;
}

document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();

  const selectAllBtn = document.getElementById('selectAllImagesBtn');
  const clearAllBtn = document.getElementById('clearAllImagesBtn');
  const toggleThemeBtn = document.getElementById('toggleThemeBtn');

  if (selectAllBtn) selectAllBtn.addEventListener('click', selectAllImages);
  if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllSelections);
  if (toggleThemeBtn) toggleThemeBtn.addEventListener('click', toggleTheme);

  // 在页面加载时生成文件夹名
  currentFolderName = generateFolderName();
  
  chrome.storage.local.get(['collectedMedia'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error fetching data:', chrome.runtime.lastError);
      return;
    }

    console.log('Retrieved data from storage:', result.collectedMedia);

    const { mainImages, skuImages, detailImages, videos, reviewImages } = result.collectedMedia || {};
    const resultDiv = document.getElementById('result');

    if (!mainImages || !skuImages || !detailImages || !videos || !reviewImages) {
      resultDiv.innerHTML = '<p>No collected data found. Please ensure you have run the collection process.</p>';
      console.error('Missing data:', { mainImages, skuImages, detailImages, videos, reviewImages });
      return;
    }

    resultDiv.innerHTML = `
      <section id="main-images" class="section">
        <h2>Main Images (${mainImages.length})</h2>
        ${generateMediaGrid(mainImages, 'main', true)}
        <button class="download-category-btn" data-type="main">Download Selected Main Images</button>
      </section>
      
      <section id="videos" class="section">
        <h2>Videos (${videos.length})</h2>
        ${generateMediaGrid(videos, 'video', false)}
      </section>
      
      <section id="sku-images" class="section">
        <h2>SKU Images (${skuImages.length})</h2>
        ${generateMediaGrid(skuImages, 'sku', true)}
        <button class="download-category-btn" data-type="sku">Download Selected SKU Images</button>
      </section>
      
      <section id="detail-images" class="section">
        <h2>Detail Images (${detailImages.length})</h2>
        ${generateMediaGrid(detailImages, 'detail', true)}
        <button class="download-category-btn" data-type="detail">Download Selected Detail Images</button>
      </section>
      
      <section id="review-images" class="section">
        <h2>Review Images (${reviewImages.length})</h2>
        ${generateMediaGrid(reviewImages, 'review', true)}
        <button class="download-category-btn" data-type="review">Download Selected Review Images</button>
      </section>
    `;

    addEventListeners();
    // 默认全选图片（便于一键下载）
    selectAllImages();
  });
});

function addEventListeners() {
  // Add event listeners for download category images buttons
  document.querySelectorAll('.download-category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.getAttribute('data-type');
      downloadCategorySelectedImages(type);
    });
  });

  // Add event listeners for download buttons
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent parent element's click event from being triggered
      const url = this.getAttribute('data-url');
      const type = this.getAttribute('data-type');
      const index = this.getAttribute('data-index');
      let filename;
      
      if (type === 'sku') {
        const descElement = this.closest('.media-item').querySelector('.sku-description');
        let skuDescription = descElement ? descElement.textContent.trim() : 'unknown';
        // Replace invalid characters in filename
        skuDescription = skuDescription.replace(/[<>:"/\\|?*]/g, '_');
        filename = `SKU_${skuDescription}.jpg`;
      } else if (type === 'video') {
        filename = `video_${parseInt(index) + 1}.mp4`;
      } else {
        filename = `${type}_image_${parseInt(index) + 1}.jpg`;
      }
      
      downloadMedia(url, filename);
    });
  });

  // Prevent selection toggling when using links or video controls
  document.querySelectorAll('.media-item a, .media-item video').forEach(el => {
    el.addEventListener('click', (e) => e.stopPropagation());
  });

  // Get image size
  document.querySelectorAll('.thumbnail').forEach((img) => {
    img.onload = function() {
      const sizeSpan = this.closest('.media-item').querySelector('.image-size');
      sizeSpan.textContent = `${this.naturalWidth} x ${this.naturalHeight} pixels`;
    };
    if (img.complete) {
      img.onload();
    }
  });

  // Add image selection functionality
  document.querySelectorAll('.media-item').forEach(item => {
    item.addEventListener('click', function() {
      if (this.getAttribute('data-media-kind') !== 'image') return;
      this.classList.toggle('selected');
      updateSelectionStatus();
    });
  });

  // 添加视频播放按钮事件监听器
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const video = this.previousElementSibling;
      if (video.paused) {
        video.play();
        this.textContent = '❚❚'; // 暂停符号
      } else {
        video.pause();
        this.textContent = '▶'; // 播放符号
      }
    });
  });
}

function generateMediaGrid(mediaItems, type, isImage) {
  if (!mediaItems || mediaItems.length === 0) {
    return '<p>No media found.</p>';
  }

  // 使用 Set 来去除重复项
  const uniqueMediaItems = [...new Set(mediaItems)];

  return `
    <div class="media-grid">
      ${uniqueMediaItems.map((item, index) => {
        let fullUrl = type === 'sku' ? item.url : (typeof item === 'string' ? item : item.url || '');
        fullUrl = fullUrl.startsWith('//') ? 'https:' + fullUrl : fullUrl;
        
        if (isImage) {
          fullUrl = processImageUrl(fullUrl);
          return `
            <div class="media-item" data-media-kind="image" data-media-type="${type}">
              <div class="thumbnail-container">
                <img src="${fullUrl}" alt="${type} image" class="thumbnail" onerror="this.onerror=null;this.src='placeholder.png';">
                <button class="download-btn" data-url="${fullUrl}" data-type="${type}" data-index="${index}">Download</button>
              </div>
              <div class="image-size" id="${type}-size-${index}">Loading...</div>
              ${type === 'sku' ? `<div class="sku-description">${item.skuDescription || 'No description'}</div>` : ''}
              <div class="media-url"><a href="${fullUrl}" target="_blank">${fullUrl}</a></div>
            </div>
          `;
        } else {
          return `
            <div class="media-item" data-media-kind="video" data-media-type="${type}">
              <div class="video-container">
                <video src="${fullUrl}" class="video-thumbnail" controls>
                  Your browser does not support HTML5 video.
                </video>
              </div>
              <button class="download-btn" data-url="${fullUrl}" data-type="${type}" data-index="${index}">Download</button>
              <div class="media-url"><a href="${fullUrl}" target="_blank">${fullUrl}</a></div>
            </div>
          `;
        }
      }).join('')}
    </div>
  `;
}

function downloadMedia(url, filename) {
  console.log('原始下载 URL:', url);
  
  // 对于视频，我们直接打开一个新标签页
  if (filename.endsWith('.mp4')) {
    chrome.tabs.create({ url: url });
    return;
  }

  // 处理图片 URL
  const processedUrl = processImageUrl(url);
  console.log('处理后的下载 URL:', processedUrl);

  // 将文件夹名添加到文件名前
  const fullPath = `${currentFolderName}/${filename}`;

  // 对于图片，我们使用 chrome.downloads API
  chrome.downloads.download({
    url: processedUrl,
    filename: fullPath,
    saveAs: false
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      console.error('下载失败:', chrome.runtime.lastError);
      alert(`下载失败: ${chrome.runtime.lastError.message}`);
    } else {
      console.log('下载成功，下载ID:', downloadId);
    }
  });
}

function downloadCategorySelectedImages(type) {
  // 1. 构造查找范围：找到对应按钮上方的那个图片网格
  // 原理是找 class 为 media-grid 且紧接着后面有一个对应 type 的按钮
  const selectorBase = `.media-grid:has(+ button[data-type="${type}"]) .media-item`;

  // 2. 尝试获取“已手动选中”的图片
  let targets = document.querySelectorAll(`${selectorBase}.selected`);

  // 3. 如果没有选择任何图片：给出确认，避免“取消选择”后误下载全部
  if (targets.length === 0) {
    const allItems = document.querySelectorAll(selectorBase);
    if (allItems.length === 0) {
      alert(`当前分类 (${type}) 下没有找到任何图片`);
      return;
    }
    const ok = confirm(`未选择任何图片，是否下载当前分类全部图片？（${allItems.length} 张）`);
    if (!ok) return;
    targets = allItems;
    targets.forEach(item => item.classList.add('selected'));
    updateSelectionStatus();
  }

  if (targets.length === 0) {
    alert(`当前分类 (${type}) 下没有找到任何图片`);
    return;
  }

  // 4. 遍历并触发下载 (保持原有的稳定逻辑)
  targets.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      let url = img.src;
      let filename;
      
      if (type === 'sku') {
        const descElement = item.querySelector('.sku-description');
        let skuDescription = descElement ? descElement.textContent.trim() : 'unknown';
        // 替换非法字符
        skuDescription = skuDescription.replace(/[<>:"/\\|?*]/g, '_');
        filename = `SKU_${skuDescription}.jpg`;
      } else {
        filename = `${type}_image_${index + 1}.jpg`;
      }
      
      downloadMedia(url, filename);
    } else {
      console.error(`无法找到图片元素，类型: ${type}, 索引: ${index}`);
    }
  });
}

function processImageUrl(url) {
  if (url.includes('aliexpress')) {
    // 对于 AliExpress 的 URL
    return url
      .replace(/_\d+x\d+\.(jpg|png|gif|jpeg)\.webp$/, '.$1') // 移除尺寸参数和webp后缀，保留原始扩展名
      .replace(/\.(jpg|png|gif|jpeg)_\d+x\d+\.(jpg|png|gif|jpeg)\.webp$/, '.$1') // 处理双重后缀
      .replace(/_\d+x\d+Q\d+\.(jpg|png|gif|jpeg)\.webp$/, '.$1') // 处理带质量参数的情况
      .replace(/_(\.webp|\.jpg\.webp|\d+x\d+\.jpg\.webp|\d+x\d+q\d+\.jpg\.webp)$/, '') // 移除其他可能的webp后缀
      .replace(/_(q\d+|Q\d+)(\.jpg)?$/, '') // 移除质量参数
      .replace(/(_\d+x\d+)?$/, '') // 移除可能的尺寸参数
      .replace(/\.jpg_\d+x\d+\./, '.'); // 移除中间的尺寸参数
  } else {
    // 对于淘宝和天猫的 URL
    return url
      .replace(/_(\.webp|\.jpg\.webp|\d+x\d+\.jpg\.webp|\d+x\d+q\d+\.jpg\.webp)$/, '') // 移除各种.webp后缀
      .replace(/_(q\d+|Q\d+)(\.jpg|\.png)?$/, '') // 移除质量参数
      .replace(/(_\d+x\d+)?(\.jpg|\.png)?$/, (match, p1, p2) => {
        // 如果原始 URL 包含文件扩展名，则保留它；否则默认使用 .jpg
        return p2 || '.jpg';
      });
  }
}
