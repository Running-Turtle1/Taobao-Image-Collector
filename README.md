# Taotao Fast Image Collector

This is a Chrome browser extension for collecting image and video URLs from Taobao, Tmall, and AliExpress product pages.

## Product Features

1. Automatic Collection:
   - Main Images: Retrieve high-resolution URLs of product main images
   - SKU Images: Collect image URLs for all product specifications (e.g., color, size)
   - Detail Images: Extract all image URLs from the product detail page
   - Review Images: Collect image URLs attached to user reviews
   - Videos: Obtain video URLs from the product page

2. Result Display:
   - Show all collected results in a new tab, categorized
   - Provide image preview functionality
   - Display the actual size of each image

3. Download Features:
   - Support direct download of individual images
   - Batch download option for selected images by category
   - Automatically create date-time named folders to store downloaded files

4. User Interface:
   - Clean popup window interface
   - One-click collection feature
   - Collection progress display

5. Multi-platform Support:
   - Support for Taobao, Tmall, and AliExpress platforms

## Technology Stack

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Chrome Extension API

- Data Processing:
  - Chrome Storage API: For local data storage
  - Fetch API: For network requests

- Image Processing:
  - Canvas API: For image size calculation and preview generation

- Version Control:
  - Git: For code version management

## Update History

### v2.0 (Latest Version)
- Update Date: 2023-05-25
- Updates:
  1. Optimized SKU image URL processing logic, now correctly retrieves original images from Taobao and Tmall
  2. Improved AliExpress image URL processing, resolving image loading failures
  3. Enhanced Taobao video retrieval logic, now correctly obtains video URLs
  4. Added video preview and control functionality to the results page
  5. Implemented batch download feature for selected images by category
  6. Added automatic creation of date-time named folders, optimizing file organization for downloads

### v1.9
- Update Date: 2023-05-20
- Updates:
  1. Unified download format processing for main images and SKU images
  2. Optimized .webp format image processing, now attempts to retrieve original formats
  3. Improved image download logic, enhancing format consistency

### v1.8
- Update Date: 2023-04-15
- Updates:
  1. Updated plugin name to "Taotao Fast Image Collector"
  2. Fixed AliExpress main image URL processing issue, now correctly retrieves original image URLs
  3. Improved image URL processing logic, removed extra suffixes from AliExpress image URLs
  4. Optimized code structure, improved performance

## Installation Instructions

1. Download or clone this repository to your local machine
2. Open Chrome browser, go to the extensions page (chrome://extensions/)
3. Enable "Developer mode"
4. Click "Load unpacked extension"
5. Select the folder containing the plugin files

## Usage Instructions

1. Visit any Taobao, Tmall, or AliExpress product page
2. Click the plugin icon in the Chrome toolbar to open the popup window
3. Click the "Collect Media" button in the popup window
4. Wait for a new tab to open, displaying the collection results
5. View categorized image previews and video links on the results page
6. Click on an image to view the original in a new tab
7. Click the download button to directly download the image or video
8. Use the batch download button to download selected images

## Notes

- This plugin is for learning and research purposes only
- Please respect the intellectual property rights of websites and sellers, do not use collected media for commercial purposes
- Excessive use may affect your Taobao account, please use with caution

## Privacy Statement

This plugin does not upload any personal information or browsing data. All media URL collection operations are performed locally, and results are only saved in the browser's local storage.

## License

MIT License

## Contribution Guidelines

We welcome all forms of contributions, including but not limited to:
- Reporting issues
- Submitting feature requests
- Submitting code fixes or new features
- Improving documentation

Please follow these steps:
1. Fork this repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## Contact Information

For any questions or suggestions, please contact us through:
- Email: support@taotaocollector.com
- GitHub Issues: [https://github.com/yourusername/taotao-fast-image-collector/issues](https://github.com/yourusername/taotao-fast-image-collector/issues)

Thank you for using Taotao Fast Image Collector!
