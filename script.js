function openModal(src) {
  document.getElementById("modalImage").src = src;
  document.getElementById("imageModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function orderOnInstagram(productName) {
  const productLink =
    window.location.origin + window.location.pathname +
    "#" + productName.replace(/\s+/g, "-").toLowerCase();

  const message =
    "Hi, I am interested in this Lippan art piece from mrida.kriti. Here is the product link: " +
    productLink;

  // Link to Instagram profile - users can click Message button to DM
  const instagramUrl = "https://www.instagram.com/mrida.kriti/";

  window.open(instagramUrl, "_blank");
}

function filterCategory(category) {
  const cards = document.querySelectorAll(".product-card");
  const buttons = document.querySelectorAll(".category-filter button");

  buttons.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  cards.forEach(card => {
    if (category === "all" || card.classList.contains(category)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

