// ===== CHECKOUT PAGE SCRIPTS =====

// Checkout data
let checkoutData = {
    currentStep: 1,
    customer: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    },
    shippingAddress: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
    },
    shippingMethod: 'standard',
    shippingCost: 0,
    paymentMethod: 'card',
    orderItems: [
        { id: 1, name: 'Premium Cotton T-Shirt', price: 49.99, quantity: 2 },
        { id: 2, name: 'Wireless Headphones', price: 149.99, quantity: 1 },
        { id: 3, name: 'Leather Handbag', price: 199.99, quantity: 1 }
    ]
};

// Initialize checkout on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
    updateOrderSummary();
    setupFormValidation();
    setupCardFormatting();
});

// ===== INITIALIZE CHECKOUT =====
function initializeCheckout() {
    // Load saved data from localStorage if exists
    const savedData = localStorage.getItem('checkoutData');
    if (savedData) {
        checkoutData = { ...checkoutData, ...JSON.parse(savedData) };
        populateFormFields();
    }
}

// ===== NAVIGATION BETWEEN STEPS =====
function nextStep(stepNumber) {
    // Validate current step before proceeding
    if (!validateStep(checkoutData.currentStep)) {
        return;
    }

    // Hide current step
    document.getElementById(`step${checkoutData.currentStep}`).classList.remove('active');
    document.querySelector(`[data-step="${checkoutData.currentStep}"]`).classList.remove('active');
    document.querySelector(`[data-step="${checkoutData.currentStep}"]`).classList.add('completed');

    // Show next step
    checkoutData.currentStep = stepNumber;
    document.getElementById(`step${stepNumber}`).classList.add('active');
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

    // Update step lines
    updateStepLines();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save progress
    saveCheckoutData();
}

function prevStep(stepNumber) {
    // Hide current step
    document.getElementById(`step${checkoutData.currentStep}`).classList.remove('active');
    document.querySelector(`[data-step="${checkoutData.currentStep}"]`).classList.remove('active');

    // Show previous step
    checkoutData.currentStep = stepNumber;
    document.getElementById(`step${stepNumber}`).classList.add('active');
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

    // Update step lines
    updateStepLines();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== UPDATE STEP LINES =====
function updateStepLines() {
    const lines = document.querySelectorAll('.step-line');
    lines.forEach((line, index) => {
        if (index < checkoutData.currentStep - 1) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

// ===== VALIDATE STEP =====
function validateStep(step) {
    switch (step) {
        case 1:
            return validateCustomerInfo();
        case 2:
            return validateShippingInfo();
        case 3:
            return validatePaymentInfo();
        case 4:
            return validateReviewInfo();
        default:
            return true;
    }
}

// ===== VALIDATE CUSTOMER INFO =====
function validateCustomerInfo() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!firstName || !lastName || !email || !phone) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    // Save data
    checkoutData.customer = { firstName, lastName, email, phone };
    return true;
}

// ===== VALIDATE SHIPPING INFO =====
function validateShippingInfo() {
    const selectedAddress = document.querySelector('input[name="savedAddress"]:checked');
    
    if (!selectedAddress) {
        // Check if new address form is filled
        const address1 = document.getElementById('address1Input').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value.trim();

        if (!address1 || !city || !state || !zip) {
            showNotification('Please select or enter a shipping address', 'error');
            return false;
        }

        checkoutData.shippingAddress = {
            address1,
            address2: document.getElementById('address2Input').value.trim(),
            city,
            state,
            zip,
            country: document.getElementById('country').value
        };
    }

    return true;
}

// ===== VALIDATE PAYMENT INFO =====
function validatePaymentInfo() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;

    if (paymentMethod === 'creditCard') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardName = document.getElementById('cardName').value.trim();
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCVV = document.getElementById('cardCVV').value.trim();

        if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
            showNotification('Please fill in all card details', 'error');
            return false;
        }

        if (cardNumber.length < 13 || cardNumber.length > 19) {
            showNotification('Please enter a valid card number', 'error');
            return false;
        }

        if (cardCVV.length < 3 || cardCVV.length > 4) {
            showNotification('Please enter a valid CVV', 'error');
            return false;
        }
    }

    checkoutData.paymentMethod = paymentMethod;
    return true;
}

// ===== VALIDATE REVIEW INFO =====
function validateReviewInfo() {
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!agreeTerms) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        return false;
    }

    return true;
}

// ===== EMAIL VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== SELECT ADDRESS =====
function selectAddress(element) {
    // Remove selected class from all
    document.querySelectorAll('.saved-address-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Add selected class
    element.classList.add('selected');

    // Check the radio button
    const radio = element.querySelector('input[type="radio"]');
    if (radio) {
        radio.checked = true;
    }
}

// ===== EDIT ADDRESS =====
function editAddress(event) {
    event.stopPropagation();
    showNotification('Edit address functionality', 'info');
}

// ===== TOGGLE NEW ADDRESS FORM =====
function toggleNewAddress() {
    const form = document.getElementById('newAddressForm');
    const btn = event.target;
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-times me-2"></i>Cancel';
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-outline-danger');
    } else {
        form.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-plus me-2"></i>Add New Address';
        btn.classList.remove('btn-outline-danger');
        btn.classList.add('btn-outline-primary');
    }
}

// ===== SELECT SHIPPING METHOD =====
function selectShipping(element) {
    // Remove selected class from all
    document.querySelectorAll('.shipping-method-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Add selected class
    element.classList.add('selected');

    // Check the radio button
    const radio = element.querySelector('input[type="radio"]');
    if (radio) {
        radio.checked = true;
        checkoutData.shippingCost = parseFloat(radio.getAttribute('data-price'));
        updateOrderSummary();
    }
}

// ===== SELECT PAYMENT METHOD =====
function selectPayment(element, method) {
    // Remove active class from all
    document.querySelectorAll('.payment-method-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class
    element.classList.add('active');

    // Show/hide payment forms
    document.getElementById('cardDetailsForm').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('paypalInfo').style.display = method === 'paypal' ? 'block' : 'none';
    document.getElementById('codInfo').style.display = method === 'cod' ? 'block' : 'none';
}

// ===== CARD NUMBER FORMATTING =====
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCVV = document.getElementById('cardCVV');

    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    if (cardCVV) {
        cardCVV.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// ===== UPDATE ORDER SUMMARY =====
function updateOrderSummary() {
    // Calculate subtotal
    let subtotal = 0;
    checkoutData.orderItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    // Get shipping cost
    const shipping = checkoutData.shippingCost;

    // Calculate tax (10%)
    const tax = subtotal * 0.10;

    // Calculate total
    const total = subtotal + shipping + tax;

    // Update display
    document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

// ===== FORM VALIDATION SETUP =====
function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }

    // Real-time validation
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });

        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    });
}

// ===== PLACE ORDER =====
function placeOrder() {
    const btn = document.getElementById('placeOrderBtn');
    const originalText = btn.innerHTML;

    // Validate final step
    if (!validateReviewInfo()) {
        return;
    }

    // Show loading state
    btn.disabled = true;
    btn.classList.add('btn-processing');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing Order...';

    // Simulate order processing
    setTimeout(() => {
        // Save order data
        const orderData = {
            orderId: 'ORD-' + Date.now(),
            customer: checkoutData.customer,
            shippingAddress: checkoutData.shippingAddress,
            shippingMethod: checkoutData.shippingMethod,
            paymentMethod: checkoutData.paymentMethod,
            items: checkoutData.orderItems,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Clear checkout data
        localStorage.removeItem('checkoutData');
        localStorage.removeItem('elegantShopCart');

        // Redirect to success page
        window.location.href = 'success.html';
    }, 2000);
}

// ===== SAVE CHECKOUT DATA =====
function saveCheckoutData() {
    try {
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    } catch (e) {
        console.error('Failed to save checkout data:', e);
    }
}

// ===== POPULATE FORM FIELDS =====
function populateFormFields() {
    if (checkoutData.customer.firstName) {
        document.getElementById('firstName').value = checkoutData.customer.firstName;
        document.getElementById('lastName').value = checkoutData.customer.lastName;
        document.getElementById('email').value = checkoutData.customer.email;
        document.getElementById('phone').value = checkoutData.customer.phone;
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
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
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== AUTO-SAVE ON INPUT =====
document.querySelectorAll('.checkout-form input, .checkout-form select').forEach(input => {
    input.addEventListener('change', () => {
        saveCheckoutData();
    });
});

// ===== PREVENT ACCIDENTAL NAVIGATION =====
window.addEventListener('beforeunload', function(e) {
    if (checkoutData.currentStep > 1) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Press 'N' for next step
    if (e.key === 'n' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        if (checkoutData.currentStep < 4) {
            nextStep(checkoutData.currentStep + 1);
        }
    }
    
    // Press 'B' for back
    if (e.key === 'b' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        if (checkoutData.currentStep > 1) {
            prevStep(checkoutData.currentStep - 1);
        }
    }
});

// ===== SMOOTH SCROLL TO INVALID FIELD =====
function scrollToInvalidField() {
    const invalidField = document.querySelector('.is-invalid');
    if (invalidField) {
        invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidField.focus();
    }
}

// ===== DETECT CARD TYPE =====
function detectCardType(number) {
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/
    };

    for (let type in patterns) {
        if (patterns[type].test(number)) {
            return type;
        }
    }
    return 'unknown';
}

// ===== UPDATE CARD ICON BASED ON NUMBER =====
document.getElementById('cardNumber')?.addEventListener('input', function() {
    const cardType = detectCardType(this.value.replace(/\s/g, ''));
    // You can update UI to show card type icon here
    console.log('Card type:', cardType);
});

// ===== AUTOFILL DETECTION =====
window.addEventListener('load', () => {
    setTimeout(() => {
        const inputs = document.querySelectorAll('input:-webkit-autofill');
        if (inputs.length > 0) {
            console.log('Autofill detected');
        }
    }, 500);
});

// ===== LOG CHECKOUT PROGRESS =====
console.log('Checkout initialized - Step:', checkoutData.currentStep);

// ===== END OF CHECKOUT SCRIPTS =====