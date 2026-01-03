// Category filter function
function filterCategory(category) {
  // Get all product cards
  const products = document.querySelectorAll('.product-card');
  
  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.category-filter button');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to clicked button
  // Find the button that matches the category
  buttons.forEach(btn => {
    const btnText = btn.textContent.trim().toLowerCase();
    if ((category === 'all' && btnText === 'all') ||
        (category === 'small' && btnText === 'small') ||
        (category === 'medium' && btnText === 'medium') ||
        (category === 'large' && btnText === 'large')) {
      btn.classList.add('active');
    }
  });
  
  // Show/hide products based on category
  products.forEach(product => {
    if (category === 'all') {
      product.style.display = 'block';
    } else {
      if (product.classList.contains(category)) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    }
  });
}

// Modal functions
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

// Order via Instagram function
async function orderOnInstagram(productId) {
  // Get the product card element
  const productCard = document.getElementById(productId);
  if (!productCard) {
    console.error('Product card not found:', productId);
    return;
  }
  
  // Get the product name from the product label
  const productLabel = productCard.querySelector('.product-label');
  const productName = productLabel ? productLabel.textContent.trim() : 'this product';
  
  // Generate the product link using the current page URL and product ID
  const productLink = `${window.location.origin}${window.location.pathname}#${productId}`;
  
  // Create a formatted message with product name and link
  const message = `Hi! I'm interested in ordering: ${productName}\n\n${productLink}`;
  
  try {
    // Copy the message to clipboard
    await navigator.clipboard.writeText(message);
    
    // Show notification with clear instructions
    showCopyNotification('✅ Link copied. Paste it in DM', productCard);
    
    // Open Instagram DM after a delay to give user time to read notification
    setTimeout(() => {
      const instagramDmUrl = 'https://ig.me/m/mrida.kriti';
      window.open(instagramDmUrl, '_blank');
    }, 2000);
  } catch (err) {
    // Fallback: if clipboard API fails, try alternative method
    console.error('Clipboard API failed, trying fallback:', err);
    
    // Fallback: create a temporary textarea to copy
    const textarea = document.createElement('textarea');
    textarea.value = message;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      showCopyNotification('✅ Link copied. Paste it in DM', productCard);
      
      setTimeout(() => {
        const instagramDmUrl = 'https://ig.me/m/mrida.kriti';
        window.open(instagramDmUrl, '_blank');
      }, 2000);
    } catch (fallbackErr) {
      document.body.removeChild(textarea);
      console.error('Fallback copy also failed:', fallbackErr);
      // Still open Instagram DM even if copy fails
      const instagramDmUrl = 'https://ig.me/m/mrida.kriti';
      window.open(instagramDmUrl, '_blank');
    }
  }
}

// Show a temporary notification
function showCopyNotification(message, productCard) {
  // Remove any existing notification
  const existingNotification = document.getElementById('copy-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Find the order button in the product card
  const orderButton = productCard.querySelector('.order-btn');
  if (!orderButton) {
    return;
  }
  
  // Get button position and computed font style
  const buttonRect = orderButton.getBoundingClientRect();
  const buttonStyles = window.getComputedStyle(orderButton);
  const buttonFontFamily = buttonStyles.fontFamily;
  const buttonFontSize = buttonStyles.fontSize;
  const buttonLetterSpacing = buttonStyles.letterSpacing;
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'copy-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: absolute;
    bottom: ${buttonRect.height + 24}px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--off-white);
    color: var(--dark-text);
    padding: 12px 24px;
    border-radius: 25px;
    font-size: ${buttonFontSize};
    font-weight: 500;
    font-family: ${buttonFontFamily};
    z-index: 10000;
    box-shadow: 0 4px 20px var(--shadow-medium);
    border: 1.5px solid var(--mud-brown);
    animation: slideUp 0.3s ease;
    text-align: center;
    white-space: nowrap;
    letter-spacing: ${buttonLetterSpacing};
    pointer-events: none;
  `;
  
  // Position relative to product card
  productCard.style.position = 'relative';
  productCard.appendChild(notification);
  
  // Remove notification after 2 seconds (at least 1 second as requested, but 2 for better readability)
  setTimeout(() => {
    notification.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 2000);
}

