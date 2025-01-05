import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

function renderRestaurantInfo() {
    const restaurantInfo = JSON.parse(localStorage.getItem('selectedRestaurant'));
    if (restaurantInfo) {
        const { name, kitchen, stars, price } = restaurantInfo;
        const restaurantHeader = document.querySelector('.section-heading');

        restaurantHeader.innerHTML = `
            <h2 class="section-title restaurant-title">${name}</h2>
            <div class="card-info">
                <div class="rating">${stars}</div>
                <div class="price">Від ${price}</div>
                <div class="category">${kitchen}</div>
            </div>
        `;
    }
}

const getData = async function (url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Помилка за адресою ${url},
        статус помилки ${response.status}`);
    }
    return await response.json();
};

function renderMenu() {
    const restaurantInfo = JSON.parse(localStorage.getItem('selectedRestaurant'));

    if (restaurantInfo) {
        const productsFile = restaurantInfo.products;
        const menuContainer = document.querySelector('.cards-menu');

        getData(`./db/${productsFile}`).then((menuItems) => {
            menuContainer.innerHTML = "";

            menuItems.forEach(({ name, description, price, image }) => {
                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
                    <img src="${image}" alt="image" class="card-image" />
                    <div class="card-text">
                        <div class="card-heading">
                            <h3 class="card-title card-title-reg">${name}</h3>
                        </div>
                        <div class="card-info">
                            <div class="ingredients">${description}</div>
                        </div>
                        <div class="card-buttons">
                            <button class="button button-primary button-add-cart">
                                <span class="button-card-text">У кошик</span>
                                <span class="button-cart-svg"></span>
                            </button>
                            <strong class="card-price-bold">${price} ₴</strong>
                        </div>
                    </div>
                `;

                const addToCartButton = card.querySelector('.button-add-cart');
                addToCartButton.addEventListener('click', () => addToCart({ name, description, price, image }));

                menuContainer.appendChild(card);
            });
        }).catch((error) => {
            console.error("Помилка завантаження меню:", error);
            menuContainer.innerHTML = '<p>Не вдалося завантажити меню.</p>';
        });
    }
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
}

function renderCart() {
    const cartModal = document.querySelector('.modal-cart');
    const cartItemsContainer = cartModal.querySelector('.modal-body');
    const cartFooter = cartModal.querySelector('.modal-footer');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Кошик порожній</p>';
        cartFooter.style.display = 'none';
    } else {
        cart.forEach(({ name, price, quantity, image }) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('food-row');

            cartItem.innerHTML = `
                <span class="food-name">${name}</span>
				<strong class="food-price">${price} ₴</strong>
				<div class="food-counter">
					<button class="counter-button decrease">-</button>
					<span class="counter quantity">${quantity}</span>
					<button class="counter-button increase">+</button>
				</div>
            `;

            cartFooter.style.display = 'flex';
            const decreaseButton = cartItem.querySelector('.decrease');
            const increaseButton = cartItem.querySelector('.increase');

            decreaseButton.addEventListener('click', () => updateCartQuantity(name, -1));
            increaseButton.addEventListener('click', () => updateCartQuantity(name, 1));

            cartItemsContainer.appendChild(cartItem);
        });

        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartModal.querySelector('.modal-pricetag').textContent = `Сума: ${totalAmount} ₴`;
    }
}

function updateCartQuantity(itemName, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(cartItem => cartItem.name === itemName);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.name !== itemName);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    renderCart();
}

function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.button-cart-svg');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartIcon.textContent = totalItems > 0 ? totalItems : '';
}

function saveOrderToDatabase(order) {
    const db = getDatabase(); 
    const ordersRef = ref(db, 'orders'); 

    return push(ordersRef, order)
        .then(() => {
            console.log('Замовлення збережено');
        })
        .catch((error) => {
            console.error('Помилка при збереженні замовлення:', error);
        });
}    

document.addEventListener('DOMContentLoaded', () => {
    renderRestaurantInfo();
    renderMenu();
    updateCartIcon();

    const authButton = document.querySelector(".button-auth");
    const outButton = document.querySelector(".button-out");
    const modalAuth = document.querySelector(".modal-auth");
    const modalDialogAuth = document.querySelector(".modal-dialog-auth");
    const closeAuthButton = document.querySelector(".close-auth");
    const logInForm = document.getElementById("logInForm");
    const loginInput = document.getElementById("login");
    const passwordInput = document.getElementById("password");
    const userNameSpan = document.querySelector(".user-name");
    const cartModal = document.querySelector('.modal-cart');
    const openCartButton = document.querySelector('#cart-button');
    const closeCartButton = cartModal.querySelector('.close');
    const clearCartButton = cartModal.querySelector('.clear-cart');
    const orderCartButton = cartModal.querySelector('.button-primary');

    const firebaseConfig = {
        apiKey: "AIzaSyCuBDGegmpb6ekWRsaXeZQbkPamZCaeeTo",
        authDomain: "deliveryfood-500e6.firebaseapp.com",
        databaseURL: "https://deliveryfood-500e6-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "deliveryfood-500e6",
        storageBucket: "deliveryfood-500e6.firebasestorage.app",
        messagingSenderId: "363352332686",
        appId: "1:363352332686:web:d9d64ed7a659ff9cfb2cdf"
    };
    
    const app = initializeApp(firebaseConfig);

    const db = getDatabase(app);

    openCartButton.addEventListener('click', () => {
        cartModal.style.display = 'block';
        renderCart();
    });

    closeCartButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    clearCartButton.addEventListener('click', clearCart);

    orderCartButton.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const userName = localStorage.getItem('login');
        const restaurantInfo = JSON.parse(localStorage.getItem('selectedRestaurant'));

        const phoneNumber = prompt('Введіть ваш номер телефону:');
        if (!phoneNumber) {
            alert('Номер телефону обов’язковий для оформлення замовлення!');
            return;
        }

        const order = {
            user: userName,
            phone: phoneNumber,
            restaurant: restaurantInfo ? restaurantInfo.name : 'Не вказано',
            items: cart,
            totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            orderDate: new Date().toISOString(),
        };

        saveOrderToDatabase(order)
            .then(() => {
                alert('Замовлення оформлено!');
                clearCart();
                cartModal.style.display = 'none';
            })
            .catch((error) => {
                console.error('Помилка збереження замовлення:', error);
                alert('Не вдалося оформити замовлення. Спробуйте пізніше.');
            });;
    });

    authButton.addEventListener("click", () => {
        modalAuth.style.display = "flex";
        loginInput.style.borderColor = "";
        document.body.style.overflow = "hidden";
    });

    closeAuthButton.addEventListener("click", () => {
        modalAuth.style.display = "none";
        document.body.style.overflow = "";
    });

    modalAuth.addEventListener("click", (event) => {
        if (!modalDialogAuth.contains(event.target)) {
            modalAuth.style.display = "none";
            document.body.style.overflow = "";
        }
    });

    if (localStorage.getItem("login")) {
        displayLoggedIn(localStorage.getItem("login"));
    } else {
        displayLoggedOut();
    }

    logInForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const login = loginInput.value.trim();

        if (login) {
            localStorage.setItem("login", login);
            displayLoggedIn(login);
            modalAuth.style.display = "none";
            document.body.style.overflow = "";
        } else {
            loginInput.style.borderColor = "red";
            alert("Будь ласка, введіть логін.");
        }
    });

    outButton.addEventListener("click", () => {
        localStorage.removeItem("login");
        displayLoggedOut();
    });

    function displayLoggedIn(login) {
        authButton.style.display = "none";
        outButton.style.display = "inline-block";
        userNameSpan.textContent = login;
        userNameSpan.style.display = "inline";
        loginInput.style.borderColor = "";
    }

    function displayLoggedOut() {
        authButton.style.display = "inline-block";
        outButton.style.display = "none";
        userNameSpan.textContent = "";
        userNameSpan.style.display = "none";
        loginInput.value = "";
        passwordInput.value = "";
    }
});