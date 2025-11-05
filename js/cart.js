// ===== CART PAGE SCRIPTS =====

// Cart data (in real app, this would come from backend/localStorage)
let cartData = {
    items: [
        { id: 1, name: 'Premium Cotton T-Shirt', price: 49.99, originalPrice: 69.99, quantity: 2, color: 'Black', size: 'M', image: 'https://picsum.photos/150/150?random=50' },
        { id: 2, name: 'Wireless Headphones', price: 149.99, originalPrice: null, quantity: 1, color: 'Black', size: null, image: 'https://picsum.photos/150/150?random=51' },
        { id: 3, name: 'Leather Handbag', price: 199.99, originalPrice: null, quantity: 1, color: 'Brown', size: null, image: 'https://picsum.photos/150/150?random=52' }
    ],
    coupon: null,
    shippingCost: 0,
    taxRate: 0.10
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    initializeQuantityInputs();
});

// ===== UPDATE QUANTITY =====
function updateQuantity(itemId, action) {
    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
    const qtyInput = cartItem.querySelector('.qty-input');
    let currentQty = parseInt(qtyInput.value);
    const maxQty = parseInt(qtyInput.getAttribute('max')) || 10;

    if (action === 'increase' && currentQty < maxQty) {
        currentQty++;
    } else if (action === 'decrease' && currentQty > 1) {
        currentQty--;
    } else if (action === 'increase' && currentQty >= maxQty) {
        showNotification('Maximum quantity reached', 'info');
        return;
    } else if (action === 'decrease' && currentQty <= 1) {
        return;
    }

    // Update input value
    qtyInput.value = currentQty;

    // Update quantity in cart data
    const item = cartData.items.find(i => i.id === itemId);
    if (item) {
        item.quantity = currentQty;
    }

    // Update item subtotal
    const price = parseFloat(qtyInput.getAttribute('data-price'));
    const subtotal = (price * currentQty).toFixed(2);
    cartItem.querySelector('.subtotal-amount').textContent = `$${subtotal}`;

    // Add animation
    qtyInput.style.transform = 'scale(1.2)';
    setTimeout(() => {
        qtyInput.style.transform = 'scale(1)';
    }, 200);

    // Update cart summary
    updateCartSummary();
    
    showNotification('Cart updated successfully', 'success');
}

// Initialize quantity inputs
function initializeQuantityInputs() {
    const qtyInputs = document.querySelectorAll('.qty-input');
    
    qtyInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value) || 1;
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = parseInt(this.getAttribute('max')) || 10;
            
            if (value < min) value = min;
            if (value > max) {
                value = max;
                showNotification('Maximum quantity reached', 'info');
            }
            
            this.value = value;
            
            // Update cart data
            const cartItem = this.closest('.cart-item');
            const itemId = parseInt(cartItem.getAttribute('data-item-id'));
            const item = cartData.items.find(i => i.id === itemId);
            
            if (item) {
                item.quantity = value;
            }
            
            // Update item subtotal
            const price = parseFloat(this.getAttribute('data-price'));
            const subtotal = (price * value).toFixed(2);
            cartItem.querySelector('.subtotal-amount').textContent = `$${subtotal}`;
            
            updateCartSummary();
        });
    });
}

// ===== REMOVE ITEM =====
function removeItem(itemId) {
    // Confirm removal
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
        return;
    }

    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
    
    // Add removing animation
    cartItem.classList.add('removing');
    
    setTimeout(() => {
        // Remove from DOM
        cartItem.remove();
        
        // Remove from cart data
        cartData.items = cartData.items.filter(item => item.id !== itemId);
        
        // Update cart
        updateCartDisplay();
        updateCartSummary();
        updateCartBadge();
        
        showNotification('Item removed from cart', 'success');
        
        // Check if cart is empty
        if (cartData.items.length === 0) {
            showEmptyCart();
        }
    }, 400);
}

// ===== MOVE TO WISHLIST =====
function moveToWishlist(itemId) {
    const item = cartData.items.find(i => i.id === itemId);
    
    if (item) {
        // In real app, this would save to wishlist in backend
        showNotification(`"${item.name}" moved to wishlist`, 'success');
        
        // Remove from cart
        removeItem(itemId);
    }
}

// ===== CLEAR CART =====
function clearCart() {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
        return;
    }
    
    const cartItems = document.querySelectorAll('.cart-item');
    
    cartItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('removing');
        }, index * 100);
    });
    
    setTimeout(() => {
        cartData.items = [];
        showEmptyCart();
        updateCartBadge();
        showNotification('Cart cleared successfully', 'success');
    }, cartItems.length * 100 + 400);
}

// ===== SHOW EMPTY CART =====
function showEmptyCart() {
    document.getElementById('cartContent').style.display = 'none';
    document.getElementById('emptyCartState').style.display = 'block';
    
    // Update cart badge
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = '0';
    }
}

// ===== UPDATE CART DISPLAY =====
function updateCartDisplay() {
    const itemCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
    
    if (itemCount === 0) {
        showEmptyCart();
    } else {
        document.getElementById('cartContent').style.display = 'block';
        document.getElementById('emptyCartState').style.display = 'none';
        
        // Update item count
        document.getElementById('itemCount').textContent = cartData.items.length;
        document.getElementById('summaryItemCount').textContent = itemCount;
    }
}

// ===== UPDATE CART SUMMARY =====
function updateCartSummary() {
    // Calculate subtotal
    let subtotal = 0;
    cartData.items.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // Calculate savings
    let savings = 0;
    cartData.items.forEach(item => {
        if (item.originalPrice) {
            savings += (item.originalPrice - item.price) * item.quantity;
        }
    });
    
    // Apply coupon discount
    let discount = 0;
    if (cartData.coupon) {
        if (cartData.coupon.type === 'percentage') {
            discount = (subtotal * cartData.coupon.value) / 100;
        } else if (cartData.coupon.type === 'fixed') {
            discount = cartData.coupon.value;
        }
    }
    
    // Calculate shipping
    const shipping = subtotal >= 50 ? 0 : 0; // Free shipping on orders over $50
    
    // Calculate tax
    const tax = (subtotal - discount) * cartData.taxRate;
    
    // Calculate total
    const total = subtotal - discount + shipping + tax;
    
    // Update summary display
    document.getElementById('summarySubtotal').textContent = `${subtotal.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = shipping === 0 ? 'FREE' : `${shipping.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `${tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `${total.toFixed(2)}`;
    
    // Update discount display
    const discountItem = document.getElementById('discountItem');
    if (discount > 0) {
        discountItem.style.display = 'flex';
        document.getElementById('summaryDiscount').textContent = `-${discount.toFixed(2)}`;
    } else {
        discountItem.style.display = 'none';
    }
    
    // Update savings display
    const totalSavings = savings + discount;
    const savingsElement = document.getElementById('summarySavings');
    if (totalSavings > 0) {
        savingsElement.style.display = 'block';
        savingsElement.querySelector('strong').textContent = `${totalSavings.toFixed(2)}`;
    } else {
        savingsElement.style.display = 'none';
    }
    
    // Update item count
    const itemCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('summaryItemCount').textContent = itemCount;
}

// ===== APPLY COUPON =====
function applyCoupon(event) {
    event.preventDefault();
    
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('Please enter a coupon code', 'error');
        return;
    }
    
    // Simulate coupon validation (in real app, this would be an API call)
    const validCoupons = {
        'SAVE10': { type: 'percentage', value: 10, name: 'SAVE10' },
        'SAVE20': { type: 'percentage', value: 20, name: 'SAVE20' },
        'FLAT50': { type: 'fixed', value: 50, name: 'FLAT50' }
    };
    
    if (validCoupons[couponCode]) {
        cartData.coupon = validCoupons[couponCode];
        
        // Show applied coupon
        document.getElementById('appliedCoupon').style.display = 'block';
        document.getElementById('couponName').textContent = couponCode;
        document.getElementById('couponCode').value = '';
        
        // Update summary
        updateCartSummary();
        
        showNotification('Coupon applied successfully!', 'success');
    } else {
        showNotification('Invalid coupon code', 'error');
    }
}

// ===== REMOVE COUPON =====
function removeCoupon() {
    cartData.coupon = null;
    document.getElementById('appliedCoupon').style.display = 'none';
    updateCartSummary();
    showNotification('Coupon removed', 'info');
}

// ===== PROCEED TO CHECKOUT =====
function proceedToCheckout() {
    if (cartData.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Show loading state
    const checkoutBtn = document.querySelector('.btn-checkout');
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    
    // Simulate processing
    setTimeout(() => {
        // In real app, this would save cart and redirect to checkout
        window.location.href = 'checkout.html';
    }, 1000);
}

// ===== UPDATE CART BADGE =====
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const itemCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = itemCount;
        
        // Pulse animation
        cartBadge.style.animation = 'none';
        setTimeout(() => {
            cartBadge.style.animation = 'pulse 0.5s ease';
        }, 10);
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const bgColor = type === 'success' ? '#10B981' : 
                    type === 'error' ? '#FF6B6B' : 
                    type === 'info' ? '#3B82F6' : '#FFA500';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
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
        z-index: 9999;
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
    
    document.body.appendChild(notification);
    
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

// ===== ADD TO CART (FOR RECOMMENDED PRODUCTS) =====
document.querySelectorAll('.recommended-section .add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        
        // Button animation
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check me-1"></i> Added!';
        this.classList.remove('btn-primary');
        this.classList.add('btn-success');
        this.disabled = true;
        
        // Update cart badge
        updateCartBadge();
        
        showNotification(`"${productName}" added to cart!`, 'success');
        
        // Reset button after delay
        setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-primary');
            this.disabled = false;
        }, 2000);
    });
});

// ===== SAVE CART TO LOCALSTORAGE (OPTIONAL) =====
function saveCartToStorage() {
    try {
        localStorage.setItem('elegantShopCart', JSON.stringify(cartData));
    } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
    }
}

// ===== LOAD CART FROM LOCALSTORAGE (OPTIONAL) =====
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('elegantShopCart');
        if (savedCart) {
            cartData = JSON.parse(savedCart);
            updateCartDisplay();
            updateCartSummary();
        }
    } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
    }
}

// ===== AUTO-SAVE CART ON CHANGES =====
// Uncomment to enable auto-save
// setInterval(saveCartToStorage, 5000); // Save every 5 seconds

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Press 'C' to go to checkout
    if (e.key === 'c' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        proceedToCheckout();
    }
    
    // Press 'Escape' to close notifications
    if (e.key === 'Escape') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
    }
});

// ===== STICKY SUMMARY ON SCROLL =====
window.addEventListener('scroll', function() {
    const summary = document.querySelector('.sticky-summary');
    if (summary && window.innerWidth > 991) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const footer = document.querySelector('.footer');
        const footerTop = footer.offsetTop;
        const summaryHeight = summary.offsetHeight;
        
        if (scrollTop + summaryHeight + 120 > footerTop) {
            summary.style.position = 'absolute';
            summary.style.top = (footerTop - summaryHeight - 120) + 'px';
        } else {
            summary.style.position = 'sticky';
            summary.style.top = '120px';
        }
    }
});

// ===== HANDLE BACK BUTTON =====
window.addEventListener('popstate', function() {
    // Save cart state when user navigates away
    saveCartToStorage();
});

// ===== PAGE VISIBILITY API (SAVE WHEN TAB BECOMES HIDDEN) =====
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveCartToStorage();
    }
});

// ===== LOG CART ACTIVITY (FOR DEBUGGING) =====
console.log('Cart initialized with', cartData.items.length, 'items');

// ===== END OF CART SCRIPTS =====