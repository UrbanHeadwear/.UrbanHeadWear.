<script>
// ------------------- Données produit -------------------
const products = [
  {
    id: 1,
    name: "Bob Beige Urban",
    price: 20,
    description: "Ce bob beige allie style minimaliste et confort optimal pour vos sorties estivales. Tissu doux et léger, il s'adapte à toutes les têtes.",
    image: "https://i.imgur.com/kR2dkvx.png",
    stars: 4.5,
    comments: ["Parfait pour l'été !", "Très confortable."]
  },
  {
    id: 2,
    name: "Lunettes Aviateur Noires",
    price: 30,
    description: "Inspirées des classiques de l'aviation, ces lunettes noir mat offrent une vision claire tout en ajoutant une touche moderne à votre style.",
    image: "https://i.imgur.com/J8WzFv2.png",
    stars: 5,
    comments: ["Incroyable style !", "Bonne qualité."]
  }
];

let cart = [];

// ------------------- Navigation -------------------
function navigateTo(pageId) {
  const sections = document.querySelectorAll("section");
  sections.forEach(section => section.style.display = "none");
  document.getElementById(pageId).style.display = pageId === "home" ? "flex" : "block";
}

function goHome() {
  navigateTo("home");
}

function showProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  const searchBar = `<input type='text' id='search' placeholder='Rechercher un produit...' oninput='searchProduct()' style='width:100%; padding:10px; margin-bottom:20px; font-size:16px;'>`;
  container.innerHTML += searchBar;

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.price} €</p>
      <div class="product-description">${product.description.slice(0, 50)}...</div>
      <button onclick="openProduct(${product.id})">Voir</button>
    `;
    container.appendChild(div);
  });

  navigateTo("products");
}

function searchProduct() {
  const term = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  const container = document.getElementById("products");
  container.innerHTML = `<input type='text' id='search' placeholder='Rechercher un produit...' oninput='searchProduct()' style='width:100%; padding:10px; margin-bottom:20px; font-size:16px;'>`;

  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.price} €</p>
      <div class="product-description">${product.description.slice(0, 50)}...</div>
      <button onclick="openProduct(${product.id})">Voir</button>
    `;
    container.appendChild(div);
  });
}

// ------------------- Produit détaillé -------------------
function openProduct(productId) {
  const product = products.find(p => p.id === productId);
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(255,255,255,0.95)";
  overlay.style.zIndex = "999";
  overlay.style.overflowY = "scroll";
  overlay.innerHTML = `
    <div style="padding:40px; max-width:600px; margin:auto;">
      <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:10px;">
      <h2>${product.name}</h2>
      <p>${product.price} €</p>
      <input type='number' id='qty-${product.id}' value='1' min='1' max='30' style='padding:10px; width:80px;'>
      <p style="margin: 20px 0">${product.description}</p>
      <div>${'★'.repeat(Math.floor(product.stars)) + '☆'.repeat(5 - Math.floor(product.stars))}</div>
      <ul>${product.comments.map(c => `<li>${c}</li>`).join('')}</ul>
      <button onclick='addToCart(${product.id}, true)'>Ajouter au panier</button>
      <button onclick='this.parentElement.parentElement.remove()' style='margin-left:20px;'>Fermer</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ------------------- Ajout au panier -------------------
function addToCart(productId, fromOverlay = false) {
  const product = products.find(p => p.id === productId);
  const qtyInput = document.getElementById(`qty-${product.id}`);
  const qty = qtyInput ? parseInt(qtyInput.value) : 1;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    if (existing.qty + qty > 30) return alert("Stock max atteint !");
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  if (fromOverlay) {
    document.querySelector(".overlay").remove();
    showPopup();
  }
}

// ------------------- Popup confirmation -------------------
function showPopup() {
  const blur = document.createElement("div");
  blur.style.position = "fixed";
  blur.style.top = "0";
  blur.style.left = "0";
  blur.style.width = "100%";
  blur.style.height = "100%";
  blur.style.backdropFilter = "blur(5px)";
  blur.style.zIndex = "1000";
  blur.style.display = "flex";
  blur.style.justifyContent = "center";
  blur.style.alignItems = "center";

  blur.innerHTML = `
    <div style='background:#fff; padding:30px; border-radius:10px; text-align:center; position:relative;'>
      <div style='animation: spin 1s linear infinite; font-size:30px;'>⚙️</div>
      <p>Produit ajouté au panier !</p>
      <button onclick='document.body.removeChild(this.closest("div"))'>Continuer mes achats</button>
      <button onclick='document.body.removeChild(this.closest("div")); showCart();' style='margin-left:20px;'>Finaliser mes achats</button>
    </div>
  `;

  document.body.appendChild(blur);
}

// ------------------- Panier -------------------
function showCart() {
  const container = document.getElementById("cart");
  container.innerHTML = "<h2>Votre panier</h2>";
  let total = 0;

  cart.forEach(item => {
    total += item.qty * item.price;
    container.innerHTML += `
      <div class="cart-item">
        <span>${item.name} x${item.qty}</span>
        <span>${item.qty * item.price} €</span>
      </div>`;
  });

  container.innerHTML += `<h3>Total : ${total} €</h3>
    <button onclick='showProducts()'>Continuer mes achats</button>
    <button onclick='showCheckout()'>Terminer mes achats</button>`;
  navigateTo("cart");
}

// ------------------- Checkout -------------------
function showCheckout() {
  navigateTo("checkout");
}

function finalizeCheckout() {
  navigateTo("recapitulatif");
  const recap = document.getElementById("recapitulatif");
  let total = 0;

  recap.innerHTML = "<h2>Récapitulatif de votre commande</h2>";
  cart.forEach(item => {
    total += item.qty * item.price;
    recap.innerHTML += `<div>${item.name} - ${item.qty} x ${item.price}€ = ${item.qty * item.price}€</div>`;
  });

  // Livraison aléatoire payante ou non
  const deliveryType = Math.random() < 0.5 ? "domicile" : "point relais";
  const livraisonPayante = deliveryType === "domicile" && Math.random() < 0.5;
  if (livraisonPayante) {
    recap.innerHTML += `<div>Frais de livraison à domicile : 20€</div>`;
    total += 20;
  } else {
    recap.innerHTML += `<div>Livraison gratuite en ${deliveryType}</div>`;
  }

  recap.innerHTML += `<h3>Total à payer : ${total} €</h3>`;
}

document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();
  finalizeCheckout();
});
</script>