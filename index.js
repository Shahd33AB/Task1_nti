document.addEventListener('DOMContentLoaded', () => {
    const productsContent = document.getElementById('products-content');
    const cartContent = document.getElementById('cart-content');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageNumber = document.getElementById('page-number');
    const searchForm = document.getElementById('search-form');
    const categoryInput = document.getElementById('category-input');
    const priceInput = document.getElementById('price-input');

    let products = [];
    let cart = [];
    let currentPage = 1;
    const itemsPerPage = 4;

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            products = data;
            displayProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const displayProducts = () => {
        productsContent.innerHTML = '';
        const filteredProducts = filterProducts();
        const currentPageItems = getItemsForCurrentPage(filteredProducts, currentPage, itemsPerPage);
        
        currentPageItems.forEach(product => {
            productsContent.innerHTML += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;
        });

        updatePageControls(filteredProducts.length);
    };

    const filterProducts = () => {
        const category = categoryInput.value.trim().toLowerCase();
        const maxPrice = parseFloat(priceInput.value);

        return products.filter(product => {
            const matchesCategory = category ? product.category.toLowerCase().includes(category) : true;
            const matchesPrice = !isNaN(maxPrice) ? product.price <= maxPrice : true;
            return matchesCategory && matchesPrice;
        });
    };

    const getItemsForCurrentPage = (items, page, itemsPerPage) => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    };

    const updatePageControls = (totalItems) => {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * itemsPerPage >= totalItems;
        pageNumber.textContent = currentPage;
    };

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage * itemsPerPage < filterProducts().length) {
            currentPage++;
            displayProducts();
        }
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentPage = 1;
        displayProducts();
    });

    window.addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        cart.push(product);
        displayCart();
    };

    const displayCart = () => {
        cartContent.innerHTML = '';
        cart.forEach(item => {
            cartContent.innerHTML += `<li>${item.title} - $${item.price.toFixed(2)}</li>`;
        });
    };

    fetchProducts();
});
