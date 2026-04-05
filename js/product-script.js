// =========================================================
// 1. GLOBAL VARIABLES
// =========================================================
let shoppingCart = [];

document.addEventListener('DOMContentLoaded', function () {

    // =========================================================
    // 2. MOBILE MENU LOGIC
    // =========================================================
    const mobileBtn = document.getElementById('catMobileMenuBtn');
    const navLinks = document.getElementById('catNavLinks');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => navLinks.classList.toggle('cat-show'));
    }

    // =========================================================
    // 3. PRODUCT PAGINATION & FILTERING LOGIC
    // =========================================================
    const productGrid = document.getElementById('catProductGrid');
    const allProductHTML = Array.from(productGrid.children);

    const searchInput = document.getElementById('catSearchInput');
    const categoryItems = document.querySelectorAll('.cat-category-list li');
    const sortSelect = document.getElementById('catSortSelect');
    const paginationBox = document.getElementById('catPagination');
    const showingText = document.getElementById('catShowingText');

    let currentCategory = "All";
    let currentPage = 1;
    const itemsPerPage = 10;

    function updateCatalog() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        let filteredProducts = allProductHTML.filter(card => {
            const title = card.querySelector('.cat-title').innerText.toLowerCase();
            const category = card.getAttribute('data-category');

            const matchSearch = title.includes(searchTerm);
            const matchCategory = currentCategory === "All" || category === currentCategory;

            return matchSearch && matchCategory;
        });

        const sortValue = sortSelect.value;
        if (sortValue === "low") {
            filteredProducts.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
        } else if (sortValue === "high") {
            filteredProducts.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
        }

        const totalItems = filteredProducts.length;
        showingText.innerText = totalItems;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (currentPage > totalPages) currentPage = 1;
        if (totalPages === 0) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        productGrid.innerHTML = '';

        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        productsToShow.forEach(card => {
            card.style.display = 'flex';
            productGrid.appendChild(card);
        });

        buildPaginationButtons(totalPages);
    }

    function buildPaginationButtons(totalPages) {
        paginationBox.innerHTML = '';
        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'cat-page-btn';
        prevBtn.innerText = '❮ Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => { currentPage--; updateCatalog(); window.scrollTo(0, 0); };
        paginationBox.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const numBtn = document.createElement('button');
            numBtn.className = `cat-page-btn ${i === currentPage ? 'cat-active-page' : ''}`;
            numBtn.innerText = i;
            numBtn.onclick = () => { currentPage = i; updateCatalog(); window.scrollTo(0, 0); };
            paginationBox.appendChild(numBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'cat-page-btn';
        nextBtn.innerText = 'Next ❯';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => { currentPage++; updateCatalog(); window.scrollTo(0, 0); };
        paginationBox.appendChild(nextBtn);
    }

    categoryItems.forEach(li => {
        li.addEventListener('click', function () {
            categoryItems.forEach(item => item.classList.remove('cat-active-filter'));
            this.classList.add('cat-active-filter');
            currentCategory = this.getAttribute('data-filter');
            currentPage = 1;
            updateCatalog();
        });
    });

    searchInput.addEventListener('input', () => { currentPage = 1; updateCatalog(); });
    sortSelect.addEventListener('change', () => { currentPage = 1; updateCatalog(); });

    updateCatalog();

    // =========================================================
    // 4. IMAGE ZOOM LOGIC (NEW FEATURE INITIALIZATION)
    // =========================================================
    setupImageZoom();
});

// =========================================================
// 5. QUANTITY AND ADD TO CART LOGIC
// =========================================================
window.validateQty = function (input) {
    let val = parseInt(input.value);
    if (isNaN(val) || val < 1) {
        input.value = 1;
    }
};

window.updateQty = function (btn, change) {
    const input = btn.parentElement.querySelector('.cat-qty-input');
    let currentValue = parseInt(input.value) || 1;
    let newValue = currentValue + change;
    if (newValue < 1) newValue = 1;
    input.value = newValue;
};

window.addToCart = function (btn) {
    const card = btn.closest('.cat-prod-card');
    const title = card.querySelector('.cat-title').innerText;
    const qtyInput = card.querySelector('.cat-qty-input');
    const qty = parseInt(qtyInput.value) || 1;

    const existingItem = shoppingCart.find(item => item.title === title);
    if (existingItem) existingItem.qty += qty;
    else shoppingCart.push({ title: title, qty: qty });

    updateCartUI();
    qtyInput.value = 1;

    // Button Animation
    const originalText = btn.innerText;
    btn.innerText = "✅ Added!";
    btn.style.backgroundColor = "#25D366";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "";
    }, 1000);
};

function updateCartUI() {
    const cartBtn = document.getElementById('catFloatingCart');
    const cartCount = document.getElementById('catCartCount');
    let totalItems = 0;
    shoppingCart.forEach(item => { totalItems += item.qty; });

    if (totalItems > 0 && cartBtn && cartCount) {
        cartCount.innerText = totalItems;
        cartBtn.style.display = 'block';
    } else if (cartBtn) {
        cartBtn.style.display = 'none';
    }
}

// =========================================================
// 6. NEW FEATURE: IMAGE ZOOM IMPLEMENTATION
// =========================================================
function setupImageZoom() {
    const allImages = document.querySelectorAll('.cat-img-box img');
    const modal = document.getElementById('imageZoomModal');
    const modalImg = document.getElementById('zoomedImage');

    allImages.forEach(img => {
        img.addEventListener('click', function () {
            modalImg.src = this.src;
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    });
}

window.closeImageModal = function () {
    const modal = document.getElementById('imageZoomModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Wait for transition
};

// =========================================================
// 7. NEW FEATURE: CART REVIEW MODAL & WHATSAPP
// =========================================================
window.openCartReview = function () {
    const cartModal = document.getElementById('cartReviewModal');
    const itemsList = document.getElementById('cartItemsList');

    // Build cart items HTML
    itemsList.innerHTML = '';
    shoppingCart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cat-cart-item';
        itemRow.innerHTML = `<span>${item.title}</span> <span>Qty: <b>${item.qty}</b></span>`;
        itemsList.appendChild(itemRow);
    });

    cartModal.style.display = 'flex';
};

window.closeCartReview = function () {
    document.getElementById('cartReviewModal').style.display = 'none';
};

window.clearCart = function () {
    shoppingCart = [];
    updateCartUI();
    closeCartReview();
    alert("Cart has been cleared.");
};

window.sendCartToWhatsApp = function () {
    if (shoppingCart.length === 0) return;

    let message = "Hello Ashapura Steel,\nI would like to order the following items:\n\n";
    shoppingCart.forEach((item, index) => {
        message += `${index + 1}. ${item.title} - Qty: ${item.qty}\n`;
    });
    message += "\nPlease let me know the total price and delivery details.";

    const whatsappUrl = `https://wa.me/916359063984?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Optional: clear cart after sending
    // clearCart();
};
// બટન એલિમેન્ટ મેળવો
const mybutton = document.getElementById("backToTopBtn");

// જ્યારે યુઝર સ્ક્રોલ કરે ત્યારે આ ફંક્શન ચાલશે
window.onscroll = function() {
  // જો 300px થી વધુ સ્ક્રોલ કર્યું હોય, તો બટન બતાવો
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    mybutton.classList.add("show"); // 'show' ક્લાસ ઉમેરો
  } else {
    mybutton.classList.remove("show"); // 'show' ક્લાસ દૂર કરો
  }
};

// બટન પર ક્લિક કરવાથી ઉપર જવાનું ફંક્શન
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // ધીમેથી ઉપર જવા માટે
  });
}