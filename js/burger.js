'use strict';

function burgerMenu () {
    const doc = document;
    const navBurgerWrapper = doc.querySelector('.nav-burger-wrapper');
    const navBurger = doc.querySelector('.nav-burger');
    const nav = doc.querySelector('.nav');
    const body = doc.body;

    navBurgerWrapper && navBurgerWrapper.addEventListener('click', () => {
        body.classList.toggle('body-lock');
        nav.classList.toggle('nav-active');
        navBurger.classList.toggle('nav-burger-active');
    });
}

burgerMenu();