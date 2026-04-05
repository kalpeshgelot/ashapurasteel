// script.js

// ગ્રાહકો જે વસ્તુ એડ કરે તે આમાં સેવ થશે
let myOrderCart = [];

document.addEventListener('DOMContentLoaded', function() {
  
  // --- ૧. મોબાઈલ મેનુ ઓપન/ક્લોઝ ---
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if(menuBtn) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // --- ૨. સ્લાઇડર બનાવવાનું ફંક્શન (ઉપર અને નીચે બંને માટે કામ લાગશે) ---
  function buildSlider(sliderId) {
    const track = document.getElementById(sliderId);
    if (!track) return null;

    let currentIndex = 0;
    const totalSlides = track.children.length;
    let autoTimer;
    let startX = 0;
    let dragging = false;

    // સ્લાઈડ ફેરવો
    function slideTo(direction) {
      currentIndex += direction;
      if (currentIndex >= totalSlides) currentIndex = 0;
      if (currentIndex < 0) currentIndex = totalSlides - 1;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // ૪ સેકન્ડ પછી આપમેળે ફરે
    function startAuto() {
      autoTimer = setInterval(() => slideTo(1), 4000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    // મોબાઈલ ટચથી ફેરવવા માટે 
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
      clearInterval(autoTimer); 
    });

    track.addEventListener('touchend', (e) => {
      if(!dragging) return;
      let diff = startX - e.changedTouches[0].clientX;
      
      if (diff > 40) slideTo(1); 
      else if (diff < -40) slideTo(-1); 
      
      dragging = false;
      resetAuto(); 
    });

    startAuto();

    // HTML ના બટન્સ (તીર) માટે
    return function buttonClick(direction) {
      slideTo(direction);
      resetAuto(); 
    };
  }

  // બંને સ્લાઇડર એક્ટિવેટ કર્યા
  window.moveTopSlider = buildSlider('topSlider');
  window.moveBottomSlider = buildSlider('bottomSlider');


  // --- ૩. ઇમેજ ઝૂમ (Lightbox) ---
  const zoomModal = document.getElementById("imageZoomModal");
  const zoomImage = document.getElementById("zoomedImageDisplay");
  
  document.querySelectorAll(".prod-image").forEach(img => {
    img.addEventListener('click', function() {
      zoomModal.style.display = "flex";
      zoomImage.src = this.src;
    });
  });
  
  const closeBtn = document.querySelector(".close-zoom");
  if(closeBtn) closeBtn.addEventListener('click', () => zoomModal.style.display = "none");
  window.addEventListener('click', (e) => { if(e.target === zoomModal) zoomModal.style.display = "none"; });


  // --- ૪. સર્ચ અને કેટેગરી ફિલ્ટર ---
  const searchBox = document.getElementById('searchInput');
  const catButtons = document.querySelectorAll('.cat-btn');
  const allProducts = document.querySelectorAll('.prod-card');
  const suggestBox = document.getElementById('searchSuggestions');
  let activeCategory = "All";

  // કેટેગરી બટન ક્લિક કરવાથી શું થાય 
  catButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      catButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeCategory = this.getAttribute('data-filter');
      runFilters();
    });
  });

  // સ્પેલિંગ મિસ્ટેક માટે લોજિક (Fuzzy Match)
  function isCloseMatch(typed, original) {
    if(!typed) return true;
    const typedWords = typed.split(' ').filter(w => w.length > 0);
    const originalWords = original.split(' ');

    return typedWords.every(tWord => {
      return originalWords.some(oWord => {
        return oWord.includes(tWord); // Simple includes for speed
      });
    });
  }

  // મુખ્ય ફિલ્ટર ફંક્શન
  function runFilters() {
    const term = searchBox ? searchBox.value.toLowerCase().trim() : "";
    let foundAny = false;
    if(suggestBox) suggestBox.innerHTML = '';

    allProducts.forEach(card => {
      const titleEl = card.querySelector('.prod-title');
      if(!titleEl) return;
      
      const titleLower = titleEl.innerText.toLowerCase();
      const realTitle = titleEl.innerText;
      const cardCategory = card.getAttribute('data-category');
      
      // સર્ચ અને કેટેગરી બંને મેચ થવા જોઈએ
      const searchMatch = isCloseMatch(term, titleLower);
      const catMatch = (activeCategory === "All" || cardCategory === activeCategory);

      card.style.display = (searchMatch && catMatch) ? 'flex' : 'none';

      // સર્ચ સજેશન (Dropdown)
      if (term.length > 0 && searchMatch && catMatch && suggestBox) {
        foundAny = true;
        let div = document.createElement('div');
        div.innerText = realTitle;
        div.onclick = function() {
          searchBox.value = realTitle;
          suggestBox.style.display = 'none';
          runFilters(); 
        };
        suggestBox.appendChild(div);
      }
    });

    if(suggestBox) {
      suggestBox.style.display = (term.length > 0 && foundAny) ? 'block' : 'none';
    }
  }

  if (searchBox) {
    searchBox.addEventListener('input', runFilters);
    document.addEventListener('click', (e) => {
      if(e.target !== searchBox && suggestBox) suggestBox.style.display = 'none';
    });
  }
});

// --- ૫. કાર્ટ અને WhatsApp ઓર્ડર ---
window.addToCart = function(buttonElement) {
  const card = buttonElement.closest('.prod-card');
  const title = card.querySelector('.prod-title').innerText;
  const qtyBox = card.querySelector('.qty-input');
  const qty = parseInt(qtyBox.value);

  if (qty > 0) {
    // જો પ્રોડક્ટ પહેલેથી હોય તો પ્લસ કરો, નહિ તો નવી એડ કરો
    const exists = myOrderCart.find(item => item.title === title);
    if (exists) exists.qty += qty;
    else myOrderCart.push({ title: title, qty: qty });

    refreshCartButton();
    qtyBox.value = 1; 
    
    // બટન પર એડ થઈ ગયું એવું બતાવવા 
    const oldText = buttonElement.innerText;
    buttonElement.innerText = "✅ Added!";
    buttonElement.style.backgroundColor = "#25D366";
    setTimeout(() => {
      buttonElement.innerText = oldText;
      buttonElement.style.backgroundColor = "";
    }, 1500);
  }
};

function refreshCartButton() {
  const floatBtn = document.getElementById('whatsappCartFloat');
  const countSpan = document.getElementById('cartTotalItems');
  
  let total = 0;
  myOrderCart.forEach(item => { total += item.qty; });

  if (total > 0 && floatBtn && countSpan) {
    countSpan.innerText = total;
    floatBtn.style.display = 'block';
  } else if (floatBtn) {
    floatBtn.style.display = 'none';
  }
}

window.sendOrderToWhatsApp = function() {
  if (myOrderCart.length === 0) return;

  let msg = "Hello Ashapura Steel,\nI would like to order the following items:\n\n";
  myOrderCart.forEach((item, i) => {
    msg += `${i + 1}. ${item.title} - Qty: ${item.qty}\n`;
  });
  msg += "\nPlease let me know the total price and delivery details.";

  const waLink = `https://wa.me/916359063984?text=${encodeURIComponent(msg)}`;
  window.open(waLink, '_blank');
};