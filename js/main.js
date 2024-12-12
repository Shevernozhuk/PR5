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

    const getData = async function (url) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Помилка за адресою ${url},
            статус помилки ${response.status}`);
        }
        return await response.json();
    };

    getData('./db/partners.json').then(function(data){
        data.forEach(createCardRestaurent);
    });

    function createCardRestaurent({
        image, 
        kitchen, 
        name, price, 
        products, 
        stars, 
        time_of_delivery: timeOfDelivery
    }) {
    
        const card = document.createElement('a');
        card.classList.add('card', 'card-restaurant');
        card.href = "#";
        card.dataset.products = products;
    
        card.innerHTML = `
            <img src="${image}" alt="${name}" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery} хв</span>
                </div>
                <div class="card-info">
                    <div class="rating">${stars}</div>
                    <div class="price">Від ${price} грн</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        `;
    
        card.addEventListener('click', (event) => {
            event.preventDefault();
            if (!localStorage.getItem('login')) {
                modalAuth.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            } else {
                localStorage.setItem('selectedRestaurant', JSON.stringify({
                    image,
                    kitchen,
                    name,
                    price,
                    products,
                    stars,
                    timeOfDelivery
                }));
                window.location.href = "restaurant.html";
            }
        });
    
        cardsContainer.appendChild(card);
    }

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
        cubeEffect: {
            shadow: false,
            slideShadows: false,
          },
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
