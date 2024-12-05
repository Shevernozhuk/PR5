document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.querySelector(".button-auth");
    const outButton = document.querySelector(".button-out");
    const modalAuth = document.querySelector(".modal-auth");
    const modalDialogAuth = document.querySelector(".modal-dialog-auth");
    const closeAuthButton = document.querySelector(".close-auth");
    const logInForm = document.getElementById("logInForm");
    const loginInput = document.getElementById("login");
    const passwordInput = document.getElementById("password");
    const userNameSpan = document.querySelector(".user-name");
    const cardsContainer = document.querySelector(".cards-restaurants");
    
    
    const promoSwiper = new Swiper('.promo-swiper', {
        loop: true,
        effect: 'cube',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination'
        },
    });


    const restaurants = [
        {
            title: "Піца плюс",
            image: "img/pizza-plus/preview.jpg",
            tag: "50 хвилин",
            rating: 4.5,
            price: "від 200 ₴",
            category: "Піца",
        },
        {
            title: "Танукі",
            image: "img/food-band/preview.jpg",
            tag: "60 хвилин",
            rating: 4.8,
            price: "від 300 ₴",
            category: "Суші, роли",
        },
        {
            title: "FoodBand",
            image: "img/tanuki/preview.jpg",
            tag: "40 хвилин",
            rating: 4.5,
            price: "від 150 ₴",
            category: "Піца",
        },
        {
            title: "Ikigai",
            image: "img/palki-skalki/preview.jpg",
            tag: "55 хвилин",
            rating: 4.5,
            price: "від 250 ₴",
            category: "Піцца",
        },
        {
            title: "Пузата хата",
            image: "img/gusi-lebedi/preview.jpg",
            tag: "75 хвилин",
            rating: 4.5,
            price: "від 300 ₴",
            category: "Українські страви",
        },
        {
            title: "PizzaBurger",
            image: "img/pizza-burger/preview.jpg",
            tag: "45 хвилин",
            rating: 4.5,
            price: "від 700 ₴",
            category: "Піца",
        },
    ];

    function renderCards() {
        cardsContainer.innerHTML = ""; // Очистити контейнер
        restaurants.forEach((restaurant) => {
            const card = document.createElement("a");
            card.classList.add("card", "card-restaurant");
            card.href = "#";
            card.innerHTML = `
                <img src="${restaurant.image}" alt="image" class="card-image" />
                <div class="card-text">
                    <div class="card-heading">
                        <h3 class="card-title">${restaurant.title}</h3>
                        <span class="card-tag tag">${restaurant.tag}</span>
                    </div>
                    <div class="card-info">
                        <div class="rating">${restaurant.rating}</div>
                        <div class="price">${restaurant.price}</div>
                        <div class="category">${restaurant.category}</div>
                    </div>
                </div>
            `;
            card.addEventListener("click", (event) => {
                event.preventDefault();
                if (!localStorage.getItem("login")) {
                    modalAuth.style.display = "flex";
                    document.body.style.overflow = "hidden";
                } else {
                    window.location.href = "restaurant.html";
                }
            });
            cardsContainer.appendChild(card);
        });
    }

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

    renderCards();

});
