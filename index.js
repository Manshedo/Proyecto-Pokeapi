const primerComponente = document.getElementById("primerComponente")
primerComponente.innerHTML = ''

let urlPokemon = 'https://pokeapi.co/api/v2/pokemon';

function cargar(){
    fetch(urlPokemon)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        urlPokemon = data.next;
        const pokemonLista = data.results;

        const pokemonPromises = pokemonLista.map(pokemonData =>
            fetch(pokemonData.url).then(response => response.json())
        );

        return Promise.all(pokemonPromises);
    })
    .then(pokemonDataArray  =>  {    
        const contenidoPokemon = pokemonDataArray.map(response => 
            `<div class="pokemon-item">
                <h1>${response.name}</h1>
                <img src="${response.sprites.other["official-artwork"]["front_default"]}" alt="${response.name}">
            </div>`
        ).join('');

        primerComponente.innerHTML = contenidoPokemon
})
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error)
    })
}

document.getElementById("pokedex-button").addEventListener("click", function() {
    const searchContainer = document.querySelector(".search-container");
    searchContainer.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("peliculas-button").addEventListener("click", function() {
    const peliculasContainer = document.getElementById("peliculas");
    peliculasContainer.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("juegos-button").addEventListener("click", function() {
    const juegosContainer = document.getElementById("juegos");
    juegosContainer.scrollIntoView({ behavior: "smooth" });
});


cargar()