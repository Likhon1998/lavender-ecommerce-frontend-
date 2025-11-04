// ===== GLOBAL SCRIPTS =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== STICKY NAVBAR =====
    const navbar = document.querySelector('.navbar');
    const headerTop = document.querySelector('.header-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            if (headerTop) {
                headerTop.style.transform = 'translateY(-100%)';
            }
        } else {
            navbar.classList.remove('scrolled');
            if (headerTop) {
                headerTop.style.transform = 'translateY(0)';
            }
        }
    });

    // ===== SCROLL TO TOP BUTTON =====
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== BOOTSTRAP CAROUSEL INITIALIZATION =====
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            wrap: true,
            keyboard: true
        });
    }

    // ===== MOBILE MENU TOGGLE =====
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navbar.contains(event.target);
            if (!isClickInside && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    }

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    // Redirect to search results page
                    window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }

    // ===== CART BADGE ANIMATION =====
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        // Animate cart badge on page load
        setTimeout(() => {
            cartBadge.style.animation = 'pulse 0.5s ease';
        }, 500);
    }

    // ===== HEADER TOP TRANSITION =====
    if (headerTop) {
        headerTop.style.transition = 'transform 0.3s ease';
    }
});

// ===== SHOP PAGE SCRIPTS =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if we're on the shop page
    const shopSidebar = document.getElementById('shopSidebar');
    if (!shopSidebar) return; // Exit if not on shop page

    // ===== FILTER TOGGLE (MOBILE) =====
    const filterToggle = document.getElementById('filterToggle');
    const filterOverlay = document.createElement('div');
    filterOverlay.className = 'filter-overlay';
    document.body.appendChild(filterOverlay);

    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            shopSidebar.classList.toggle('show');
            filterOverlay.classList.toggle('show');
            document.body.style.overflow = shopSidebar.classList.contains('show') ? 'hidden' : '';
        });

        filterOverlay.addEventListener('click', function() {
            shopSidebar.classList.remove('show');
            filterOverlay.classList.remove('show');
            document.body.style.overflow = '';
        });

        // Close sidebar on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991) {
                shopSidebar.classList.remove('show');
                filterOverlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== VIEW SWITCHER (GRID/LIST) =====
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Switch view
            const view = this.getAttribute('data-view');
            if (view === 'list') {
                productsGrid.classList.add('list-view');
                // Save preference
                localStorage.setItem('shopView', 'list');
            } else {
                productsGrid.classList.remove('list-view');
                // Save preference
                localStorage.setItem('shopView', 'grid');
            }
        });
    });

    // Load saved view preference
    const savedView = localStorage.getItem('shopView');
    if (savedView === 'list') {
        productsGrid.classList.add('list-view');
        viewButtons.forEach(btn => {
            if (btn.getAttribute('data-view') === 'list') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // ===== COLOR OPTIONS =====
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.color-options');
            parent.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ===== SIZE OPTIONS =====
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.size-options');
            parent.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ===== FILTER BADGES (CLOSE BUTTON) =====
    const filterCloseButtons = document.querySelectorAll('.btn-close-filter');
    
    filterCloseButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.closest('.filter-badge').remove();
            
            // Check if there are any badges left
            const remainingBadges = document.querySelectorAll('.filter-badge').length;
            if (remainingBadges === 0) {
                document.querySelector('.active-filters').style.display = 'none';
            }
        });
    });

    // Clear All Filters
    const clearAllBtn = document.querySelector('.active-filters .btn-link');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.filter-badge').forEach(badge => badge.remove());
            document.querySelector('.active-filters').style.display = 'none';
            
            // Uncheck all checkboxes
            document.querySelectorAll('.filter-widget input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        });
    }

    // ===== PRICE RANGE SLIDER =====
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        const priceInputs = document.querySelectorAll('.price-inputs input');
        
        priceRange.addEventListener('input', function() {
            if (priceInputs[1]) {
                priceInputs[1].value = this.value;
            }
        });

        // Update slider when max input changes
        if (priceInputs[1]) {
            priceInputs[1].addEventListener('input', function() {
                priceRange.value = this.value;
            });
        }
    }

    // ===== CATEGORY FILTER =====
    const categoryCheckboxes = document.querySelectorAll('.category-item input[type="checkbox"]');
    
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Add visual feedback
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.fontWeight = '600';
                label.style.color = 'var(--color-primary)';
            } else {
                label.style.fontWeight = '400';
                label.style.color = '';
            }
        });
    });

    // ===== BRAND SEARCH =====
    const brandSearchInput = document.querySelector('.brand-search input');
    if (brandSearchInput) {
        brandSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const brandItems = document.querySelectorAll('.brand-list .form-check');
            
            brandItems.forEach(item => {
                const brandName = item.querySelector('label').textContent.toLowerCase();
                if (brandName.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // ===== SORTING =====
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            
            // Add sorting logic here
            // This would typically make an AJAX call to the server
            
            // Show loading state
            productsGrid.style.opacity = '0.5';
            setTimeout(() => {
                productsGrid.style.opacity = '1';
            }, 500);
        });
    }

    // ===== ADD TO CART FUNCTIONALITY =====
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Button animation
            const originalText = this.innerHTML;
            const originalClasses = this.className;
            
            this.innerHTML = '<i class="fas fa-check me-1"></i> Added!';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            this.disabled = true;
            
            // Update cart badge
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

            // Show notification (optional)
            showNotification('Product added to cart!', 'success');
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = originalText;
                this.className = originalClasses;
                this.disabled = false;
            }, 2000);
        });
    });

    // ===== WISHLIST TOGGLE =====
    const wishlistButtons = document.querySelectorAll('.product-overlay .btn:last-child, .quick-view-btn + .btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            
            if (icon) {
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#FF6B6B';
                    showNotification('Added to wishlist!', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    showNotification('Removed from wishlist!', 'info');
                }
            }
        });
    });

    // ===== QUICK VIEW MODAL =====
    const quickViewButtons = document.querySelectorAll('.quick-view-btn button');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product data (in real app, this would come from data attributes or API)
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Update modal content
            const modal = document.getElementById('quickViewModal');
            if (modal) {
                modal.querySelector('.modal-body h3').textContent = productTitle;
                modal.querySelector('.modal-body .price').textContent = productPrice;
                modal.querySelector('.modal-body img').src = productImage;
            }
        });
    });

    // ===== PAGINATION =====
    const pageLinks = document.querySelectorAll('.page-link');
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!this.parentElement.classList.contains('disabled') && 
                !this.parentElement.classList.contains('active')) {
                
                // Scroll to top smoothly
                window.scrollTo({
                    top: document.querySelector('.shop-section').offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active state
                document.querySelectorAll('.page-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.parentElement.classList.add('active');
                
                // Load new products (in real app)
                productsGrid.style.opacity = '0.5';
                setTimeout(() => {
                    productsGrid.style.opacity = '1';
                }, 500);
            }
        });
    });

    // ===== RESET FILTERS BUTTON =====
    const resetFiltersBtn = document.querySelector('.btn-outline-primary.w-100');
    if (resetFiltersBtn && resetFiltersBtn.textContent.includes('Reset')) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset all checkboxes
            document.querySelectorAll('.filter-widget input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset price range
            if (priceRange) {
                priceRange.value = 250;
                document.querySelectorAll('.price-inputs input')[1].value = 250;
            }
            
            // Reset color and size selections
            document.querySelectorAll('.color-option.active, .size-option.active').forEach(option => {
                option.classList.remove('active');
            });
            
            // Clear filter badges
            document.querySelectorAll('.filter-badge').forEach(badge => badge.remove());
            
            showNotification('All filters reset!', 'info');
        });
    }

    // ===== PRODUCT HOVER EFFECTS =====
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });

    // ===== FILTER WIDGET ACCORDION EFFECT =====
    const filterTitles = document.querySelectorAll('.filter-title');
    
    filterTitles.forEach(title => {
        title.style.cursor = 'pointer';
        
        title.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const widget = this.closest('.filter-widget');
            
            if (content && content.classList.contains('filter-content')) {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                widget.style.paddingBottom = content.style.display === 'none' ? '1rem' : '1.5rem';
            }
        });
    });
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#FF6B6B' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease forwards;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== ANIMATION KEYFRAMES (Add to CSS or create dynamically) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PERFORMANCE: DEBOUNCE FUNCTION =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.product-card, .feature-card, .filter-widget');

const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealOnScroll.observe(element);
});

// ===== END OF SCRIPTS =====