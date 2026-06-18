const products = [
  {
    id: "pearl-bloom-keychain",
    name: "Pearl Bloom Keychain",
    price: 1513,
    category: "keychain",
    colors: ["pink", "lilac", "mint", "yellow", "blue"],
    tag: "One of a kind",
    image: "assets/pearl-bloom-keychain.png",
    description: "A dreamy beaded keychain with pearl shine, colorful beads, flower details, and a silver clip for bags, keys, or gifting.",
  },
  {
    id: "strawberry-charm-keychain",
    name: "Strawberry Charm Keychain",
    price: 1799,
    category: "keychain",
    colors: ["pink", "yellow", "mint"],
    tag: "New arrival",
    image: "assets/strawberry-charm-keychain.jpg",
    description: "A playful strawberry charm keychain with glossy beads, tiny bows, hearts, and sweet fruit-shop energy.",
  },
  {
    id: "bow-web-bracelet-set",
    name: "Bow & Web Bracelet Set",
    price: 1299,
    category: "bracelet",
    colors: ["pink", "lilac"],
    tag: "Set of 2",
    image: "assets/bow-web-bracelet-set.jpg",
    description: "A two-piece bracelet set with soft pink beads, a bow charm, and a bold red-black web charm stack.",
  },
  {
    id: "rose-pearl-bracelet",
    name: "Rose Pearl Bracelet",
    price: 1199,
    category: "bracelet",
    colors: ["pink", "yellow"],
    tag: "Golden glow",
    image: "assets/rose-pearl-bracelet.jpg",
    description: "A rose-toned pearl bracelet with golden accents, glossy pink beads, and a warm handmade glow.",
  },
  {
    id: "cherry-heart-duo",
    name: "Cherry Heart Duo",
    price: 1499,
    category: "bracelet",
    colors: ["pink", "yellow", "mint"],
    tag: "Bracelet + charm",
    image: "assets/cherry-heart-duo.jpg",
    description: "A cherry-heart duo with a matching beaded bracelet, pearly details, red beads, and dangling charm sweetness.",
  },
  {
    id: "crystal-bow-pearl-bracelet",
    name: "Crystal Bow Pearl Bracelet",
    price: 1399,
    category: "bracelet",
    colors: ["yellow"],
    tag: "Pearl shine",
    image: "assets/crystal-bow-pearl-bracelet.jpg",
    description: "A pearly bracelet with crystal bow sparkle, soft gold tones, and an elegant fairy-light finish.",
  },
  {
    id: "black-bow-chain-necklace",
    name: "Black Bow Chain Necklace",
    price: 1699,
    category: "necklace",
    colors: ["yellow"],
    tag: "Necklace",
    image: "assets/black-bow-chain-necklace-1.jpg",
    images: ["assets/black-bow-chain-necklace-1.jpg", "assets/black-bow-chain-necklace-2.jpg"],
    description: "A layered chain necklace with black heart beads, pearl accents, and a glossy bow charm for a soft glam finish.",
  },
];

const wishlistStorageKey = "sereneJewelsWishlist";
const customerProfileStorageKey = "sereneJewelsCustomerProfile";

const state = {
  filter: "all",
  color: "all",
  sort: "featured",
  cart: [],
  wishlist: new Set(loadWishlist()),
  customerProfile: loadCustomerProfile(),
  checkoutStep: "cart",
  orderReference: "",
};

const grid = document.querySelector("#productGrid");
const filterSelect = document.querySelector("#filterSelect");
const sortSelect = document.querySelector("#sortSelect");
const cartCount = document.querySelector("#cartCount");
const wishCount = document.querySelector("#wishCount");
const miniCart = document.querySelector("#miniCart");
const favoritesDrawer = document.querySelector("#favoritesDrawer");
const accountDrawer = document.querySelector("#accountDrawer");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const favoriteItems = document.querySelector("#favoriteItems");
const cartTotal = document.querySelector("#cartTotal");
const toast = document.querySelector("#toast");
const accountLabel = document.querySelector("#accountLabel");
const accountForm = document.querySelector("#accountForm");
const accountStatus = document.querySelector("#accountStatus");
const logoutButton = document.querySelector("#logoutButton");
const feedbackForm = document.querySelector("#feedbackForm");
const feedbackList = document.querySelector("#feedbackList");
const feedbackStatus = document.querySelector("#feedbackStatus");
const customerInfoForm = document.querySelector("#customerInfoForm");
const customerInfoStatus = document.querySelector("#customerInfoStatus");
const paymentProofForm = document.querySelector("#paymentProofForm");
const paymentStatus = document.querySelector("#paymentStatus");
const orderRefDisplay = document.querySelector("#orderRefDisplay");
const confirmationOrderRef = document.querySelector("#confirmationOrderRef");
const confirmationMessage = document.querySelector("#confirmationMessage");
const upiPaymentBox = document.querySelector("#upiPaymentBox");
const upiPayButton = document.querySelector("#upiPayButton");
const upiQrLink = document.querySelector("#upiQrLink");
const upiIdField = document.querySelector("#upiIdField");
const detailImage = document.querySelector(".gallery-main");
const detailThumbs = document.querySelector(".gallery-thumbs");
const detailTitle = document.querySelector("#detailTitle");
const detailPrice = document.querySelector("#detailPrice");
const detailDescription = document.querySelector("#detailDescription");
const detailAddButton = document.querySelector("#detailAddButton");
let revealObserver;
const feedbackStorageKey = "sereneJewelsFeedback";
const orderEmail = "zamanyeasmin5@gmail.com";
const paymentUpiId = "zamanyeasmin5@oksbi";
let lastOrderMailto = "";

function loadWishlist() {
  try {
    const stored = JSON.parse(localStorage.getItem(wishlistStorageKey));
    return Array.isArray(stored) ? stored : [];
  } catch {
    localStorage.removeItem(wishlistStorageKey);
    return [];
  }
}

function loadCustomerProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(customerProfileStorageKey));
    return stored && typeof stored === "object" ? stored : null;
  } catch {
    localStorage.removeItem(customerProfileStorageKey);
    return null;
  }
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCartTotal() {
  const giftWrap = document.querySelector("#giftWrap").checked ? 378 : 0;
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0) + giftWrap;
}

function createOrderReference() {
  const now = new Date();
  const datePart = now
    .toISOString()
    .slice(2, 10)
    .replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SJ-${datePart}-${randomPart}`;
}

function ensureOrderReference() {
  if (!state.orderReference) {
    state.orderReference = createOrderReference();
  }

  orderRefDisplay.textContent = state.orderReference;
  confirmationOrderRef.textContent = state.orderReference;
  return state.orderReference;
}

function buildUpiPaymentUrl(total, customerName) {
  const orderReference = ensureOrderReference();
  const params = [
    ["pa", paymentUpiId],
    ["pn", "Serene Jewels"],
    ["cu", "INR"],
    ["tn", `Serene Jewels ${orderReference} - ${customerName || "Customer"}`],
  ];

  if (Number(total) > 0) {
    params.splice(2, 0, ["am", Number(total).toFixed(2)]);
    params.splice(4, 0, ["tr", orderReference]);
  }

  return `upi://pay?${params.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")}`;
}

function updatePaymentInstructions() {
  const customerName = customerInfoForm.elements.customerName?.value.trim() || "Customer";
  const total = getCartTotal();
  const upiUrl = buildUpiPaymentUrl(total, customerName);

  upiPaymentBox.hidden = false;
  upiPayButton.href = upiUrl;
  upiQrLink.href = upiUrl;
}

function setCheckoutStep(step) {
  state.checkoutStep = step;
  document.querySelectorAll("[data-checkout-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.checkoutPanel === step);
  });
  document.querySelectorAll("[data-checkout-step]").forEach((item) => {
    item.classList.toggle("active", item.dataset.checkoutStep === step);
  });
  miniCart.scrollTo({ top: 0, behavior: "smooth" });
}

async function copyUpiId() {
  try {
    await navigator.clipboard.writeText(paymentUpiId);
    showToast("UPI ID copied.");
  } catch {
    upiIdField.select();
    document.execCommand("copy");
    showToast("UPI ID copied.");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function getFeedback() {
  try {
    const stored = JSON.parse(localStorage.getItem(feedbackStorageKey));
    if (Array.isArray(stored)) {
      const cleaned = stored.filter(
        (item) => !(item?.name === "Aanya" && item?.message === "So pretty and light. The colors look even cuter on my bag.")
      );
      if (cleaned.length !== stored.length) {
        saveFeedback(cleaned);
      }
      return cleaned;
    }
  } catch {
    localStorage.removeItem(feedbackStorageKey);
  }

  return [];
}

function saveFeedback(items) {
  localStorage.setItem(feedbackStorageKey, JSON.stringify(items.slice(0, 6)));
}

function saveWishlist() {
  localStorage.setItem(wishlistStorageKey, JSON.stringify([...state.wishlist]));
}

function getProfileFromForm(form) {
  const formData = new FormData(form);
  return {
    customerName: String(formData.get("customerName") || "").trim(),
    customerEmail: String(formData.get("customerEmail") || "").trim(),
    customerState: String(formData.get("customerState") || "").trim(),
    customerArea: String(formData.get("customerArea") || "").trim(),
    customerAddress: String(formData.get("customerAddress") || "").trim(),
  };
}

function fillFormFromProfile(form, profile) {
  if (!profile) {
    return;
  }

  Object.entries(profile).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) {
      field.value = value;
    }
  });
}

function saveCustomerProfile(profile) {
  state.customerProfile = profile;
  localStorage.setItem(customerProfileStorageKey, JSON.stringify(profile));
  updateAccountUI();
  fillFormFromProfile(customerInfoForm, profile);
}

function updateAccountUI() {
  if (state.customerProfile?.customerName) {
    const firstName = state.customerProfile.customerName.split(" ")[0];
    accountLabel.textContent = `Hi, ${firstName}`;
  } else {
    accountLabel.textContent = "Login";
  }
}

function renderFeedback() {
  const items = getFeedback();
  if (!items.length) {
    feedbackList.innerHTML = `<p class="empty-feedback">No feedback yet. Be the first to leave one.</p>`;
    return;
  }

  feedbackList.innerHTML = items
    .map((item) => {
      const rating = Math.max(1, Math.min(Number(item.rating) || 5, 5));
      const stars = "&#9733;".repeat(rating) + "&#9734;".repeat(5 - rating);
      return `
        <article class="feedback-card">
          <header>
            <strong>${escapeHtml(item.name)}</strong>
            <span class="feedback-stars" aria-label="${rating} out of 5 stars">${stars}</span>
          </header>
          <p>${escapeHtml(item.message)}</p>
        </article>
      `;
    })
    .join("");
  queueRevealAnimations(feedbackList.querySelectorAll(".feedback-card"));
}

function getVisibleProducts() {
  let visible = products.filter((product) => {
    const categoryMatch = state.filter === "all" || product.category === state.filter;
    const colorMatch = state.color === "all" || product.colors.includes(state.color);
    return categoryMatch && colorMatch;
  });

  if (state.sort === "low") {
    visible = [...visible].sort((a, b) => a.price - b.price);
  }

  if (state.sort === "high") {
    visible = [...visible].sort((a, b) => b.price - a.price);
  }

  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();
  grid.innerHTML = visible
    .map(
      (product) => `
        <article class="product-card" data-view-id="${product.id}" tabindex="0" role="button" aria-label="View ${product.name}">
          <button class="icon-button wish" type="button" data-wish-id="${product.id}" aria-label="Save ${product.name}">
            ${state.wishlist.has(product.id) ? "&#9829;" : "&#9825;"}
          </button>
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <div class="product-info">
            <span class="tag">${product.tag}</span>
            <div class="product-meta">
              <h3>${product.name}</h3>
              <strong>${money(product.price)}</strong>
            </div>
            <button class="button button-primary quick-add" type="button" data-add-id="${product.id}">Quick add</button>
          </div>
        </article>
      `
    )
    .join("");

  if (!visible.length) {
    grid.innerHTML = `<p>No jewels in that mix yet. Try another color!</p>`;
  }

  queueRevealAnimations(grid.querySelectorAll(".product-card"));
}

function addToCart(id, customName) {
  const product = products.find((item) => item.id === id) || {
    id,
    name: customName || "Custom Serene Bracelet",
    price: 2080,
  };
  const existing = state.cart.find((item) => item.id === product.id && item.name === product.name);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }

  updateCart();
  showToast(`${product.name} added. Cute choice.`);
  openCart();
}

function selectProduct(id, shouldScroll = true) {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const productImages = product.images || [product.image];
  detailImage.src = productImages[0];
  detailImage.alt = `${product.name} product photo`;
  detailThumbs.innerHTML = productImages
    .map((image, index) => `<img src="${image}" alt="${product.name} product photo ${index + 1}" data-detail-image="${image}" />`)
    .join("");
  detailTitle.textContent = product.name;
  detailPrice.textContent = money(product.price);
  detailDescription.textContent = product.description;
  detailAddButton.dataset.addId = product.id;
  document.querySelector("#product").classList.add("is-visible");

  if (shouldScroll) {
    smoothScrollTo(document.querySelector("#product"));
  }
}

function updateWishlist() {
  wishCount.textContent = state.wishlist.size;
  saveWishlist();
  renderFavorites();
}

function renderFavorites() {
  const likedProducts = products.filter((product) => state.wishlist.has(product.id));

  if (!likedProducts.length) {
    favoriteItems.innerHTML = `<p>No favorites yet. Tap the heart on a product to save it here.</p>`;
    return;
  }

  favoriteItems.innerHTML = likedProducts
    .map(
      (product) => `
        <div class="drawer-item favorite-item">
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <strong>${product.name}</strong>
            <p>${money(product.price)}</p>
            <div class="favorite-actions">
              <button type="button" data-add-id="${product.id}">Add to Bag</button>
              <button type="button" data-remove-wish-id="${product.id}" aria-label="Remove ${product.name} from favorites">Remove</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function updateCart() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;

  if (!state.cart.length) {
    cartItems.innerHTML = `<p>Your cart's feeling a little un-stacked. Let's fix that.</p>`;
  } else {
    cartItems.innerHTML = state.cart
      .map(
        (item) => `
          <div class="drawer-item">
            <div>
              <strong>${item.name}</strong>
              <p>${item.qty} &times; ${money(item.price)}</p>
            </div>
            <button type="button" data-remove-id="${item.id}" aria-label="Remove ${item.name}">Remove</button>
          </div>
        `
      )
      .join("");
  }

  cartTotal.textContent = money(getCartTotal());
  updatePaymentInstructions();
}

function buildOrderEmail(formData, paymentData) {
  const giftWrap = document.querySelector("#giftWrap").checked;
  const giftNote = document.querySelector("#giftNote").value.trim();
  const giftWrapPrice = giftWrap ? 378 : 0;
  const total = getCartTotal();
  const transactionId = String(paymentData.get("transactionId") || "").trim();
  const screenshot = paymentData.get("paymentScreenshot");
  const screenshotName = screenshot && screenshot.name ? screenshot.name : "Not selected";
  const orderLines = state.cart
    .map((item) => `- ${item.name} x ${item.qty}: ${money(item.price * item.qty)}`)
    .join("\n");

  return [
    "New Serene Jewels order placed",
    `Order reference: ${ensureOrderReference()}`,
    "",
    "Customer information:",
    `Name: ${String(formData.get("customerName") || "").trim()}`,
    `Email: ${String(formData.get("customerEmail") || "").trim()}`,
    `State: ${String(formData.get("customerState") || "").trim()}`,
    `Area / city: ${String(formData.get("customerArea") || "").trim()}`,
    `Address / landmark: ${String(formData.get("customerAddress") || "").trim()}`,
    "",
    "Payment verification:",
    "Payment method: UPI",
    `Payment UPI ID: ${paymentUpiId}`,
    `Transaction ID: ${transactionId}`,
    `Payment screenshot file: ${screenshotName}`,
    "",
    "Order:",
    orderLines,
    `Gift wrap: ${giftWrap ? `Yes (${money(giftWrapPrice)})` : "No"}`,
    `Gift note: ${giftNote || "None"}`,
    "",
    `Total: ${money(total)}`,
  ].join("\n");
}

function openCart() {
  closeFavorites();
  closeAccount();
  fillFormFromProfile(customerInfoForm, state.customerProfile);
  ensureOrderReference();
  setCheckoutStep("cart");
  miniCart.classList.add("open");
  miniCart.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
}

function closeCart() {
  miniCart.classList.remove("open");
  miniCart.setAttribute("aria-hidden", "true");
  if (!favoritesDrawer.classList.contains("open") && !accountDrawer.classList.contains("open")) {
    overlay.classList.remove("open");
  }
}

function openFavorites() {
  closeCart();
  closeAccount();
  renderFavorites();
  favoritesDrawer.classList.add("open");
  favoritesDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
}

function closeFavorites() {
  favoritesDrawer.classList.remove("open");
  favoritesDrawer.setAttribute("aria-hidden", "true");
  if (!miniCart.classList.contains("open") && !accountDrawer.classList.contains("open")) {
    overlay.classList.remove("open");
  }
}

function openAccount() {
  closeCart();
  closeFavorites();
  fillFormFromProfile(accountForm, state.customerProfile);
  accountStatus.textContent = state.customerProfile ? "Welcome back. Your details are remembered." : "";
  accountDrawer.classList.add("open");
  accountDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
}

function closeAccount() {
  accountDrawer.classList.remove("open");
  accountDrawer.setAttribute("aria-hidden", "true");
  if (!miniCart.classList.contains("open") && !favoritesDrawer.classList.contains("open")) {
    overlay.classList.remove("open");
  }
}

function queueRevealAnimations(elements) {
  if (!revealObserver) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  elements.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
    revealObserver.observe(element);
  });
}

function initScrollAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(
    ".section, .detail-band, .feedback-card, .gallery, .product-panel, .hero-copy, .hero-art"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  queueRevealAnimations(targets);
}

function smoothScrollTo(target) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  const headerOffset = 92;
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  const distance = end - start;
  const duration = 850;
  let startTime;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function playSelectionPop(event) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const target = event.target.closest(
    "button, .button, .product-card, .drawer-item, .swatch, select, input[type='checkbox'], input[type='radio']"
  );

  if (!target || target === overlay) {
    return;
  }

  target.classList.remove("is-popping");
  void target.offsetWidth;
  target.classList.add("is-popping");
  target.addEventListener("animationend", () => target.classList.remove("is-popping"), { once: true });

  const rect = target.getBoundingClientRect();
  const popX = event.clientX || rect.left + rect.width / 2;
  const popY = event.clientY || rect.top + rect.height / 2;
  const pop = document.createElement("span");
  pop.className = "click-pop";
  pop.style.setProperty("--pop-x", `${popX}px`);
  pop.style.setProperty("--pop-y", `${popY}px`);
  document.body.append(pop);
  pop.addEventListener("animationend", () => pop.remove(), { once: true });
}

document.addEventListener("click", (event) => {
  playSelectionPop(event);

  const addButton = event.target.closest("[data-add-id]");
  if (addButton) {
    addToCart(addButton.dataset.addId);
    return;
  }

  const wishButton = event.target.closest("[data-wish-id]");
  if (wishButton) {
    const id = wishButton.dataset.wishId;
    if (state.wishlist.has(id)) {
      state.wishlist.delete(id);
      showToast("Removed from favorites.");
    } else {
      state.wishlist.add(id);
      showToast("Saved to favorites.");
    }
    updateWishlist();
    renderProducts();
    return;
  }

  const removeWishButton = event.target.closest("[data-remove-wish-id]");
  if (removeWishButton) {
    state.wishlist.delete(removeWishButton.dataset.removeWishId);
    updateWishlist();
    renderProducts();
    showToast("Removed from favorites.");
    return;
  }

  const removeButton = event.target.closest("[data-remove-id]");
  if (removeButton) {
    const id = removeButton.dataset.removeId;
    const item = state.cart.find((cartItem) => cartItem.id === id);
    if (item && item.qty > 1) {
      item.qty -= 1;
    } else {
      state.cart = state.cart.filter((cartItem) => cartItem.id !== id);
    }
    updateCart();
    return;
  }

  if (event.target.closest("[data-open-cart]")) {
    openCart();
    return;
  }

  if (event.target.closest("[data-open-account]")) {
    openAccount();
    return;
  }

  if (event.target.closest("[data-close-cart]") || event.target === overlay) {
    closeCart();
  }

  if (event.target.closest("[data-close-favorites]") || event.target === overlay) {
    closeFavorites();
  }

  if (event.target.closest("[data-close-account]") || event.target === overlay) {
    closeAccount();
  }

  if (event.target.closest("[data-open-wishlist]")) {
    openFavorites();
    return;
  }

  if (event.target.matches(".swatch")) {
    document.querySelectorAll(".swatch").forEach((button) => button.classList.remove("active"));
    event.target.classList.add("active");
    state.color = event.target.dataset.color;
    renderProducts();
    return;
  }

  const detailThumb = event.target.closest("[data-detail-image]");
  if (detailThumb) {
    detailImage.src = detailThumb.dataset.detailImage;
    detailImage.alt = detailThumb.alt;
    return;
  }

  const productCard = event.target.closest("[data-view-id]");
  if (productCard) {
    selectProduct(productCard.dataset.viewId);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const productCard = event.target.closest("[data-view-id]");
  if (!productCard) {
    return;
  }

  event.preventDefault();
  selectProduct(productCard.dataset.viewId);
});

filterSelect.addEventListener("change", (event) => {
  state.filter = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!accountForm.reportValidity()) {
    return;
  }

  const profile = getProfileFromForm(accountForm);
  saveCustomerProfile(profile);
  accountStatus.textContent = "Saved. We will remember you next time.";
  showToast(`Welcome, ${profile.customerName.split(" ")[0]}!`);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(customerProfileStorageKey);
  state.customerProfile = null;
  accountForm.reset();
  customerInfoForm.reset();
  updateAccountUI();
  accountStatus.textContent = "Saved login removed from this browser.";
  showToast("Login details forgotten.");
});

document.querySelector("#giftWrap").addEventListener("change", updateCart);

document.querySelector("#cartNextButton").addEventListener("click", () => {
  if (!state.cart.length) {
    showToast("Add a jewel first!");
    return;
  }

  ensureOrderReference();
  setCheckoutStep("details");
});

document.querySelector("#orderBackButton").addEventListener("click", () => {
  setCheckoutStep("cart");
});

customerInfoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!customerInfoForm.reportValidity()) {
    customerInfoStatus.textContent = "Please fill in your delivery information.";
    showToast("Add your customer information first.");
    return;
  }

  saveCustomerProfile(getProfileFromForm(customerInfoForm));
  ensureOrderReference();
  updatePaymentInstructions();
  customerInfoStatus.textContent = "";
  setCheckoutStep("payment");
});

document.querySelector("#copyUpiButton").addEventListener("click", copyUpiId);

document.querySelector("#paymentBackButton").addEventListener("click", () => {
  setCheckoutStep("details");
});

paymentProofForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!paymentProofForm.reportValidity()) {
    paymentStatus.textContent = "Please choose a payment method, add the transaction ID, and select a screenshot.";
    showToast("Payment proof is required.");
    return;
  }

  const formData = new FormData(customerInfoForm);
  const paymentData = new FormData(paymentProofForm);
  const customerName = String(formData.get("customerName") || "").trim();
  const subject = `Payment proof - ${ensureOrderReference()} - ${customerName}`;
  const body = buildOrderEmail(formData, paymentData);
  lastOrderMailto = `mailto:${orderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  confirmationMessage.textContent = `Thank you, ${customerName}. Your payment proof is ready to send for verification before dispatch.`;
  paymentStatus.textContent = "";
  setCheckoutStep("confirmation");
  showToast("Payment proof added.");
});

document.querySelector("#emailOrderButton").addEventListener("click", () => {
  if (!lastOrderMailto) {
    showToast("Add payment proof first.");
    return;
  }

  window.location.href = lastOrderMailto;
  showToast("Order email ready.");
});

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(feedbackForm);
  const item = {
    name: String(formData.get("name") || "").trim(),
    rating: Number(formData.get("rating") || 5),
    message: String(formData.get("message") || "").trim(),
  };

  if (!item.name || !item.message) {
    feedbackStatus.textContent = "Please add your name and feedback.";
    return;
  }

  const items = [item, ...getFeedback()];
  saveFeedback(items);
  renderFeedback();
  feedbackForm.reset();
  feedbackStatus.textContent = "Thank you! Your feedback is glowing.";
  showToast("Feedback added. Thank you!");
});

document.querySelector("#zoomButton").addEventListener("click", () => {
  document.querySelector(".gallery-main").classList.toggle("zoomed");
});

document.querySelector(".nav-toggle").addEventListener("click", (event) => {
  const links = document.querySelector("#navLinks");
  const isOpen = links.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});

document.querySelector("#navLinks").addEventListener("click", (event) => {
  const link = event.target.closest("a[href^='#']");
  if (!link) {
    return;
  }

  const target = document.querySelector(link.getAttribute("href"));
  if (!target) {
    return;
  }

  event.preventDefault();

  smoothScrollTo(target);
  history.pushState(null, "", link.getAttribute("href"));

  const links = document.querySelector("#navLinks");
  const toggle = document.querySelector(".nav-toggle");
  links.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
});

initScrollAnimations();
renderProducts();
renderFeedback();
updateWishlist();
updateAccountUI();
fillFormFromProfile(customerInfoForm, state.customerProfile);
updateCart();
