// Load products from JSON and render them
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    const data = await response.json();
    const productsContainer = document.getElementById('products-container');
    
    productsContainer.innerHTML = '';
    
    data.products.forEach((product, index) => {
      // Determine size class for filtering
      const sizeClass = product.sizeCategory.toLowerCase() === 's' ? 'small' : 
                       product.sizeCategory.toLowerCase() === 'm' ? 'medium' : 'large';
      
      // Create product description in format: "M, Circle, 12 inch × 12 inch"
      let description = '';

      if (product.designType.toLowerCase() === 'circle') {
        // Extract single dimension from "4 inch × 4 inch"
        const size = product.dimensions.split('×')[0].trim();
        description = `${product.sizeCategory}, ${product.designType} ${size}`;
      } else {
        description = `${product.sizeCategory}, ${product.designType}, ${product.dimensions}`;
      }

      // Get images array (use images if available, otherwise fallback to single image)
      const images = product.images || [product.image];
      const mainImage = images[0];
      
      const productCard = document.createElement('div');
      // Set classes: both 'product-card' and the size class for filtering
      productCard.classList.add('product-card', sizeClass);
      productCard.id = product.id;
      productCard.style.animationDelay = `${(index + 1) * 0.1}s`;
      
      // Build image gallery HTML
      let imageGalleryHTML = `
        <div class="product-image-container">
          <img src="${mainImage}" onclick="openProductModal('${product.id}')" alt="${product.label}" class="product-main-image">
      `;
      
      // Add thumbnails if there are multiple images
      if (images.length > 1) {
        imageGalleryHTML += '<div class="product-thumbnails">';
        images.forEach((img, imgIndex) => {
          imageGalleryHTML += `
            <img src="${img}" 
                 onclick="openProductModal('${product.id}', ${imgIndex})" 
                 alt="${product.label} - View ${imgIndex + 1}"
                 class="product-thumbnail ${imgIndex === 0 ? 'active' : ''}"
                 data-image-index="${imgIndex}">
          `;
        });
        imageGalleryHTML += '</div>';
      }
      imageGalleryHTML += '</div>';
      
      productCard.innerHTML = `
        ${imageGalleryHTML}
        <div class="product-label">${product.label}</div>
        <div class="product-description">${description}</div>
        <button class="order-btn" onclick="orderOnInstagram('${product.id}')">
          Order via Instagram
        </button>
      `;
      
      // Store images array in data attribute for modal access
      productCard.setAttribute('data-images', JSON.stringify(images));
      
      productsContainer.appendChild(productCard);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    // Show error message to user
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
      productsContainer.innerHTML = '<p style="text-align: center; color: var(--mud-brown);">Error loading products. Please refresh the page.</p>';
    }
  }
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  filterCategory('all'); // enforce correct initial state
  setupModalKeyboardNavigation();
});

// Setup keyboard navigation for modal (arrow keys)
function setupModalKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('imageModal');
    if (modal && modal.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    }
  });
}

function toggleThumbnails(show) {
  const thumbnails = document.querySelectorAll('.product-thumbnails');
  thumbnails.forEach(thumbnail => {
    thumbnail.style.display = show ? 'flex' : 'none';
  });
}


/**
 * Category filter function
 * Filters product cards based on their class (small, medium, large)
 */
function filterCategory(category) {
  const products = document.querySelectorAll('.product-card');
  const buttons = document.querySelectorAll('.category-filter button');

  // Update button states
  buttons.forEach(btn => {
    btn.classList.remove('active');
    const btnText = btn.textContent.trim().toLowerCase();
    if (category === btnText || (category === 'all' && btnText === 'all')) {
      btn.classList.add('active');
    }
  });

  // 🔹 Hide thumbnails when "all" is selected
  toggleThumbnails(category !== 'all');

  const container = document.getElementById('products-container');

let visibleCount = 0;

products.forEach(product => {
  if (category === 'all') {
    product.style.display = 'block';
    visibleCount++;
  } else if (product.classList.contains(category)) {
    product.style.display = 'block';
    visibleCount++;
  } else {
    product.style.display = 'none';
  }
});

// Handle layout for single product
container.classList.toggle('single-product', visibleCount === 1);
}


// Store current product images and index for modal navigation
let currentProductImages = [];
let currentImageIndex = 0;

/**
 * Open product modal with image gallery support
 * @param {string} productId - The product ID
 * @param {number} imageIndex - Optional: specific image index to show (default: 0)
 */
function openProductModal(productId, imageIndex = 0) {
  const productCard = document.getElementById(productId);
  if (!productCard) return;
  
  const imagesJson = productCard.getAttribute('data-images');
  if (!imagesJson) return;
  
  currentProductImages = JSON.parse(imagesJson);
  currentImageIndex = imageIndex || 0;
  
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  
  if (currentProductImages.length > 0) {
    modalImage.src = currentProductImages[currentImageIndex];
    updateModalNavigation();
    modal.style.display = 'flex';
  }
}

/**
 * Navigate to previous image in modal
 */
function previousImage() {
  if (currentProductImages.length === 0) return;
  currentImageIndex = (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
  const modalImage = document.getElementById('modalImage');
  modalImage.src = currentProductImages[currentImageIndex];
  updateModalNavigation();
}

/**
 * Navigate to next image in modal
 */
function nextImage() {
  if (currentProductImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % currentProductImages.length;
  const modalImage = document.getElementById('modalImage');
  modalImage.src = currentProductImages[currentImageIndex];
  updateModalNavigation();
}

/**
 * Update modal navigation buttons visibility
 */
function updateModalNavigation() {
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');
  const imageCounter = document.getElementById('modalImageCounter');
  
  if (currentProductImages.length > 1) {
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    if (imageCounter) {
      imageCounter.textContent = `${currentImageIndex + 1} / ${currentProductImages.length}`;
      imageCounter.style.display = 'block';
    }
  } else {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (imageCounter) imageCounter.style.display = 'none';
  }
}

/**
 * Legacy function for backward compatibility
 */
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  modalImage.src = imageSrc;
  currentProductImages = [imageSrc];
  currentImageIndex = 0;
  updateModalNavigation();
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  currentProductImages = [];
  currentImageIndex = 0;
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