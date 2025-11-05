// ===== STICKY NAVBAR ON SCROLL =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ADD TO CART FUNCTIONALITY =====
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get product info
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        
        // Show success notification
        showNotification('Added to Cart!', `${productName} has been added to your cart.`, 'success');
        
        // Update cart badge
        updateCartBadge();
        
        // Add animation to button
        this.innerHTML = '<i class="fas fa-check me-1"></i> Added!';
        this.classList.add('btn-success');
        this.classList.remove('btn-primary');
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-shopping-bag me-1"></i> Add to Cart';
            this.classList.remove('btn-success');
            this.classList.add('btn-primary');
        }, 2000);
    });
});

// ===== UPDATE CART BADGE =====
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
        
        // Add animation
        cartBadge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 300);
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(title, message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        </div>
        <div class="notification-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== BOOTSTRAP CAROUSEL INITIALIZATION =====
const heroCarousel = document.getElementById('heroCarousel');
if (heroCarousel) {
    new bootstrap.Carousel(heroCarousel, {
        interval: 5000,
        wrap: true,
        keyboard: true
    });
}

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchQuery = this.value.trim();
            if (searchQuery) {
                window.location.href = `search-results.html?q=${encodeURIComponent(searchQuery)}`;
            }
        }
    });
    
    // Search icon click
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                window.location.href = `search-results.html?q=${encodeURIComponent(searchQuery)}`;
            }
        });
    }
}

// ===== WISHLIST FUNCTIONALITY =====
function toggleWishlist(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.color = '#FF6B6B';
        showNotification('Added to Wishlist', 'Product has been added to your wishlist.', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.style.color = '';
        showNotification('Removed from Wishlist', 'Product has been removed from your wishlist.', 'info');
    }
}

// ===== MOBILE MENU TOGGLE =====
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.style.animation = 'slideUp 0.3s ease';
        } else {
            navbarCollapse.style.animation = 'slideDown 0.3s ease';
        }
    });
}

// ===== NEWSLETTER FORM =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email && validateEmail(email)) {
            showNotification('Subscribed!', 'Thank you for subscribing to our newsletter.', 'success');
            emailInput.value = '';
        } else {
            showNotification('Invalid Email', 'Please enter a valid email address.', 'error');
        }
    });
}

// ===== EMAIL VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== QUANTITY CONTROLS =====
function updateQuantity(button, action) {
    const quantityInput = button.parentElement.querySelector('.quantity-input');
    let currentValue = parseInt(quantityInput.value) || 1;
    
    if (action === 'increase') {
        currentValue++;
    } else if (action === 'decrease' && currentValue > 1) {
        currentValue--;
    }
    
    quantityInput.value = currentValue;
}

// ===== ADD NOTIFICATION STYLES DYNAMICALLY =====
const style = document.createElement('style');
style.textContent = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .notification {
        background: white;
        border-radius: 12px;
        padding: 1rem 1.2rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-icon {
        font-size: 24px;
        flex-shrink: 0;
    }
    
    .notification-success .notification-icon {
        color: #10B981;
    }
    
    .notification-error .notification-icon {
        color: #EF4444;
    }
    
    .notification-info .notification-icon {
        color: #3B82F6;
    }
    
    .notification-content {
        flex-grow: 1;
    }
    
    .notification-content strong {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #2C3E50;
        margin-bottom: 0.2rem;
    }
    
    .notification-content p {
        margin: 0;
        font-size: 12px;
        color: #718096;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #718096;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: #F3F4F6;
    }
    
    @media (max-width: 768px) {
        .notification-container {
            right: 10px;
            left: 10px;
        }
        
        .notification {
            min-width: auto;
            max-width: 100%;
        }
    }
`;
document.head.appendChild(style);

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== SCROLL TO TOP BUTTON =====
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 45px;
        height: 45px;
        background: linear-gradient(135deg, #9370DB 0%, #DDA0DD 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(147, 112, 219, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px)';
        scrollBtn.style.boxShadow = '0 6px 16px rgba(147, 112, 219, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0)';
        scrollBtn.style.boxShadow = '0 4px 12px rgba(147, 112, 219, 0.3)';
    });
}

// Initialize scroll to top button
addScrollToTop();

// ===== INITIALIZE TOOLTIPS =====
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
if (tooltipTriggerList.length > 0) {
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('ElegantShop - Frontend Loaded Successfully ✨');

// ===== END OF MAIN SCRIPTS =====

// ===== SHOP PAGE SCRIPTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Filter Toggle (Mobile)
    const filterToggle = document.getElementById('filterToggle');
    const shopSidebar = document.getElementById('shopSidebar');
    const filterOverlay = document.createElement('div');
    filterOverlay.className = 'filter-overlay';
    document.body.appendChild(filterOverlay);

    if (filterToggle && shopSidebar) {
        filterToggle.addEventListener('click', function() {
            shopSidebar.classList.toggle('show');
            filterOverlay.classList.toggle('show');
        });

        filterOverlay.addEventListener('click', function() {
            shopSidebar.classList.remove('show');
            filterOverlay.classList.remove('show');
        });
    }

    // View Switcher
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });

    // Color Options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.color-options');
            parent.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Size Options
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.size-options');
            parent.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filter Badge Close
    const filterCloseButtons = document.querySelectorAll('.btn-close-filter');
    filterCloseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.filter-badge').remove();
        });
    });

    // Price Range Display
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        const priceInputs = document.querySelectorAll('.price-inputs input');
        priceRange.addEventListener('input', function() {
            if (priceInputs[1]) {
                priceInputs[1].value = this.value;
            }
        });
    }

    // Add to Cart Animation
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            this.appendChild(ripple);
            
            // Button text animation
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check me-1"></i> Added!';
            this.classList.add('btn-success');
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('btn-success');
                ripple.remove();
            }, 1500);
            
            // Update cart badge
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                let currentCount = parseInt(cartBadge.textContent);
                cartBadge.textContent = currentCount + 1;
                cartBadge.classList.add('pulse-animation');
                setTimeout(() => {
                    cartBadge.classList.remove('pulse-animation');
                }, 1000);
            }
        });
    });

    // Wishlist Toggle
    const wishlistButtons = document.querySelectorAll('.product-overlay .btn-light:last-child');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#FF6B6B';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    });

    // Smooth Scroll for Pagination
    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
});

// ===== END OF SHOP SCRIPTS =====