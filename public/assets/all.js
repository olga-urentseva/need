const $header = document.querySelector('.header');
const $headerMenuButton = document.querySelector('.header__menu-button');

$headerMenuButton.addEventListener('click', () => {
  $header.classList.toggle('menu--collapsed');
});
