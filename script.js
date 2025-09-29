// script.js
let homeAdLoaded = false;
let scriptAdLoaded = false;

// Voting System - Using localStorage for persistence with per-PC restrictions
let voteCounts = {
    thumbsUp: 150,
    thumbsDown: 23,
    favorite: 89
};

let scriptVoteCounts = {
    thumbsUp: 198,
    thumbsDown: 31,
    favorite: 142
};

// Get unique device identifier (fallback to localStorage-based UUID)
function getDeviceId() {
    let deviceId = localStorage.getItem('lemonHubDeviceId');
    if (!deviceId) {
        deviceId = 'device-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('lemonHubDeviceId', deviceId);
    }
    return deviceId;
}

// Check if user has already voted for a specific type
function hasVoted(section, voteType) {
    const deviceId = getDeviceId();
    const voteKey = `lemonHubVote_${section}_${voteType}_${deviceId}`;
    return localStorage.getItem(voteKey) === 'true';
}

// Mark user as having voted
function markAsVoted(section, voteType) {
    const deviceId = getDeviceId();
    const voteKey = `lemonHubVote_${section}_${voteType}_${deviceId}`;
    localStorage.setItem(voteKey, 'true');
}

// Load vote counts from localStorage
function loadVoteCounts() {
    const savedHome = localStorage.getItem('lemonHubVotesHome');
    if (savedHome) {
        voteCounts = JSON.parse(savedHome);
    }
    
    const savedScript = localStorage.getItem('lemonHubVotesScript');
    if (savedScript) {
        scriptVoteCounts = JSON.parse(savedScript);
    }
    
    updateVoteDisplays();
}

// Save vote counts to localStorage
function saveVoteCounts() {
    localStorage.setItem('lemonHubVotesHome', JSON.stringify(voteCounts));
    localStorage.setItem('lemonHubVotesScript', JSON.stringify(scriptVoteCounts));
}

// Update vote count displays
function updateVoteDisplays() {
    // Home section votes
    if (document.getElementById('thumbsUpCount')) {
        document.getElementById('thumbsUpCount').textContent = voteCounts.thumbsUp;
    }
    if (document.getElementById('thumbsDownCount')) {
        document.getElementById('thumbsDownCount').textContent = voteCounts.thumbsDown;
    }
    if (document.getElementById('favoriteCount')) {
        document.getElementById('favoriteCount').textContent = voteCounts.favorite;
    }
    
    // Script section votes
    if (document.getElementById('scriptThumbsUpCount')) {
        document.getElementById('scriptThumbsUpCount').textContent = scriptVoteCounts.thumbsUp;
    }
    if (document.getElementById('scriptThumbsDownCount')) {
        document.getElementById('scriptThumbsDownCount').textContent = scriptVoteCounts.thumbsDown;
    }
    if (document.getElementById('scriptFavoriteCount')) {
        document.getElementById('scriptFavoriteCount').textContent = scriptVoteCounts.favorite;
    }
}

// Handle voting for home section
function vote(type) {
    if (hasVoted('home', type)) {
        showVoteMessage('You have already voted for this option!', 'warning');
        return;
    }
    
    voteCounts[type]++;
    markAsVoted('home', type);
    updateVoteDisplays();
    saveVoteCounts();
    activateHomeAd();
    
    // Visual feedback
    const button = event.currentTarget;
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    showVoteMessage('Thanks for voting!', 'success');
}

// Handle voting for script section
function voteScript(type) {
    if (hasVoted('script', type)) {
        showVoteMessage('You have already voted for this script option!', 'warning');
        return;
    }
    
    scriptVoteCounts[type]++;
    markAsVoted('script', type);
    updateVoteDisplays();
    saveVoteCounts();
    activateScriptAd();
    
    // Visual feedback
    const button = event.currentTarget;
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    showVoteMessage('Thanks for voting on the script!', 'success');
}

// Show vote message
function showVoteMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.vote-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'vote-message';
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        ${type === 'success' ? 'background: linear-gradient(45deg, #4CAF50, #45a049);' : 'background: linear-gradient(45deg, #ff9800, #f57c00);'}
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Add slide animations for messages
const messageStyle = document.createElement('style');
messageStyle.textContent = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(messageStyle);

// URL Routing System with Hash
function navigateTo(hash) {
    // Update URL hash without page reload
    window.location.hash = hash;
    
    // Show the selected section
    showSection(hash);
    
    // Activate appropriate ad
    if (hash === '#Home') {
        activateHomeAd();
    } else if (hash === '#Script') {
        activateScriptAd();
    }
}

function showSection(hash) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Determine which section to show based on hash
    let sectionId;
    if (hash === '#Home' || hash === '') {
        sectionId = 'home-section';
        const homeBtn = document.querySelector('.nav-btn[onclick="navigateTo(\'#Home\')"]');
        if (homeBtn) homeBtn.classList.add('active');
    } else if (hash === '#Script') {
        sectionId = 'script-section';
        const scriptBtn = document.querySelector('.nav-btn[onclick="navigateTo(\'#Script\')"]');
        if (scriptBtn) scriptBtn.classList.add('active');
    }
    
    // Show selected section
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
}

// Handle browser back/forward buttons and hash changes
window.addEventListener('hashchange', function() {
    showSection(window.location.hash);
});

// Handle initial page load
window.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash || '#Home';
    showSection(hash);
    
    // Load vote counts
    loadVoteCounts();
    
    // Initialize other functionality
    initializePage();
});

function copyScript() {
    const scriptCode = document.getElementById('script-code').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(scriptCode).then(function() {
            showCopyFeedback();
        }, function(err) {
            fallbackCopyTextToClipboard(scriptCode);
        });
    } else {
        fallbackCopyTextToClipboard(scriptCode);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    
    copyBtn.innerHTML = '<svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>Copied!';
    copyBtn.style.background = 'linear-gradient(45deg, #45a049, #3d8b40)';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
    }, 2000);
}

// Ad loading functions
function activateHomeAd() {
    if (!homeAdLoaded) {
        // Load first ad script for home section
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//pl27744551.revenuecpmgate.com/bb/8c/2d/bb8c2d6e31450dd77b72750cfb7d1804.js';
        const homeAdContainer = document.getElementById('home-ad-container');
        if (homeAdContainer) {
            homeAdContainer.appendChild(script);
        }
        homeAdLoaded = true;
    }
}

function activateScriptAd() {
    if (!scriptAdLoaded) {
        // Load second ad script for script section
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//pl27744551.revenuecpmgate.com/bb/8c/2d/bb8c2d6e31450dd77b72750cfb7d1804.js';
        const scriptAdContainer = document.getElementById('script-ad-container');
        if (scriptAdContainer) {
            scriptAdContainer.appendChild(script);
        }
        scriptAdLoaded = true;
    }
}

function createUniversalRipple(event) {
    const size = 50;
    
    const x = event.clientX - size / 2;
    const y = event.clientY - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 235, 59, 0.2) 30%, rgba(255, 255, 255, 0.1) 60%, transparent 100%);
        border-radius: 50%;
        transform: scale(0);
        animation: universalRipple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 99999;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Enhanced ripples for specific interactive elements
function addEnhancedRipple(element, event) {
    if (!element.getBoundingClientRect) return;
    
    const rect = element.getBoundingClientRect();
    const size = 70;
    
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: scale(0);
        animation: universalRipple 0.5s ease-out;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 500);
}

function addRipple(event) {
    addEnhancedRipple(event.currentTarget, event);
}

function initializePage() {
    // Make sure all interactive elements can contain ripples
    const interactiveElements = [
        '.nav-btn', '.copy-btn', '.accept-invite-btn', 
        '.executor-item', '.legend-item', '.feature-card',
        '.script-box', '.invitation-card', '.hero',
        '.vote-btn', '.game-link-btn',
        'button', 'a'
    ];
    
    interactiveElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.position = element.style.position || 'relative';
            element.style.overflow = element.style.overflow || 'hidden';
            
            element.addEventListener('click', function(event) {
                addEnhancedRipple(this, event);
            });
        });
    });
    
    // Special lemon interactions
    const lemons = document.querySelectorAll('.lemon, .lemon-float');
    lemons.forEach(lemon => {
        lemon.addEventListener('click', function(event) {
            event.stopPropagation();
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = this.classList.contains('lemon-float') ? 'floatLemon 2s ease-in-out' : 'float 2s ease-in-out';
        });
    });
    
    // Add global click listener for universal ripples
    document.addEventListener('click', function(event) {
        // Only create universal ripple if not clicking on specific interactive elements
        const isInteractive = event.target.closest('.nav-btn, .copy-btn, .accept-invite-btn, .executor-item, .legend-item, .feature-card, .vote-btn, .game-link-btn, button, a');
        if (!isInteractive) {
            createUniversalRipple(event);
        }
    });
    
    // Initialize vote button states
    updateVoteButtonStates();
}

function updateVoteButtonStates() {
    // Check and update home section vote buttons
    const homeVoteTypes = ['thumbsUp', 'thumbsDown', 'favorite'];
    homeVoteTypes.forEach(type => {
        if (hasVoted('home', type)) {
            const button = document.querySelector(`.voting-section .vote-btn.${type === 'thumbsUp' ? 'thumbs-up' : type === 'thumbsDown' ? 'thumbs-down' : 'favorite'}`);
            if (button && !button.classList.contains('script-vote')) {
                button.style.opacity = '0.6';
                button.style.cursor = 'not-allowed';
                button.title = 'You have already voted';
            }
        }
    });
    
    // Check and update script section vote buttons
    const scriptVoteTypes = ['thumbsUp', 'thumbsDown', 'favorite'];
    scriptVoteTypes.forEach(type => {
        if (hasVoted('script', type)) {
            const scriptButtons = document.querySelectorAll('#script-section .vote-btn');
            scriptButtons.forEach(button => {
                if ((type === 'thumbsUp' && button.classList.contains('thumbs-up')) ||
                    (type === 'thumbsDown' && button.classList.contains('thumbs-down')) ||
                    (type === 'favorite' && button.classList.contains('favorite'))) {
                    button.style.opacity = '0.6';
                    button.style.cursor = 'not-allowed';
                    button.title = 'You have already voted';
                }
            });
        }
    });
}
