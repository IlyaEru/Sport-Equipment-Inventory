const toggleButton = document.querySelector('.toggle-nav-btn');
const closeNavButton = document.querySelector('.mobile-header__close-btn');
const mobileNav = document.querySelector('.header-mobile-nav');

toggleButton.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

closeNavButton.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});
