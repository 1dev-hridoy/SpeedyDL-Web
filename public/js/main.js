document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const videoUrlInput = document.getElementById('video-url');
    const downloadBtn = document.getElementById('download-btn');
    const platformBtns = document.querySelectorAll('.platform-btn');
    const videoPreview = document.getElementById('video-preview');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitle = document.getElementById('video-title');
    const videoButtons = document.getElementById('video-buttons');
    const loadingOverlay = document.getElementById('loading-overlay');
    const recentDownloads = document.getElementById('recent-downloads');
    const downloadsList = document.getElementById('downloads-list');
    const emptyState = document.getElementById('empty-state');
    
    // State
    let selectedPlatform = 'youtube';
    let recentDownloadsArray = JSON.parse(localStorage.getItem('recentDownloads')) || [];
    
    // Initialize
    initializePlatformButtons();
    renderRecentDownloads();
    
    // Event Listeners
    downloadBtn.addEventListener('click', handleDownload);
    
    platformBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            platformBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPlatform = btn.dataset.platform;
        });
    });
    
    // Functions
    function initializePlatformButtons() {
        // Set YouTube as default selected platform
        platformBtns.forEach(btn => {
            if (btn.dataset.platform === selectedPlatform) {
                btn.classList.add('active');
            }
        });
    }
    
    async function handleDownload() {
        const url = videoUrlInput.value.trim();
        
        if (!url) {
            alert('Please enter a valid URL');
            return;
        }
        
        showLoading();
        
        try {
            const response = await fetch(`/api/${selectedPlatform}?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch video data');
            }
            
            const data = await response.json();
            displayVideoPreview(data);
            addToRecentDownloads(data, url);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process the URL. Please try again.');
        } finally {
            hideLoading();
        }
    }
    
    function displayVideoPreview(data) {
        // Clear previous buttons
        videoButtons.innerHTML = '';
        
        // Set thumbnail and title
        if (selectedPlatform === 'youtube') {
            videoThumbnail.src = data.thumb || '';
            videoTitle.textContent = data.title || 'YouTube Video';
            
            // Add download buttons
            if (data.video) {
                addDownloadButton('Download SD', data.video, 'video');
            }
            if (data.video_hd) {
                addDownloadButton('Download HD', data.video_hd, 'video');
            }
            if (data.audio) {
                addDownloadButton('Download Audio', data.audio, 'audio');
            }
        } else if (selectedPlatform === 'facebook') {
            videoThumbnail.src = data.thumbnail || '';
            videoTitle.textContent = data.title || 'Facebook Video';
            
            // Add download buttons
            if (data.sd) {
                addDownloadButton('Download SD', data.sd, 'video');
            }
            if (data.hd) {
                addDownloadButton('Download HD', data.hd, 'video');
            }
        } else if (selectedPlatform === 'instagram') {
            if (data.thumb && data.thumb.length > 0) {
                videoThumbnail.src = data.thumb[0] || '';
            }
            videoTitle.textContent = 'Instagram Media';
            
            // Add download buttons
            if (data.video && data.video.length > 0) {
                addDownloadButton('Download Video', data.video[0], 'video');
            }
            if (data.images && data.images.length > 0) {
                data.images.forEach((img, index) => {
                    addDownloadButton(`Download Image ${index + 1}`, img, 'image');
                });
            }
        } else if (selectedPlatform === 'tiktok') {
            videoThumbnail.src = data.thumbnail || '';
            videoTitle.textContent = data.title || 'TikTok Video';
            
            // Add download buttons
            if (data.video) {
                addDownloadButton('Download Video', data.video, 'video');
            }
            if (data.audio) {
                addDownloadButton('Download Audio', data.audio, 'audio');
            }
        } else if (selectedPlatform === 'twitter') {
            videoThumbnail.src = data.thumbnail || '';
            videoTitle.textContent = 'Twitter Video';
            
            // Add download buttons
            if (data.SD) {
                addDownloadButton('Download SD', data.SD, 'video');
            }
            if (data.HD) {
                addDownloadButton('Download HD', data.HD, 'video');
            }
        }
        
        // Show video preview section
        videoPreview.classList.remove('hidden');
    }
    
    function addDownloadButton(text, url, type) {
        const button = document.createElement('a');
        button.href = url;
        button.target = '_blank';
        button.className = 'download-button';
        
        // Add appropriate icon based on type
        let icon = 'fa-download';
        if (type === 'video') {
            icon = 'fa-video';
        } else if (type === 'audio') {
            icon = 'fa-music';
        } else if (type === 'image') {
            icon = 'fa-image';
        }
        
        button.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
        videoButtons.appendChild(button);
    }
    
    function addToRecentDownloads(data, originalUrl) {
        // Create download item object
        const downloadItem = {
            id: Date.now(),
            platform: selectedPlatform,
            url: originalUrl,
            thumbnail: getThumbnailFromData(data),
            title: getTitleFromData(data),
            timestamp: new Date().toISOString()
        };
        
        // Add to recent downloads array
        recentDownloadsArray.unshift(downloadItem);
        
        // Limit to 10 items
        if (recentDownloadsArray.length > 10) {
            recentDownloadsArray = recentDownloadsArray.slice(0, 10);
        }
        
        // Save to localStorage
        localStorage.setItem('recentDownloads', JSON.stringify(recentDownloadsArray));
        
        // Update UI
        renderRecentDownloads();
    }
    
    function getThumbnailFromData(data) {
        switch (selectedPlatform) {
            case 'youtube':
                return data.thumb || '';
            case 'facebook':
                return data.thumbnail || '';
            case 'instagram':
                return data.thumb && data.thumb.length > 0 ? data.thumb[0] : '';
            case 'tiktok':
                return data.thumbnail || '';
            case 'twitter':
                return data.thumbnail || '';
            default:
                return '';
        }
    }
    
    function getTitleFromData(data) {
        switch (selectedPlatform) {
            case 'youtube':
                return data.title || 'YouTube Video';
            case 'facebook':
                return data.title || 'Facebook Video';
            case 'instagram':
                return 'Instagram Media';
            case 'tiktok':
                return data.title || 'TikTok Video';
            case 'twitter':
                return 'Twitter Video';
            default:
                return 'Media';
        }
    }
    
    function renderRecentDownloads() {
        if (recentDownloadsArray.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }
        
        // Hide empty state
        emptyState.classList.add('hidden');
        
        // Clear current list (except empty state)
        const items = downloadsList.querySelectorAll('.download-item');
        items.forEach(item => item.remove());
        
        // Add download items
        recentDownloadsArray.forEach(item => {
            const downloadItem = document.createElement('div');
            downloadItem.className = 'download-item';
            
            downloadItem.innerHTML = `
                <img src="${item.thumbnail || '/placeholder.svg'}" alt="Thumbnail">
                <div class="download-item-info">
                    <div class="download-item-title">${item.title}</div>
                    <div class="download-item-platform">
                        <i class="fab fa-${item.platform}"></i> ${capitalizeFirstLetter(item.platform)}
                    </div>
                </div>
                <a href="${item.url}" target="_blank" class="download-button">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            `;
            
            downloadsList.appendChild(downloadItem);
        });
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function showLoading() {
        loadingOverlay.classList.remove('hidden');
    }
    
    function hideLoading() {
        loadingOverlay.classList.add('hidden');
    }
});