// script.js
let adLoaded = false;
let secondAdLoaded = false;

// Authentication and Voting System
let currentUser = null;
let voteCounts = {
    thumbsUp: 0,
    thumbsDown: 0,
    favorite: 0
};

// Default Facebook profile picture
const DEFAULT_AVATAR = 'https://static.xx.fbcdn.net/rsrc.php/v1/yR/r/tInzwsw2pVX.png';

// Load data from localStorage
function loadAppData() {
    const savedVotes = localStorage.getItem('lemonHubVotes');
    const savedUser = localStorage.getItem('lemonHubUser');
    
    if (savedVotes) {
        voteCounts = JSON.parse(savedVotes);
    }
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
        updateProfileUI();
    }
    
    updateVoteDisplays();
    updateVoteButtonStates();
}

// Save data to localStorage
function saveAppData() {
    localStorage.setItem('lemonHubVotes', JSON.stringify(voteCounts));
    if (currentUser) {
        localStorage.setItem('lemonHubUser', JSON.stringify(currentUser));
    }
}

// Update vote count displays
function updateVoteDisplays() {
    document.getElementById('thumbsUpCount').textContent = voteCounts.thumbsUp;
    document.getElementById('thumbsDownCount').textContent = voteCounts.thumbsDown;
    document.getElementById('favoriteCount').textContent = voteCounts.favorite;
}

// Update vote button states based on user voting
function updateVoteButtonStates() {
    const thumbsUpBtn = document.querySelector('.vote-btn.thumbs-up');
    const thumbsDownBtn = document.querySelector('.vote-btn.thumbs-down');
    const favoriteBtn = document.querySelector('.vote-btn.favorite');
    
    if (!currentUser) {
        // User not logged in
        thumbsUpBtn.disabled = true;
        thumbsDownBtn.disabled = true;
        favoriteBtn.disabled = true;
        
        [thumbsUpBtn, thumbsDownBtn, favoriteBtn].forEach(btn => {
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        });
        return;
    }
    
    // User is logged in, check if they've voted
    if (currentUser.votes && currentUser.votes.thumbsUp) {
        thumbsUpBtn.disabled = true;
        thumbsUpBtn.style.opacity = '0.6';
        thumbsUpBtn.style.cursor = 'not-allowed';
    }
    
    if (currentUser.votes && currentUser.votes.thumbsDown) {
        thumbsDownBtn.disabled = true;
        thumbsDownBtn.style.opacity = '0.6';
        thumbsDownBtn.style.cursor = 'not-allowed';
    }
    
    if (currentUser.votes && currentUser.votes.favorite) {
        favoriteBtn.disabled = true;
        favoriteBtn.style.opacity = '0.6';
        favoriteBtn.style.cursor = 'not-allowed';
    }
}

// Handle voting
function vote(type) {
    if (!currentUser) {
        alert('Please login to vote!');
        navigateTo('#Login');
        return;
    }
    
    // Check if user has already voted for this type
    if (currentUser.votes && currentUser.votes[type]) {
        alert(`You can only ${type === 'thumbsUp' ? 'like' : type === 'thumbsDown' ? 'dislike' : 'favorite'} once per account!`);
        return;
    }
    
    // Update vote count
    voteCounts[type]++;
    
    // Mark user as having voted for this type
    if (!currentUser.votes) {
        currentUser.votes = {};
    }
    currentUser.votes[type] = true;
    
    updateVoteDisplays();
    updateVoteButtonStates();
    updateProfileStats();
    saveAppData();
    activateAd();
    
    // Visual feedback
    const button = event.currentTarget;
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// Authentication Functions
function handleEmailLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate email login
    const user = {
        id: 'email_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        avatar: DEFAULT_AVATAR,
        provider: 'email',
        votes: {},
        memberSince: new Date().toLocaleDateString(),
        password: password // In real app, this should be hashed
    };
    
    handleUserLogin(user);
}

function handleEmailSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Simple validation
    if (!username || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Simulate email signup
    const user = {
        id: 'email_' + Math.random().toString(36).substr(2, 9),
        name: username,
        email: email,
        avatar: DEFAULT_AVATAR,
        provider: 'email',
        votes: {},
        memberSince: new Date().toLocaleDateString(),
        password: password // In real app, this should be hashed
    };
    
    handleUserLogin(user);
}

function handleUserLogin(user) {
    currentUser = user;
    updateAuthUI();
    updateProfileUI();
    saveAppData();
    
    // Show welcome message
    showNotification(`Welcome, ${user.name}!`);
    
    // Refresh page to update UI
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

function logout() {
    currentUser = null;
    updateAuthUI();
    saveAppData();
    showNotification('Logged out successfully');
    
    // Refresh page to update UI
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    
    if (currentUser) {
        // User is logged in - show profile
        authSection.innerHTML = `
            <div class="user-profile" onclick="toggleProfileDropdown()">
                <img src="${currentUser.avatar}" alt="${currentUser.name}" class="user-avatar">
                <span class="user-name">${currentUser.name}</span>
            </div>
        `;
    } else {
        // User is not logged in
        authSection.innerHTML = `
            <button id="authButton" class="nav-btn auth" onclick="navigateTo('#Login')">Login</button>
        `;
    }
    
    updateVoteButtonStates();
}

function updateProfileUI() {
    if (!currentUser) return;
    
    // Update profile section
    document.getElementById('profileUsername').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileAvatar').src = currentUser.avatar;
    
    // Update settings section
    document.getElementById('settingsUsername').textContent = currentUser.name;
    document.getElementById('settingsEmail').textContent = currentUser.email;
    document.getElementById('settingsMemberSince').textContent = currentUser.memberSince;
    
    // Update profile stats
    updateProfileStats();
}

function updateProfileStats() {
    if (!currentUser) return;
    
    const likesCount = (currentUser.votes && currentUser.votes.thumbsUp) ? 1 : 0;
    const favoritesCount = (currentUser.votes && currentUser.votes.favorite) ? 1 : 0;
    
    document.getElementById('likesCount').textContent = likesCount;
    document.getElementById('favoritesCount').textContent = favoritesCount;
    document.getElementById('memberSince').textContent = currentUser.memberSince;
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const profile = document.querySelector('.user-profile');
    
    if (!profile.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Update user avatar
        currentUser.avatar = e.target.result;
        updateAuthUI();
        updateProfileUI();
        saveAppData();
        showNotification('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
}

function handlePasswordChange(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (currentPassword !== currentUser.password) {
        alert('Current password is incorrect');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    // Update password
    currentUser.password = newPassword;
    saveAppData();
    
    // Reset form
    event.target.reset();
    
    showNotification('Password updated successfully!');
}

function showDeleteConfirmation() {
    document.getElementById('deleteModal').style.display = 'block';
}

function hideDeleteConfirmation() {
    document.getElementById('deleteModal').style.display = 'none';
}

function deleteAccount() {
    // Delete user account
    currentUser = null;
    localStorage.removeItem('lemonHubUser');
    updateAuthUI();
    hideDeleteConfirmation();
    showNotification('Account deleted successfully');
    
    // Redirect to home
    setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname;
    }, 1000);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 215, 0, 0.9);
        color: #1a1a1a;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1001;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// URL Routing System with Hash
function navigateTo(hash) {
    // Update URL hash without page reload
    window.location.hash = hash;
    
    // Show the selected section
    showSection(hash);
    
    // Close profile dropdown
    document.getElementById('profileDropdown').classList.remove('show');
    
    // Activate ad
    activateAd();
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
        document.querySelector('.nav-btn[onclick="navigateTo(\'#Home\')"]').classList.add('active');
    } else if (hash === '#Script') {
        sectionId = 'script-section';
        document.querySelector('.nav-btn[onclick="navigateTo(\'#Script\')"]').classList.add('active');
    } else if (hash === '#Profile') {
        sectionId = 'profile-section';
    } else if (hash === '#Settings') {
        sectionId = 'settings-section';
    } else if (hash === '#Login') {
        showLoginModal();
        return;
    } else if (hash === '#Signup') {
        showSignupModal();
        return;
    }
    
    // Show selected section
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function showSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function hideModals() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupModal').style.display = 'none';
    document.getElementById('deleteModal').style.display = 'none';
}

// Handle browser back/forward buttons and hash changes
window.addEventListener('hashchange', function() {
    showSection(window.location.hash);
});

// Handle initial page load
window.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash || '#Home';
    showSection(hash);
    
    // Load app data
    loadAppData();
    
    // Initialize other functionality
    initializePage();
    
    // Setup modal event listeners
    setupModalEvents();
});

function setupModalEvents() {
    // Close modals when clicking X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', hideModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            hideModals();
        }
    });
    
    // Form submissions
    document.getElementById('emailLoginForm').addEventListener('submit', handleEmailLogin);
    document.getElementById('emailSignupForm').addEventListener('submit', handleEmailSignup);
    document.getElementById('changePasswordForm').addEventListener('submit', handlePasswordChange);
}

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

function activateAd() {
    if (!adLoaded) {
        // Load RevenueCPM ad script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//pl27744551.revenuecpmgate.com/bb/8c/2d/bb8c2d6e31450dd77b72750cfb7d1804.js';
        document.getElementById('ad-container').appendChild(script);
        adLoaded = true;
    }
    
    // Load second ad script below the script code
    if (!secondAdLoaded) {
        const secondScript = document.createElement('script');
        secondScript.type = 'text/javascript';
        secondScript.src = '//pl27744551.revenuecpmgate.com/bb/8c/2d/bb8c2d6e31450dd77b72750cfb7d1804.js';
        document.getElementById('script-code').insertAdjacentElement('afterend', secondScript);
        secondAdLoaded = true;
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

function initializePage() {
    // Make sure all interactive elements can contain ripples
    const interactiveElements = [
        '.nav-btn', '.copy-btn', '.accept-invite-btn', 
        '.executor-item', '.legend-item', '.feature-card',
        '.script-box', '.invitation-card', '.hero',
        '.vote-btn', '.game-link-btn', '.auth-btn',
        '.profile-action-btn', '.change-avatar-btn',
        '.settings-save-btn', '.danger-btn', '.modal-btn',
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
            this.offsetHeight;
            this.style.animation = this.classList.contains('lemon-float') ? 'floatLemon 2s ease-in-out' : 'float 2s ease-in-out';
        });
    });
}

// Add the CSS animation for universal ripple and notifications
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
@keyframes universalRipple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
    100% {
        transform: scale(3);
        opacity: 0;
    }
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(additionalStyles);
