function renderRestaurantInfo() {
    const restaurantInfo = JSON.parse(localStorage.getItem('selectedRestaurant'));
    if (restaurantInfo) {
        const { name, kitchen, stars, price } = restaurantInfo;
        const restaurantHeader = document.querySelector('.section-heading');

        restaurantHeader.innerHTML = `
            <h2 class="section-title restaurant-title">${name}</h2>
            <div class="card-info">
                <div class="rating">${stars}</div>
                <div class="price">${price}</div>
                <div class="category">${kitchen}</div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderRestaurantInfo();
});