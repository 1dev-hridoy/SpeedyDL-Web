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
    const qualityRadios = document.querySelectorAll('input[name="quality"]');
    
    // State
    let selectedPlatform = 'youtube';
    let selectedQuality = 'hd'; // Default to HD
    let recentDownloadsArray = JSON.parse(localStorage.getItem('recentDownloads')) || [];
    
    // Initialize
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
    
    qualityRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                selectedQuality = radio.value;
            }
        });
    });
    
    // Add Enter key support for the URL input
    videoUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleDownload();
        }
    });
    
    // Functions
    async function handleDownload() {
        const url = videoUrlInput.value.trim();
        
        if (!url) {
            showNotification('Please enter a valid URL', 'error');
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
            showNotification('Video processed successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to process the URL. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }
    
    function displayVideoPreview(data) {
        // Clear previous buttons
        videoButtons.innerHTML = '';
        
        // Set thumbnail and title
        if (selectedPlatform === 'youtube') {
            videoThumbnail.src = data.thumb || '/placeholder.svg';
            videoTitle.textContent = data.title || 'YouTube Video';
            
            // Add download buttons based on selected quality
            if (selectedQuality === 'sd' && data.video) {
                addDownloadButton('Download SD Video', data.video, 'video');
            } else if (selectedQuality === 'hd' && data.video_hd) {
                addDownloadButton('Download HD Video', data.video_hd, 'video');
            } else if (selectedQuality === 'audio' && data.audio) {
                addDownloadButton('Download Audio', data.audio, 'audio');
            } else {
                // Fallback if selected quality is not available
                if (data.video) addDownloadButton('Download SD Video', data.video, 'video');
                if (data.video_hd) addDownloadButton('Download HD Video', data.video_hd, 'video');
                if (data.audio) addDownloadButton('Download Audio', data.audio, 'audio');
            }
        } else if (selectedPlatform === 'facebook') {
            videoThumbnail.src = data.thumbnail || '/placeholder.svg';
            videoTitle.textContent = data.title || 'Facebook Video';
            
            // Add download buttons based on selected quality
            if (selectedQuality === 'sd' && data.sd) {
                addDownloadButton('Download SD Video', data.sd, 'video');
            } else if (selectedQuality === 'hd' && data.hd) {
                addDownloadButton('Download HD Video', data.hd, 'video');
            } else {
                // Fallback
                if (data.sd) addDownloadButton('Download SD Video', data.sd, 'video');
                if (data.hd) addDownloadButton('Download HD Video', data.hd, 'video');
            }
        } else if (selectedPlatform === 'instagram') {
            if (data.thumb && data.thumb.length > 0) {
                videoThumbnail.src = data.thumb[0] || '/placeholder.svg';
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
            videoThumbnail.src = data.thumbnail || '/placeholder.svg';
            videoTitle.textContent = 'TikTok Video';
            
            // Add download buttons based on selected quality
            if (selectedQuality === 'audio' && data.audio) {
                addDownloadButton('Download Audio', data.audio, 'audio');
            } else {
                if (data.video) addDownloadButton('Download Video', data.video, 'video');
                if (data.audio) addDownloadButton('Download Audio', data.audio, 'audio');
            }
        } else if (selectedPlatform === 'twitter') {
            videoThumbnail.src = data.thumbnail || '/placeholder.svg';
            videoTitle.textContent = 'Twitter Video';
            
            // Add download buttons based on selected quality
            if (selectedQuality === 'sd' && data.SD) {
                addDownloadButton('Download SD Video', data.SD, 'video');
            } else if (selectedQuality === 'hd' && data.HD) {
                addDownloadButton('Download HD Video', data.HD, 'video');
            } else {
                // Fallback
                if (data.SD) addDownloadButton('Download SD Video', data.SD, 'video');
                if (data.HD) addDownloadButton('Download HD Video', data.HD, 'video');
            }
        }
        
        // Show video preview section
        videoPreview.classList.remove('hidden');
        
        // Scroll to video preview
        videoPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function addDownloadButton(text, url, type) {
        const button = document.createElement('a');
        button.href = url;
        button.className = 'download-button';
        
        // Set download attribute to enable direct download
        button.setAttribute('download', '');
        
        // Add appropriate icon based on type
        let icon = 'fa-download';
        if (type === 'video') {
            icon = 'fa-video';
        } else if (type === 'audio') {
            icon = 'fa-music';
        } else if (type === 'image') {
            icon = 'fa-image';
        }
        
        button.innerHTML = `<i class="fas ${icon} download-button-icon"></i> ${text}`;
        videoButtons.appendChild(button);
        
        // For videos and audio that might not download directly with the download attribute
        button.addEventListener('click', function(e) {
            // For some platforms, we need to handle the download manually
            if (type === 'video' || type === 'audio') {
                e.preventDefault();
                downloadFile(url, generateFileName(type));
            }
            
            // Track download
            trackDownload(url, type);
        });
    }

    // Function to generate a filename based on the content type and current timestamp
    function generateFileName(type) {
        const timestamp = new Date().getTime();
        const platform = selectedPlatform;
        
        if (type === 'video') {
            return `${platform}_video_${timestamp}.mp4`;
        } else if (type === 'audio') {
            return `${platform}_audio_${timestamp}.mp3`;
        } else if (type === 'image') {
            return `${platform}_image_${timestamp}.jpg`;
        }
        
        return `download_${timestamp}`;
    }

    // Function to download a file using fetch
    function downloadFile(url, fileName) {
        showLoading();
        showNotification('Starting download...', 'info');
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                hideLoading();
                
                // Create a temporary URL for the blob
                const blobUrl = window.URL.createObjectURL(blob);
                
                // Create a temporary link element
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName;
                
                // Append to the document, click it, and remove it
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Release the blob URL
                window.URL.revokeObjectURL(blobUrl);
                
                showNotification('Download complete!', 'success');
            })
            .catch(error => {
                hideLoading();
                console.error('Download failed:', error);
                
                // Fallback to opening in new tab if download fails
                showNotification('Direct download failed. Opening in new tab...', 'error');
                window.open(url, '_blank');
            });
    }
    
    function trackDownload(url, type) {
        // You could implement analytics here
        console.log(`Download clicked: ${type} - ${url}`);
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
        
        const formattedDate = formatDate(new Date(item.timestamp));
        
        downloadItem.innerHTML = `
            <div class="download-item-thumbnail-container">
                <img src="${item.thumbnail || '/placeholder.svg'}" alt="Thumbnail" class="download-item-thumbnail">
            </div>
            <div class="download-item-info">
                <div class="download-item-title">${item.title}</div>
                <div class="download-item-platform">
                    <i class="fab fa-${item.platform}"></i> ${capitalizeFirstLetter(item.platform)} • ${formattedDate}
                </div>
            </div>
            <div class="download-item-action">
                <a href="${item.url}" class="download-button" download>
                    <i class="fas fa-download download-button-icon"></i>
                </a>
            </div>
        `;
        
        // Add event listener to the download button
        const downloadBtn = downloadItem.querySelector('.download-button');
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadFile(item.url, generateFileName('video'));
        });
        
        downloadsList.appendChild(downloadItem);
    });
}
    
    function formatDate(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) {
            return 'just now';
        } else if (diffMin < 60) {
            return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        } else if (diffDay < 7) {
            return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
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
    
    function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on notification type
    let icon = 'fa-info-circle';
    if (type === 'success') {
        icon = 'fa-check-circle';
    } else if (type === 'error') {
        icon = 'fa-exclamation-circle';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
});