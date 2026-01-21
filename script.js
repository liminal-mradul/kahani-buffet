// Page order for navigation
const pageOrder = ['home', 'overview', 'projects', 'partners', 'contact'];
let currentPageIndex = 0;

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Page Navigation System
function showPage(pageId, direction = 'right') {
    const validPages = ['home', 'overview', 'projects', 'partners', 'contact'];
    if (!validPages.includes(pageId)) {
        console.warn('Invalid page:', pageId);
        return;
    }
    
    const currentActivePage = document.querySelector('.page.active');
    const targetPage = document.getElementById('page-' + pageId);
    
    if (!targetPage || targetPage === currentActivePage) {
        return;
    }
    
    // Remove all animation classes first
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('sliding-out-left', 'sliding-in-right', 'sliding-out-right', 'sliding-in-left');
    });
    
    // Add appropriate animation classes
    if (direction === 'right') {
        if (currentActivePage) {
            currentActivePage.classList.add('sliding-out-left');
        }
        targetPage.classList.add('sliding-in-right');
    } else {
        if (currentActivePage) {
            currentActivePage.classList.add('sliding-out-right');
        }
        targetPage.classList.add('sliding-in-left');
    }
    
    // Show target page
    targetPage.style.display = 'block';
    targetPage.classList.add('active');
    
    // Hide current page after animation
    setTimeout(() => {
        if (currentActivePage) {
            currentActivePage.classList.remove('active');
            currentActivePage.style.display = 'none';
            currentActivePage.classList.remove('sliding-out-left', 'sliding-out-right');
        }
        targetPage.classList.remove('sliding-in-right', 'sliding-in-left');
    }, 600);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Update current page index
    currentPageIndex = pageOrder.indexOf(pageId);
    updateNavigationArrows();
    
    // Close mobile menu
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    if (hamburger) {
        hamburger.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Mobile Navigation Arrows
const prevPageBtn = document.querySelector('.prev-page');
const nextPageBtn = document.querySelector('.next-page');

function updateNavigationArrows() {
    if (prevPageBtn && nextPageBtn) {
        prevPageBtn.disabled = currentPageIndex === 0;
        nextPageBtn.disabled = currentPageIndex === pageOrder.length - 1;
    }
}

if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            showPage(pageOrder[currentPageIndex - 1], 'left');
        }
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
        if (currentPageIndex < pageOrder.length - 1) {
            showPage(pageOrder[currentPageIndex + 1], 'right');
        }
    });
}

// Copy Phone Number Functionality
function copyPhoneNumber(phoneNumber) {
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cleanPhone).then(() => {
            showCopyNotification('Phone number copied!');
        }).catch(() => {
            fallbackCopy(cleanPhone);
        });
    } else {
        fallbackCopy(cleanPhone);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyNotification('Phone number copied!');
    } catch (err) {
        showCopyNotification('Failed to copy');
    }
    document.body.removeChild(textArea);
}

function showCopyNotification(message) {
    const existing = document.querySelector('.copy-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Initialize page navigation
document.addEventListener('DOMContentLoaded', () => {
    // Set up navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            const targetIndex = pageOrder.indexOf(pageId);
            const direction = targetIndex > currentPageIndex ? 'right' : 'left';
            if (pageId) {
                showPage(pageId, direction);
            }
        });
    });
    
    // Copy phone number button
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const phoneElement = copyBtn.closest('.phone-number');
            if (phoneElement) {
                const phone = phoneElement.getAttribute('data-phone') || phoneElement.textContent.trim();
                copyPhoneNumber(phone);
            }
        });
    }
    
    // Show home page by default
    showPage('home');
    updateNavigationArrows();
    
    // Add touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0 && currentPageIndex < pageOrder.length - 1) {
                // Swipe left - go to next page
                showPage(pageOrder[currentPageIndex + 1], 'right');
            } else if (difference < 0 && currentPageIndex > 0) {
                // Swipe right - go to previous page
                showPage(pageOrder[currentPageIndex - 1], 'left');
            }
        }
    }
});
