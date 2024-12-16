import { filtrarPokemons } from './main.js';

// ---------------- codigo de elementos -------------------------------
const elementData = [
    { name: 'Bug', imgSrc: '../imagenes/bug.JPG' },
    { name: 'Dark', imgSrc: '../imagenes/dark.JPG' },
    { name: 'Dragon', imgSrc: '../imagenes/dragon.JPG' },
    { name: 'Electric', imgSrc: '../imagenes/electric.JPG' },
    { name: 'Fairy', imgSrc: '../imagenes/fairy.JPG' },
    { name: 'Fighting', imgSrc: '../imagenes/fighting.JPG' },
    { name: 'Fire', imgSrc: '../imagenes/fire.JPG' },
    { name: 'Flying', imgSrc: '../imagenes/flying.JPG' },
    { name: 'Ghost', imgSrc: '../imagenes/ghost.JPG' },
    { name: 'Grass', imgSrc: '../imagenes/grass.JPG' },
    { name: 'Ground', imgSrc: '../imagenes/ground.JPG' },
    { name: 'Ice', imgSrc: '../imagenes/ice.JPG' },
    { name: 'Normal', imgSrc: '../imagenes/normal.JPG' },
    { name: 'Poison', imgSrc: '../imagenes/poison.JPG' },
    { name: 'Psychic', imgSrc: '../imagenes/psychic.JPG' },
    { name: 'Rock', imgSrc: '../imagenes/rock.JPG' },
    { name: 'Steel', imgSrc: '../imagenes/steel.JPG' },
    { name: 'Water', imgSrc: '../imagenes/water.JPG' }
  ];

  const ContainerElementsButtons = document.getElementById("ContainerElementsButtons");
  export const selectedTypes = []; // Array para almacenar los tipos seleccionados


elementData.forEach(data => {
  const buttonElement = document.createElement('div');
  buttonElement.classList.add('typeElement');

  const img = document.createElement('img');
  img.src = data.imgSrc;
  img.alt = data.name;
  img.classList.add('imgElement');

  const button = document.createElement('button');
  button.classList.add('btnElement', data.name.toLowerCase(), 'btnFont');
  button.textContent = data.name;

  buttonElement.appendChild(img);
  buttonElement.appendChild(button);

  ContainerElementsButtons.appendChild(buttonElement);

  // Agregar funcionalidad de clic en el botón
  button.addEventListener('click', function () {
    if (this.classList.contains('activeElement')) {
      // Si el botón ya está activo, lo desactivamos
      this.classList.remove('activeElement');
      this.style.background = '';
      this.style.color = '';
      const index = selectedTypes.indexOf(data.name.toLowerCase());
      if (index > -1) {
        selectedTypes.splice(index, 1); // Eliminar el tipo de la lista seleccionada
      }
    } else {
      // Si el botón no está activo, lo activamos
      this.classList.add('activeElement');
      const borderColor = getComputedStyle(this).getPropertyValue('border-color');
      this.style.background = `radial-gradient(circle, ${borderColor} 0%, ${borderColor} 100%)`;
      this.style.color = '#90ee90';

      selectedTypes.push(data.name.toLowerCase()); // Agregar el tipo a la lista seleccionada
    }
    filtrarPokemons(); // Filtrar Pokémones después de cada clic
  });
});