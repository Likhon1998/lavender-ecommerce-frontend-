// ===== CART PAGE JAVASCRIPT =====

// Cart state management
let cartData = {
    items: [
        {
            id: 1,
            name: 'Premium Cotton T-Shirt',
            price: 49.99,
            originalPrice: 69.99,
            quantity: 2,
            color: 'Black',
            size: 'M',
            image: 'https://picsum.photos/150/150?random=50'
        },
        {
            id: 2,
            name: 'Wireless Headphones',
            price: 149.99,
            quantity: 1,
            color: 'Black',
            image: 'https://picsum.photos/150/150?random=51'
        },
        {
            id: 3,
            name: 'Leather Handbag',
            price: 199.99,
            quantity: 1,
            color: 'Brown',
            image: 'https://picsum.photos/150/150?random=52'
        }
    ],
    coupon: null,
    discountAmount: 0
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    updateOrderSummary();
});

// Update quantity
function updateQuantity(itemId, action) {
    const item = cartData.items.find(i => i.id === itemId);
    if (!item) return;

    if (action === 'increase' && item.quantity < 10) {
        item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity--;
    }

    // Update the input value
    const input = document.querySelector(`[data-item-id="${itemId}"] .qty-input`);
    if (input) {
        input.value = item.quantity;
    }

    // Update subtotal
    updateItemSubtotal(itemId);
    updateOrderSummary();
    updateCartBadge();

    // Add animation
    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItem) {
        cartItem.classList.add('pulse-animation');
        setTimeout(() => cartItem.classList.remove('pulse-animation'), 300);
    }
}

// Update item subtotal
function updateItemSubtotal(itemId) {
    const item = cartData.items.find(i => i.id === itemId);
    if (!item) return;

    const subtotal = item.price * item.quantity;
    const subtotalElement = document.querySelector(`[data-item-id="${itemId}"] .subtotal-amount`);
    
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
}

// Remove item from cart
function removeItem(itemId) {
    // Show confirmation
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
        return;
    }

    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
    
    if (cartItem) {
        // Add removing animation
        cartItem.classList.add('removing');
        
        // Wait for animation to complete
        setTimeout(() => {
            // Remove from data
            cartData.items = cartData.items.filter(i => i.id !== itemId);
            
            // Remove from DOM
            cartItem.remove();
            
            // Update display
            updateCartDisplay();
            updateOrderSummary();
            updateCartBadge();
            
            // Show notification
            showNotification('Item removed from cart', 'success');
        }, 400);
    }
}

// Move to wishlist
function moveToWishlist(itemId) {
    const item = cartData.items.find(i => i.id === itemId);
    
    if (!item) return;
    
    // In a real app, you would add to wishlist here
    console.log('Moving to wishlist:', item);
    
    // Remove from cart
    removeItem(itemId);
    
    // Show notification
    showNotification('Item moved to wishlist', 'success');
}

// Clear cart
function clearCart() {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
        return;
    }

    cartData.items = [];
    cartData.coupon = null;
    cartData.discountAmount = 0;

    updateCartDisplay();
    updateOrderSummary();
    updateCartBadge();
    
    showNotification('Cart cleared', 'info');
}

// Apply coupon
function applyCoupon(event) {
    event.preventDefault();
    
    const couponInput = document.getElementById('couponCode');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('Please enter a coupon code', 'warning');
        return;
    }

    // Simulate coupon validation
    const validCoupons = {
        'SAVE10': { discount: 0.10, type: 'percentage' },
        'SAVE20': { discount: 0.20, type: 'percentage' },
        'FLAT50': { discount: 50, type: 'fixed' }
    };

    if (validCoupons[couponCode]) {
        cartData.coupon = {
            code: couponCode,
            ...validCoupons[couponCode]
        };
        
        // Show applied coupon
        document.getElementById('couponName').textContent = couponCode;
        document.getElementById('appliedCoupon').style.display = 'block';
        couponInput.value = '';
        
        updateOrderSummary();
        showNotification('Coupon applied successfully!', 'success');
    } else {
        showNotification('Invalid coupon code', 'error');
    }
}

// Remove coupon
function removeCoupon() {
    cartData.coupon = null;
    cartData.discountAmount = 0;
    
    document.getElementById('appliedCoupon').style.display = 'none';
    updateOrderSummary();
    
    showNotification('Coupon removed', 'info');
}

// Update order summary
function updateOrderSummary() {
    // Calculate subtotal
    const subtotal = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate discount
    let discount = 0;
    if (cartData.coupon) {
        if (cartData.coupon.type === 'percentage') {
            discount = subtotal * cartData.coupon.discount;
        } else {
            discount = cartData.coupon.discount;
        }
    }
    cartData.discountAmount = discount;
    
    // Calculate tax (10%)
    const taxRate = 0.10;
    const tax = (subtotal - discount) * taxRate;
    
    // Calculate total
    const total = subtotal - discount + tax;
    
    // Calculate savings (original price - current price)
    const savings = cartData.items.reduce((sum, item) => {
        if (item.originalPrice) {
            return sum + ((item.originalPrice - item.price) * item.quantity);
        }
        return sum;
    }, 0) + discount;

    // Update DOM
    const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update item count
    document.getElementById('itemCount').textContent = cartData.items.length;
    document.getElementById('summaryItemCount').textContent = totalItems;
    
    // Update summary values
    document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
    
    // Update discount display
    const discountItem = document.getElementById('discountItem');
    if (discount > 0) {
        discountItem.style.display = 'flex';
        document.getElementById('summaryDiscount').textContent = `-$${discount.toFixed(2)}`;
    } else {
        discountItem.style.display = 'none';
    }
    
    // Update savings display
    const savingsElement = document.getElementById('summarySavings');
    if (savings > 0 && savingsElement) {
        savingsElement.style.display = 'block';
        savingsElement.querySelector('strong').textContent = `$${savings.toFixed(2)}`;
    } else if (savingsElement) {
        savingsElement.style.display = 'none';
    }
}

// Update cart display (show/hide empty state)
function updateCartDisplay() {
    const emptyState = document.getElementById('emptyCartState');
    const cartContent = document.getElementById('cartContent');
    
    if (cartData.items.length === 0) {
        emptyState.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        cartContent.style.display = 'block';
    }
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        
        if (totalItems === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartData.items.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    // Add loading state to button
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    btn.disabled = true;

    // Simulate processing
    setTimeout(() => {
        // In a real app, redirect to checkout page
        window.location.href = 'checkout.html';
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    `;
    
    // Set icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas ${icon} me-2"></i>${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle quantity input change
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('qty-input')) {
        const itemId = parseInt(e.target.closest('[data-item-id]').dataset.itemId);
        const newQuantity = parseInt(e.target.value);
        
        if (newQuantity > 0 && newQuantity <= 10) {
            const item = cartData.items.find(i => i.id === itemId);
            if (item) {
                item.quantity = newQuantity;
                updateItemSubtotal(itemId);
                updateOrderSummary();
                updateCartBadge();
            }
        } else {
            // Reset to current value
            const item = cartData.items.find(i => i.id === itemId);
            if (item) {
                e.target.value = item.quantity;
            }
        }
    }
});

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-ripple') || e.target.closest('.btn-ripple')) {
        const button = e.target.classList.contains('btn-ripple') ? e.target : e.target.closest('.btn-ripple');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('elegantshop_cart', JSON.stringify(cartData));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('elegantshop_cart');
    if (savedCart) {
        try {
            cartData = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error loading cart:', e);
        }
    }
}

// Auto-save cart on changes
window.addEventListener('beforeunload', saveCart);

// Load cart on page load
loadCart();