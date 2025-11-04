// ===== PRODUCT PAGE SCRIPTS =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== IMAGE GALLERY =====
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Change main image
            const newImageSrc = this.querySelector('img').src;
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = newImageSrc;
                mainImage.style.opacity = '1';
            }, 200);
        });
    });

    // ===== COLOR SELECTION =====
    const colorButtons = document.querySelectorAll('.color-btn');
    const selectedColorText = document.getElementById('selectedColor');
    
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all color buttons
            colorButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected color text
            const colorName = this.getAttribute('data-color');
            if (selectedColorText) {
                selectedColorText.textContent = colorName;
            }
            
            // Animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // ===== SIZE SELECTION =====
    const sizeButtons = document.querySelectorAll('.size-btn');
    const selectedSizeText = document.getElementById('selectedSize');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Check if size is disabled
            if (this.classList.contains('disabled')) {
                showNotification('This size is out of stock', 'error');
                return;
            }
            
            // Remove active class from all size buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected size text
            const sizeName = this.getAttribute('data-size');
            if (selectedSizeText) {
                selectedSizeText.textContent = sizeName;
            }
            
            // Animation
            this.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                this.style.transform = 'translateY(0)';
            }, 200);
        });
    });

    // ===== QUANTITY SELECTOR =====
    const qtyInput = document.getElementById('quantityInput');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    
    if (qtyMinus) {
        qtyMinus.addEventListener('click', function() {
            let currentValue = parseInt(qtyInput.value) || 1;
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
                animateQuantityChange();
            }
        });
    }
    
    if (qtyPlus) {
        qtyPlus.addEventListener('click', function() {
            let currentValue = parseInt(qtyInput.value) || 1;
            const maxValue = parseInt(qtyInput.getAttribute('max')) || 10;
            if (currentValue < maxValue) {
                qtyInput.value = currentValue + 1;
                animateQuantityChange();
            } else {
                showNotification('Maximum quantity reached', 'info');
            }
        });
    }
    
    // Validate quantity input
    if (qtyInput) {
        qtyInput.addEventListener('change', function() {
            let value = parseInt(this.value) || 1;
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = parseInt(this.getAttribute('max')) || 10;
            
            if (value < min) value = min;
            if (value > max) value = max;
            
            this.value = value;
        });
    }
    
    function animateQuantityChange() {
        qtyInput.style.transform = 'scale(1.1)';
        setTimeout(() => {
            qtyInput.style.transform = 'scale(1)';
        }, 150);
    }

    // ===== ADD TO CART =====
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Get selected options
            const selectedColor = document.querySelector('.color-btn.active');
            const selectedSize = document.querySelector('.size-btn.active');
            const quantity = qtyInput.value;
            
            // Validate selections
            if (!selectedColor) {
                showNotification('Please select a color', 'error');
                return;
            }
            
            if (!selectedSize) {
                showNotification('Please select a size', 'error');
                return;
            }
            
            // Disable button
            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Adding...';
            
            // Simulate add to cart (replace with actual API call)
            setTimeout(() => {
                // Success
                this.innerHTML = '<i class="fas fa-check me-2"></i> Added to Cart!';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                
                // Update cart badge
                updateCartBadge();
                
                // Show notification
                showNotification('Product added to cart successfully!', 'success');
                
                // Reset button
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('btn-success');
                    this.classList.add('btn-primary');
                    this.disabled = false;
                }, 2000);
            }, 1000);
        });
    }

    // ===== WISHLIST BUTTON =====
    const wishlistBtn = document.querySelector('.btn-wishlist');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Add to wishlist
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
                showNotification('Added to wishlist!', 'success');
            } else {
                // Remove from wishlist
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
                showNotification('Removed from wishlist', 'info');
            }
            
            // Animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // ===== BUY NOW BUTTON =====
    const buyNowBtn = document.querySelector('.btn-buy-now');
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            // Get selected options
            const selectedColor = document.querySelector('.color-btn.active');
            const selectedSize = document.querySelector('.size-btn.active');
            
            // Validate selections
            if (!selectedColor || !selectedSize) {
                showNotification('Please select color and size', 'error');
                return;
            }
            
            // Redirect to checkout (replace with actual logic)
            showNotification('Redirecting to checkout...', 'success');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 1000);
        });
    }

    // ===== TAB SMOOTH SCROLL =====
    const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(() => {
                const target = document.querySelector(this.getAttribute('data-bs-target'));
                if (target) {
                    const offset = 100;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        });
    });

    // ===== REVIEW RATING INPUT =====
    const starRatingInputs = document.querySelectorAll('.star-rating-input i');
    
    starRatingInputs.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            // Remove active class from all stars
            starRatingInputs.forEach(s => {
                s.classList.remove('fas', 'active');
                s.classList.add('far');
            });
            
            // Add active class to selected stars
            for (let i = 0; i < rating; i++) {
                starRatingInputs[i].classList.remove('far');
                starRatingInputs[i].classList.add('fas', 'active');
            }
        });
        
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            for (let i = 0; i < rating; i++) {
                starRatingInputs[i].classList.remove('far');
                starRatingInputs[i].classList.add('fas');
            }
        });
    });
    
    // Reset stars on mouse leave
    const starRatingContainer = document.querySelector('.star-rating-input');
    if (starRatingContainer) {
        starRatingContainer.addEventListener('mouseleave', function() {
            starRatingInputs.forEach(star => {
                if (!star.classList.contains('active')) {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        });
    }

    // ===== REVIEW FORM SUBMISSION =====
    const reviewForm = document.getElementById('reviewForm');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get rating
            const activeStars = document.querySelectorAll('.star-rating-input i.active');
            if (activeStars.length === 0) {
                showNotification('Please select a rating', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Submitting...';
            
            // Simulate submission
            setTimeout(() => {
                showNotification('Review submitted successfully! It will be published after moderation.', 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Reset form
                reviewForm.reset();
                starRatingInputs.forEach(star => {
                    star.classList.remove('fas', 'active');
                    star.classList.add('far');
                });
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    // ===== COPY LINK BUTTON =====
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const linkInput = this.parentElement.querySelector('input');
            
            // Select and copy
            linkInput.select();
            document.execCommand('copy');
            
            // Show feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
            
            showNotification('Link copied to clipboard!', 'success');
        });
    }

    // ===== REVIEW HELPFUL BUTTON =====
    const reviewActionBtns = document.querySelectorAll('.review-action-btn');
    
    reviewActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.querySelector('.fa-thumbs-up')) {
                // Get current count
                const text = this.textContent;
                const match = text.match(/\((\d+)\)/);
                if (match) {
                    const currentCount = parseInt(match[1]);
                    const newCount = currentCount + 1;
                    this.innerHTML = `<i class="fas fa-thumbs-up me-1"></i> Helpful (${newCount})`;
                    
                    // Change icon to solid
                    const icon = this.querySelector('i');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    
                    // Disable button
                    this.style.opacity = '0.6';
                    this.style.cursor = 'default';
                    this.disabled = true;
                    
                    showNotification('Thank you for your feedback!', 'success');
                }
            }
        });
    });

    // ===== IMAGE ZOOM ON HOVER =====
    if (mainImage) {
        let isZoomed = false;
        
        mainImage.addEventListener('click', function() {
            if (!isZoomed) {
                this.style.transform = 'scale(1.5)';
                this.style.cursor = 'zoom-out';
                isZoomed = true;
            } else {
                this.style.transform = 'scale(1)';
                this.style.cursor = 'zoom-in';
                isZoomed = false;
            }
        });
    }

    // ===== RELATED PRODUCTS ADD TO CART =====
    const relatedAddToCartBtns = document.querySelectorAll('.related-products-section .add-to-cart');
    
    relatedAddToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check me-1"></i> Added!';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            this.disabled = true;
            
            updateCartBadge();
            showNotification('Product added to cart!', 'success');
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('btn-success');
                this.classList.add('btn-primary');
                this.disabled = false;
            }, 2000);
        });
    });

    // ===== STICKY ADD TO CART BAR (MOBILE) =====
    const productInfoWrapper = document.querySelector('.product-info-wrapper');
    const stickyCartBar = createStickyCartBar();
    
    if (productInfoWrapper && window.innerWidth <= 991) {
        document.body.appendChild(stickyCartBar);
        
        window.addEventListener('scroll', function() {
            const rect = productInfoWrapper.getBoundingClientRect();
            
            if (rect.bottom < 0) {
                stickyCartBar.classList.add('show');
            } else {
                stickyCartBar.classList.remove('show');
            }
        });
    }
    
    function createStickyCartBar() {
        const bar = document.createElement('div');
        bar.className = 'sticky-cart-bar';
        bar.innerHTML = `
            <div class="container">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="product-mini-info">
                        <img src="${mainImage ? mainImage.src : ''}" alt="Product">
                        <div>
                            <h6>Premium Cotton T-Shirt</h6>
                            <span class="price">$49.99</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="document.getElementById('addToCartBtn').click()">
                        <i class="fas fa-shopping-bag me-1"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .sticky-cart-bar {
                position: fixed;
                bottom: -100px;
                left: 0;
                right: 0;
                background: white;
                box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
                padding: 1rem 0;
                z-index: 999;
                transition: bottom 0.3s ease;
            }
            
            .sticky-cart-bar.show {
                bottom: 0;
            }
            
            .product-mini-info {
                display: flex;
                align-items: center;
                gap: 0.8rem;
            }
            
            .product-mini-info img {
                width: 50px;
                height: 50px;
                object-fit: cover;
                border-radius: 8px;
            }
            
            .product-mini-info h6 {
                font-size: 14px;
                margin: 0;
                font-weight: 600;
            }
            
            .product-mini-info .price {
                font-size: 16px;
                font-weight: 700;
                color: var(--color-primary);
            }
        `;
        document.head.appendChild(style);
        
        return bar;
    }

    // ===== SHARE BUTTONS =====
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productUrl = window.location.href;
            const productTitle = document.querySelector('.product-detail-title').textContent;
            
            let shareUrl = '';
            
            if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
            } else if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`;
            } else if (this.classList.contains('pinterest')) {
                const imageUrl = mainImage.src;
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(productTitle)}`;
            } else if (this.classList.contains('whatsapp')) {
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(productTitle + ' ' + productUrl)}`;
            } else if (this.classList.contains('email')) {
                shareUrl = `mailto:?subject=${encodeURIComponent(productTitle)}&body=${encodeURIComponent('Check out this product: ' + productUrl)}`;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // ===== PRODUCT TAB ANIMATION =====
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabPanes.forEach(pane => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(pane);
    });

});

// ===== UPDATE CART BADGE =====
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + 1;
        
        // Pulse animation
        cartBadge.style.animation = 'none';
        setTimeout(() => {
            cartBadge.style.animation = 'pulse 0.5s ease';
        }, 10);
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const bgColor = type === 'success' ? '#10B981' : 
                    type === 'error' ? '#FF6B6B' : 
                    type === 'info' ? '#3B82F6' : '#FFA500';
    
    notification.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'info' ? 'fa-info-circle' : 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: auto; font-size: 16px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== INITIALIZE TOOLTIPS =====
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
if (tooltipTriggerList.length > 0 && typeof bootstrap !== 'undefined') {
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

console.log('Product Page - Scripts Loaded Successfully ✨');

// ===== END OF PRODUCT SCRIPTS =====