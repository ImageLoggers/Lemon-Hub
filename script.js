// Complete the missing functions from script.js

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

function addRipple(event) {
    addEnhancedRipple(event.currentTarget, event);
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
        '.crop-btn', '.resend-btn',
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
    
    // Initialize zoom slider for avatar cropping
    const zoomSlider = document.getElementById('zoomSlider');
    if (zoomSlider) {
        zoomSlider.addEventListener('input', function(e) {
            const scale = e.target.value;
            const cropImage = document.getElementById('cropImage');
            if (cropImage) {
                cropImage.style.transform = `scale(${scale})`;
            }
        });
    }
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

/* Additional styles for the new elements */
.auth-links {
    text-align: center;
    margin-top: 1rem;
}

.forgot-password {
    color: #ffd700;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
}

.forgot-password:hover {
    text-decoration: underline;
}

.verification-actions {
    text-align: center;
    margin-top: 1.5rem;
}

.resend-btn {
    background: transparent;
    color: #ffd700;
    border: 1px solid rgba(255, 215, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.resend-btn:hover:not(:disabled) {
    background: rgba(255, 215, 0, 0.1);
}

.resend-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.timer {
    color: #cccccc;
    font-size: 0.8rem;
    margin-top: 0.5rem;
}

.crop-modal {
    max-width: 500px;
}

.crop-container {
    margin: 1rem 0;
}

.crop-area {
    width: 100%;
    height: 300px;
    background: #1a1a1a;
    border: 2px dashed rgba(255, 215, 0, 0.3);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;
}

#cropImage {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: 0 auto;
    transition: transform 0.3s ease;
}

.crop-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

#zoomSlider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    -webkit-appearance: none;
}

#zoomSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffd700;
    cursor: pointer;
}

#zoomSlider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffd700;
    cursor: pointer;
    border: none;
}

.crop-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.crop-btn {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.crop-btn.primary {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
}

.crop-btn.primary:hover {
    background: linear-gradient(45deg, #45a049, #3d8b40);
    transform: translateY(-1px);
}

.crop-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.crop-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
}

.retrieve-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 215, 0, 0.1);
    backdrop-filter: blur(10px);
    text-align: center;
}

.retrieve-header {
    margin-bottom: 2rem;
}

.retrieve-header h1 {
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-size: 2rem;
}

.retrieve-header p {
    color: #cccccc;
}

/* Profile dropdown positioning fix */
.profile-dropdown {
    position: absolute;
    top: 100%;
    right: 2rem;
    margin-top: 0.5rem;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    padding: 0.5rem;
    min-width: 200px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 215, 0, 0.3);
    z-index: 1000;
    display: none;
    animation: dropdownFade 0.2s ease-out;
}

.profile-dropdown.show {
    display: block;
}

@keyframes dropdownFade {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Enhanced user profile in navbar */
.user-profile {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 215, 0, 0.3);
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
}

.user-profile:hover {
    background: rgba(255, 215, 0, 0.2);
    transform: translateY(-1px);
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ffd700;
}

.user-name {
    color: #ffd700;
    font-weight: 600;
    font-size: 0.9rem;
}

/* Enhanced modal styles */
.modal-content {
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
    margin: 5% auto;
    padding: 2rem;
    border-radius: 15px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    border: 1px solid rgba(255, 215, 0, 0.3);
    position: relative;
    animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
    from { 
        opacity: 0; 
        transform: translateY(-50px) scale(0.9); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
    }
}

/* Enhanced form styles */
.auth-form input:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
    transform: translateY(-1px);
}

/* Enhanced button animations */
.nav-btn, .auth-btn, .vote-btn, .copy-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-btn:hover, .auth-btn:hover, .vote-btn:hover, .copy-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

/* Loading states */
.loading {
    position: relative;
    pointer-events: none;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top: 2px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Success states */
.success {
    background: linear-gradient(45deg, #4CAF50, #45a049) !important;
}

/* Error states */
.error {
    border-color: #f44336 !important;
    background: rgba(244, 67, 54, 0.1) !important;
}

/* Responsive improvements */
@media (max-width: 768px) {
    .profile-dropdown {
        right: 1rem;
        min-width: 180px;
    }
    
    .crop-modal {
        max-width: 95%;
        margin: 2% auto;
    }
    
    .retrieve-container {
        margin: 1rem;
        padding: 1.5rem;
    }
    
    .modal-content {
        margin: 10% auto;
        padding: 1.5rem;
    }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
    .modal-content {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    }
    
    .auth-form input {
        background: rgba(255, 255, 255, 0.05);
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .nav-btn, .auth-btn, .vote-btn {
        border-width: 2px;
    }
    
    .profile-dropdown {
        border-width: 2px;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
`;
document.head.appendChild(additionalStyles);

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please try again.');
});

// Enhanced beforeunload handler
window.addEventListener('beforeunload', function() {
    // Save any pending data
    saveAppData();
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Enhanced session management
let sessionTimer;
function resetSessionTimer() {
    clearTimeout(sessionTimer);
    // Auto logout after 24 hours of inactivity
    sessionTimer = setTimeout(() => {
        if (currentUser) {
            logout();
            showNotification('Session expired due to inactivity');
        }
    }, 24 * 60 * 60 * 1000); // 24 hours
}

// Reset timer on user activity
['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, resetSessionTimer, { passive: true });
});

// Initialize session timer
resetSessionTimer();

// Enhanced password strength indicator
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
}

function updatePasswordStrength(password) {
    const strength = checkPasswordStrength(password);
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50'][strength];
    
    return { strength: strengthText, color: strengthColor };
}

// Enhanced email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced username validation
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validateUsername,
        checkPasswordStrength,
        updatePasswordStrength
    };
}

// Final initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lemon Hub initialized successfully');
    
    // Check for any pending redirects
    const hash = window.location.hash;
    if (hash.startsWith('#retrieve')) {
        // Auto-focus on password field for reset flow
        setTimeout(() => {
            const passwordField = document.getElementById('retrieveNewPassword');
            if (passwordField) passwordField.focus();
        }, 500);
    }
});

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
    });
});

perfObserver.observe({ entryTypes: ['measure', 'navigation'] });

// Memory management
function cleanupUnusedData() {
    // Clean up expired tokens and verifications
    const now = Date.now();
    
    Object.keys(pendingVerifications).forEach(email => {
        if (now > pendingVerifications[email].expires) {
            delete pendingVerifications[email];
        }
    });
    
    Object.keys(resetTokens).forEach(token => {
        if (now > resetTokens[token].expires) {
            delete resetTokens[token];
        }
    });
    
    saveAppData();
}

// Run cleanup every hour
setInterval(cleanupUnusedData, 3600000);

// Initial cleanup
cleanupUnusedData();
