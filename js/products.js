'use strict';

export function htmlTemplate(array, wrapper) {
    array.forEach(item => {
        if (wrapper) {
            wrapper.innerHTML += `
                <li class="item" data-id=${item.id}>
                    <img src="${item.image}">
                    <p>${item.name}</p>
                    <p>$${item.price}</p>
                    <button class="buy-button">Buy</button>
                </li>
                `;
            }
    });
}

function productsFunctions () {
    const doc = document;
    const content = doc.querySelector('.content');
    const rangeInput = doc.querySelector('.range-input');
    const searchInput = doc.querySelector('.search');
    const filterButton = doc.querySelectorAll('.filter-button');
    const url = "http://127.0.0.1:5500/js/data.json";
    
    let fetchData = [];
    async function handleFetchRequest(url) {
        try {
            const response = await fetch(url);
    
            fetchData = await response.json();
        } catch (error) {
            return [];
        }
    }
    
    const showAll = async () => {
        await handleFetchRequest(url);
        htmlTemplate(fetchData, content);
    };
    
    showAll();

    const filteredArray = (currentBtn) =>
        fetchData.filter(object => {
            const productName = object.name.toLowerCase().trim();
            const value = searchInput.value.toLowerCase().trim();

            if (currentBtn === 'all') {
                return object.type !== currentBtn && productName.includes(value) && +object.price < rangeInput.value;
            } else {
                return object.type === currentBtn && productName.includes(value) && +object.price < rangeInput.value;
            }
    });

    
    const searchItem = async () => {
        await handleFetchRequest(url);
    
        if (searchInput) {
            searchInput.addEventListener('keyup', () => {
                const activeButton = doc.querySelector('.active-li');
                const activeButtonBrand = activeButton.dataset.brand;

                if (searchInput.value.length === 1) {
                    return;
                } else if (searchInput.value.length > 1 || searchInput.value === '') {
                    content.replaceChildren();

                    htmlTemplate(filteredArray(activeButtonBrand), content);
                }
            });  
        } 
    };
    
    searchItem();
    
    const filterByBrand = async () => {
        await handleFetchRequest(url);
    
        if (!!filterButton) {
            filterButton.forEach(button => {
                button.addEventListener('click', (e) => {
                    content.replaceChildren();
                    const currentButton = e.target.dataset.brand;
    
                    filterButton.forEach(button => {
                        button.classList.remove('active-li');
                    });
                    button.classList.add('active-li');

                    htmlTemplate(filteredArray(currentButton), content);
                });
            });
        }
    };
    
    filterByBrand();
    
    function filterByPrice() {
        const rangeElement = document.querySelector('.range-element');
    
        if (rangeElement && rangeInput) {
            rangeInput.addEventListener('input', () => {
                content.replaceChildren();
                rangeElement.innerHTML = `Value : `+ rangeInput.value + `$`;

                const activeButton = doc.querySelector('.active-li');
                const activeButtonBrand = activeButton.dataset.brand;
                
                htmlTemplate(filteredArray(activeButtonBrand), content);
            });
        }
    }
    
    filterByPrice();
}

document.addEventListener('DOMContentLoaded', productsFunctions);