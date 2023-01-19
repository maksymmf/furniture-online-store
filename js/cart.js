'use strict';

function cartFunctions () {   
    const doc = document; 
    const content = doc.querySelector('.content');
    const cartIcon = doc.querySelector('.cart-icon');
    const closeCartButton = doc.querySelector('.close-cart');
    const cartWrapper = doc.querySelector('.cart-wrapper');
    const cartContent = doc.querySelector('.cart-content');
    const url = "http://127.0.0.1:5500/js/data.json";
    let buyListLocalStorage = JSON.parse(localStorage.getItem('buy')) || [];

    let fetchData = [];
    async function handleFetchRequest(url) {
        try {
            const response = await fetch(url);

            fetchData = await response.json();
        } catch (error) {
            return [];
        }
    }

    function cartHtmlTemplate (array, wrapper) {
        array.forEach(item => {
            wrapper.innerHTML += `
                <li class="cart-item" data-id=${item.id}>
                    <img src="${item.image}">
                    <div class="name-price-remove">
                        <p class="name">${item.name}</p>
                        <p class="price">$${item.price}</p>
                        <button class="remove" data-button="remove">remove</button>
                    </div>
                    <div class="counter">
                        <button class="arrow-up" data-arrow="up">˄</button>
                        <p class="items-available">${item.numberOfUnits}</p>
                        <button class="arrow-down" data-arrow="down">˅</button>
                    </div>
                </li>
                `;
        });
    }

    cartHtmlTemplate(buyListLocalStorage, cartContent);

    function showAndCloseCart() {
        cartIcon && cartIcon.addEventListener('click', () => {
            cartWrapper.classList.add('cart-wrapper-display');
        });
    
        closeCartButton && closeCartButton.addEventListener('click', () => {
            cartWrapper.classList.remove('cart-wrapper-display');
        });
    }
    
    showAndCloseCart();
    
    const productsCartItemAddAndDisplay = async () => {
        await handleFetchRequest(url);
        
        if (content) {
            content.addEventListener('click', (e) => {
                if (e.target.classList.contains('buy-button')) {
                    const id = e.target.parentElement.dataset.id;
        
                    if (buyListLocalStorage.some(object => object.id === +id)) {
                        alert('This item is already in a cart');
                    } else {
                        cartContent.replaceChildren();

                        const item = fetchData.find((obj) => obj.id === +id);
        
                        item["numberOfUnits"] = 1;
                        buyListLocalStorage.push(item);
                        localStorage.setItem('buy', JSON.stringify(buyListLocalStorage));
        
                        cartHtmlTemplate(buyListLocalStorage, cartContent);
                        showCartIconNum(buyListLocalStorage);
                        showCartTotal(buyListLocalStorage);
                    }
                }
            });
        }
    };
    
    productsCartItemAddAndDisplay();

    const featuredCartItemAddAndDisplay = async () => {
        await handleFetchRequest(url);

        const featuredContent = doc.querySelector('.featured-content');

        if (featuredContent) {
            featuredContent.addEventListener('click', (e) => {
                if (e.target.classList.contains('buy-button')) {
                    const id = e.target.parentElement.dataset.id;
    
                    if (buyListLocalStorage.some(object => object.id === +id)) {
                        alert('This item is already in a cart');
                    } else {
                        cartContent.replaceChildren();
    
                        const item = fetchData.find(object => {
                            return object.id === +id;
                        });
    
                        item["numberOfUnits"] = 1;
                        buyListLocalStorage.push(item);
                        localStorage.setItem('buy', JSON.stringify(buyListLocalStorage));
    
                        cartHtmlTemplate(buyListLocalStorage, cartContent);
                        showCartIconNum(buyListLocalStorage);
                        showCartTotal(buyListLocalStorage);
                    }
                }
            });
        }
    };

    featuredCartItemAddAndDisplay();

    const changeItemAmount = async () => {
        await handleFetchRequest(url);

        if (cartContent) {
            cartContent.addEventListener('click', (e) => {
                const itemsAvailableId = e.target.parentElement.parentElement.dataset.id;
        
                fetchData.forEach(item => {
                    if (item.id === +itemsAvailableId) {
                        if (e.target.dataset.arrow === 'up') {
                            cartContent.replaceChildren();
    
                            buyListLocalStorage = buyListLocalStorage.map(object => {
                                if (object.id === +itemsAvailableId) {
                                    if (object.numberOfUnits < item.itemsAvailable) {
                                        return {
                                            ...object, 
                                            numberOfUnits: object.numberOfUnits + 1
                                        };
                                    } else {
                                        alert('Sorry, but we do not have enough items available at the moment');
                                    }
                                }
    
                                return object;
                            });
    
                            localStorage.setItem('buy', JSON.stringify(buyListLocalStorage));
        
                            cartHtmlTemplate(buyListLocalStorage, cartContent);
                            showCartTotal(buyListLocalStorage);
                        } else if (e.target.dataset.arrow === "down") {
                            cartContent.replaceChildren();
        
                            buyListLocalStorage = buyListLocalStorage.map(object => {
                                if (object.id === +itemsAvailableId && object.numberOfUnits > 1) {
                                    return {
                                        ...object, 
                                        numberOfUnits: object.numberOfUnits - 1
                                    };
                                }
        
                                return object;
                            });
        
                            localStorage.setItem('buy', JSON.stringify(buyListLocalStorage));
        
                            cartHtmlTemplate(buyListLocalStorage, cartContent);
                            showCartTotal(buyListLocalStorage);
                        }
                    }
                });
            });
        }
    };

    changeItemAmount();
    
    function cartItemRemove() {
        if (cartContent) {
            cartContent.addEventListener('click', (e) => {
                const id = e.target.parentElement.parentElement.dataset.id;
                
                if (e.target.dataset.button === "remove") {
                    buyListLocalStorage = buyListLocalStorage.filter(object => {
                        return object.id !== +id;
                    });
        
                    const itemWrapper = e.target.parentElement.parentElement;
        
                    itemWrapper.remove();
                    localStorage.setItem('buy', JSON.stringify(buyListLocalStorage));
        
                    showCartIconNum(buyListLocalStorage);
                    showCartTotal(buyListLocalStorage);
                }
            });
        }
    }

    cartItemRemove();

    function showCartIconNum(array) {
        const cartIconAmount = doc.querySelector('.cart-icon-amount');
    
        if (array.length >= 1) {
            cartIconAmount.classList.add('cart-amount-added');
            cartIconAmount.innerText = array.length;
        } else {
            cartIconAmount.classList.remove('cart-amount-added');
            cartIconAmount.innerText = '';
        }
    }

    showCartIconNum(buyListLocalStorage);

    function showCartTotal (array) {
        const cartTotalAmount = doc.querySelector('.total-amount');

        const sumArray = array.map((obj) => +obj.price * obj.numberOfUnits);
        const totalSum = Math.round(100 * sumArray.reduce((x, y) => x + y, 0)) / 100;
    
        cartTotalAmount.innerText = ` $${totalSum}`;
    }

    showCartTotal(buyListLocalStorage);
    
    function cartCheckout () {
        const checkoutButton = doc.querySelector('.checkout-button');
    
        checkoutButton && checkoutButton.addEventListener('click', () => {
            cartWrapper.classList.remove('cart-wrapper-display');

            if (buyListLocalStorage.length === 0) {
                alert('Your cart is empty. Please, choose items you want to purchase.');
            } else {
                localStorage.clear();
                buyListLocalStorage = [];
                cartContent.replaceChildren();
                showCartIconNum(buyListLocalStorage);
                showCartTotal(buyListLocalStorage);

                alert('Thank you for your order! If necessary, we will contact you ASAP for more details!');
            }
        });
    }
    
    cartCheckout();
}

document.addEventListener('DOMContentLoaded', cartFunctions);