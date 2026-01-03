/**
 * Category filter function
 * Filters product cards based on their class (small, medium, large)
 */
function filterCategory(category) {
  const products = document.querySelectorAll('.product-card');
  const buttons = document.querySelectorAll('.category-filter button');
  
  // Update button states
  buttons.forEach(btn => {
    const btnText = btn.textContent.trim().toLowerCase();
    if (category === btnText || (category === 'all' && btnText === 'all')) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Show/Hide logic
  products.forEach(product => {
    if (category === 'all' || product.classList.contains(category)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

/**
 * Modal functions
 * Handles image zoom/preview
 */
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  modalImage.src = imageSrc;
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
}

/**
 * Order via Instagram function
 * Copies product info to clipboard and deep-links to Instagram app
 */
async function orderOnInstagram(productId) {
  const productCard = document.getElementById(productId);
  if (!productCard) return;
  
  const productLabel = productCard.querySelector('.product-label');
  const productName = productLabel ? productLabel.textContent.trim() : 'this product';
  
  // Construct the message
  const productLink = `${window.location.origin}${window.location.pathname}#${productId}`;
  const message = `Hi! I'm interested in ordering: ${productName}\n\n${productLink}`;
  
  // 1. Attempt to copy to clipboard
  let copySuccess = false;
  try {
    await navigator.clipboard.writeText(message);
    copySuccess = true;
  } catch (err) {
    // Fallback copy method
    const textarea = document.createElement('textarea');
    textarea.value = message;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      copySuccess = true;
    } catch (f) {
      console.error('Copy failed', f);
    }
    document.body.removeChild(textarea);
  }

  // 2. Show notification if copy was successful
  if (copySuccess) {
    showCopyNotification('✅ Link copied. Paste it in DM', productCard);
  }

  // 3. Handle Redirection after a short delay
  setTimeout(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      /**
       * MOBILE: Use hidden iframe to trigger deep link without navigating away
       * This prevents the page from being replaced, so when user returns,
       * they see the original website, not Instagram login page
       */
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'instagram://user?username=mrida.kriti';
      document.body.appendChild(iframe);
      
      // Fallback: If the app isn't installed, open web link after delay
      setTimeout(() => {
        // Remove iframe
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
        
        // Check if we're still on the page (app didn't open)
        if (!document.hidden) {
          // Open web link in same window (user can navigate back)
          window.location.href = 'https://ig.me/m/mrida.kriti';
        }
      }, 1500);
      
    } else {
      // Desktop: opens the DM link in a new tab
      window.open('https://ig.me/m/mrida.kriti', '_blank');
    }
  }, 1500);
}

/**
 * Show a temporary notification
 * Appears above the clicked button
 */
function showCopyNotification(message, productCard) {
  const existingNotification = document.getElementById('copy-notification');
  if (existingNotification) existingNotification.remove();
  
  const orderButton = productCard.querySelector('.order-btn');
  if (!orderButton) return;
  
  const buttonRect = orderButton.getBoundingClientRect();
  const buttonStyles = window.getComputedStyle(orderButton);
  
  const notification = document.createElement('div');
  notification.id = 'copy-notification';
  notification.textContent = message;
  
  // Styling the notification to match your theme
  notification.style.cssText = `
    position: absolute;
    bottom: ${buttonRect.height + 24}px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--off-white);
    color: var(--dark-text);
    padding: 12px 24px;
    border-radius: 25px;
    font-size: ${buttonStyles.fontSize};
    font-weight: 500;
    font-family: ${buttonStyles.fontFamily};
    z-index: 10000;
    box-shadow: 0 4px 20px var(--shadow-medium);
    border: 1.5px solid var(--mud-brown);
    animation: slideUp 0.3s ease;
    text-align: center;
    white-space: nowrap;
    letter-spacing: ${buttonStyles.letterSpacing};
    pointer-events: none;
  `;
  
  productCard.style.position = 'relative';
  productCard.appendChild(notification);
  
  // Auto-remove after 2 seconds
  setTimeout(() => {
    notification.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 300);
  }, 2000);
}