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
function orderOnInstagram(productName) {
  const instagramUrl = 'https://www.instagram.com/mrida.kriti/';
  window.open(instagramUrl, '_blank');
}

