const sliderMovies = document.querySelector('.sliderMovies');
const btnMoviePrev = document.querySelector('.btnMoviePrev');
const btnMovieNext = document.querySelector('.btnMovieNext');

// Función para mover el slider automáticamente
function moveSlider() {
  const itemsMovie = document.querySelectorAll('.itemMovie');
  sliderMovies.append(itemsMovie[0]); // Mueve el primer item al final
}

// Función para activar la navegación manual (al hacer clic en los botones)
function activarNavegacion(e) {
  const itemsMovie = document.querySelectorAll('.itemMovie');
  if (e.target.matches('.btnMovieNext')) {
    sliderMovies.append(itemsMovie[0]); // Desplaza al siguiente
  }
  if (e.target.matches('.btnMoviePrev')) {
    sliderMovies.prepend(itemsMovie[itemsMovie.length - 1]); // Desplaza al anterior
  }
}

// Evento de clic en los botones de navegación
document.addEventListener('click', activarNavegacion, false);

// Intervalo para el desplazamiento automático (cada 3 segundos)
let intervalo = setInterval(moveSlider, 3000);

// Detener el intervalo cuando el usuario haga clic en los botones
btnMoviePrev.addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = setInterval(moveSlider, 3000); // Reiniciar el intervalo
});
btnMovieNext.addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = setInterval(moveSlider, 3000); // Reiniciar el intervalo
});