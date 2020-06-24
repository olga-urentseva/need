const $characterNumber = document.querySelector('#character-number');
const $textarea = document.querySelector('#textarea');
$textarea.addEventListener('keyup', (event) => {
  $characterNumber.innerHTML = event.target.value.length + ' / 255';
});
