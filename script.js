/* =========================================================
   ÉLANÉ — JAVASCRIPT
========================================================= */


/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [

    {
        id: 1,
        name: "Sienna Dress",
        category: "women",
        type: "Dress",
        price: 4990,
        color: "Ivory",
        image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
        secondImage:
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 2,
        name: "Mira Shirt",
        category: "women",
        type: "Shirt",
        price: 3490,
        color: "White",
        image:
            "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=900&q=85",
        secondImage:
            "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 3,
        name: "Elara Blazer",
        category: "women",
        type: "Blazer",
        price: 5990,
        color: "Mocha",
        image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
        secondImage:
            "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 4,
        name: "Noa Trouser",
        category: "men",
        type: "Trousers",
        price: 3990,
        color: "Charcoal",
        image:
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85",
        secondImage:
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 5,
        name: "Ava Shoulder Bag",
        category: "accessories",
        type: "Bag",
        price: 4490,
        color: "Tan",
        image:
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
        secondImage:
            "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 6,
        name: "Luna Knit",
        category: "women",
        type: "Knitwear",
        price: 3290,
        color: "Sand",
        image:
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85",
        secondImage:
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85"
    }

];


/* =========================================================
   STATE
========================================================= */

let cart = JSON.parse(localStorage.getItem("elaneCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("elaneWishlist")) || [];

let currentFilter = "all";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productGrid =
    document.getElementById("productGrid");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const toast =
    document.getElementById("toast");

const shippingMessage =
    document.getElementById("shippingMessage");


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(filter = currentFilter) {

    currentFilter = filter;

    let filteredProducts = products;

    if (filter !== "all") {

        filteredProducts =
            products.filter(
                product => product.category === filter
            );

    }

    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `
            <div class="no-products">
                No products found in this collection.
            </div>
        `;

        return;

    }


    productGrid.innerHTML =
        filteredProducts.map(product => {

            const isWishlisted =
                wishlist.includes(product.id);

            return `

                <article class="product-card">

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                        <img
                            class="second-image"
                            src="${product.secondImage}"
                            alt="${product.name} alternate view"
                        >

                        <button
                            class="wishlist ${isWishlisted ? "active" : ""}"
                            onclick="toggleWishlist(${product.id})"
                            aria-label="Add to wishlist"
                        >
                            ${isWishlisted ? "♥" : "♡"}
                        </button>

                        <button
                            class="quick-add"
                            onclick="addToCart(${product.id})"
                        >
                            QUICK ADD
                        </button>

                    </div>

                    <div class="product-info">

                        <p class="product-category">
                            ${product.type}
                        </p>

                        <h3 class="product-name">
                            ${product.name}
                        </h3>

                        <p class="product-price">
                            ${formatPrice(product.price)}
                        </p>

                    </div>

                </article>

            `;

        }).join("");

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".filter")
            .forEach(btn =>
                btn.classList.remove("active")
            );

        button.classList.add("active");

        renderProducts(button.dataset.filter);

    });

});


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

    const existing =
        cart.find(item => item.id === productId);

    if (existing) {

        existing.quantity++;

    } else {

        const product =
            products.find(item => item.id === productId);

        cart.push({
            id: product.id,
            quantity: 1
        });

    }

    saveCart();

    updateCart();

    showToast("Added to your bag");

    openCart();

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "elaneCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div>
                    <h3>Your bag is empty.</h3>
                    <p>Discover something you'll love.</p>
                </div>
            </div>
        `;

    } else {

        cart.forEach(item => {

            const product =
                products.find(p => p.id === item.id);

            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `

                <img
                    class="cart-item-image"
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="cart-item-info">

                    <h4>
                        ${product.name}
                    </h4>

                    <p>
                        ${product.color} / One Size
                    </p>

                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${product.id}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${product.id}, 1)"
                        >
                            +
                        </button>

                    </div>

                    <div class="cart-item-price">
                        ${formatPrice(product.price * item.quantity)}
                    </div>

                </div>

                <button
                    class="remove-item"
                    onclick="removeFromCart(${product.id})"
                    aria-label="Remove item"
                >
                    ×
                </button>

            `;

            cartItems.appendChild(cartItem);

        });

    }


    const total =
        cart.reduce((sum, item) => {

            const product =
                products.find(p => p.id === item.id);

            return sum +
                product.price * item.quantity;

        }, 0);


    const itemCount =
        cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );


    cartTotal.textContent =
        formatPrice(total);

    cartCount.textContent =
        itemCount;


    const remaining = 5000 - total;

    if (total === 0) {

        shippingMessage.textContent =
            "Add products to your bag.";

    } else if (remaining > 0) {

        shippingMessage.textContent =
            `You're ${formatPrice(remaining)} away from complimentary shipping.`;

    } else {

        shippingMessage.textContent =
            "You qualify for complimentary shipping.";

    }

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(productId, amount) {

    const item =
        cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== productId);

    }

    saveCart();

    updateCart();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {

    cart =
        cart.filter(item => item.id !== productId);

    saveCart();

    updateCart();

    showToast("Removed from your bag");

}


/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart() {

    cartDrawer.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

}


function closeCart() {

    cartDrawer.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


document
    .getElementById("cartBtn")
    .addEventListener("click", openCart);


document
    .getElementById("closeCart")
    .addEventListener("click", closeCart);


cartOverlay.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist(productId) {

    if (wishlist.includes(productId)) {

        wishlist =
            wishlist.filter(id => id !== productId);

        showToast("Removed from wishlist");

    } else {

        wishlist.push(productId);

        showToast("Added to wishlist");

    }

    localStorage.setItem(
        "elaneWishlist",
        JSON.stringify(wishlist)
    );

    wishlistCount.textContent =
        wishlist.length;

    renderProducts();

}


/* =========================================================
   WISHLIST BUTTON
========================================================= */

document
    .getElementById("wishlistBtn")
    .addEventListener("click", () => {

        if (wishlist.length === 0) {

            showToast("Your wishlist is empty");

            return;

        }

        const wishlistProducts =
            products.filter(product =>
                wishlist.includes(product.id)
            );

        productGrid.innerHTML =
            wishlistProducts.map(product => {

                return `

                    <article class="product-card">

                        <div class="product-image">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                            <button
                                class="wishlist active"
                                onclick="toggleWishlist(${product.id})"
                            >
                                ♥
                            </button>

                            <button
                                class="quick-add"
                                onclick="addToCart(${product.id})"
                            >
                                QUICK ADD
                            </button>

                        </div>

                        <div class="product-info">

                            <p class="product-category">
                                ${product.type}
                            </p>

                            <h3 class="product-name">
                                ${product.name}
                            </h3>

                            <p class="product-price">
                                ${formatPrice(product.price)}
                            </p>

                        </div>

                    </article>

                `;

            }).join("");

        document
            .getElementById("shop")
            .scrollIntoView({
                behavior: "smooth"
            });

    });


/* =========================================================
   SEARCH
========================================================= */

const searchOverlay =
    document.getElementById("searchOverlay");

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");


document
    .getElementById("searchBtn")
    .addEventListener("click", () => {

        searchOverlay.classList.add("active");

        document.body.classList.add("no-scroll");

        setTimeout(() => {
            searchInput.focus();
        }, 300);

    });


document
    .getElementById("closeSearch")
    .addEventListener("click", closeSearch);


function closeSearch() {

    searchOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

    searchInput.value = "";

    searchResults.innerHTML = "";

}


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value.toLowerCase().trim();

        if (!query) {

            searchResults.innerHTML = "";

            return;

        }

        const results =
            products.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(query)

                ||

                product.type
                    .toLowerCase()
                    .includes(query)

                ||

                product.category
                    .toLowerCase()
                    .includes(query)

            );


        if (results.length === 0) {

            searchResults.innerHTML =
                `<p>No products found.</p>`;

            return;

        }


        searchResults.innerHTML =
            results.map(product => `

                <div
                    class="search-result"
                    onclick="selectSearchProduct(${product.id})"
                >

                    <span>
                        ${product.name}
                    </span>

                    <span>
                        ${formatPrice(product.price)}
                    </span>

                </div>

            `).join("");

    }
);


function selectSearchProduct(productId) {

    closeSearch();

    renderProducts(
        products.find(p => p.id === productId).category
    );

    document
        .getElementById("shop")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn =
    document.getElementById("menuBtn");

const nav =
    document.getElementById("nav");


menuBtn.addEventListener("click", () => {

    nav.classList.toggle("active");

});


document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});


/* =========================================================
   HEADER SCROLL
========================================================= */

const header =
    document.getElementById("header");


window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* =========================================================
   MOOD FILTERS
========================================================= */

document.querySelectorAll(".mood-card").forEach(card => {

    card.addEventListener("click", () => {

        const mood =
            card.dataset.mood;

        document
            .querySelectorAll(".filter")
            .forEach(btn => {

                btn.classList.remove("active");

                if (btn.dataset.filter === mood) {
                    btn.classList.add("active");
                }

            });

        renderProducts(mood);

        document
            .getElementById("shop")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* =========================================================
   NEWSLETTER
========================================================= */

document
    .getElementById("newsletterForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        if (!email) return;

        document
            .getElementById("newsletterMessage")
            .textContent =
            "Welcome to the ÉLANÉ edit.";

        document
            .getElementById("newsletterForm")
            .reset();

    });


/* =========================================================
   CHECKOUT
========================================================= */

document
    .getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            showToast("Your bag is empty");

            return;

        }

        alert(
            "Checkout demo — this is a portfolio project. No real payment will be processed."
        );

    });


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


document
    .querySelectorAll(".reveal")
    .forEach(element => {

        revealObserver.observe(element);

    });


/* =========================================================
   INITIALIZE
========================================================= */

renderProducts();

updateCart();

wishlistCount.textContent =
    wishlist.length;