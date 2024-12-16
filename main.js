import { selectedTypes } from './buttonElement.js';


let pokemonData = [];
let pokemonDataOriginal = [];
let currentPage = 1;
const itemsPerPage = 18;
let totalPokemons = 0;
let totalLoadedPokemons = 0;
let loadingProgress = 0;

const modalContainer = document.getElementById('modalContainer');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalPokemonName = document.getElementById('modalPokemonName');
const modalPokemonId = document.getElementById('modalPokemonId');
const modalImage = document.getElementById('modalImage');

const modalPokemonDescription = document.getElementById('modalPokemonDescription');
//const modalImgType = document.getElementById('modalImgType');
const modalImageButton = document.getElementById('modalImageButton');
const modalPaginationElement = document.getElementById('modalPagination');

let slideIndex = 0;

const heightSlider = document.getElementById('height-slider');
const heightRange = document.getElementById('height-range');
const weightSlider = document.getElementById('weight-slider');
const weightRange = document.getElementById('weight-range');
const pokemonList = document.getElementById('pokemon-list');

// Al cargar la página, obtener los datos de Pokémon
document.addEventListener("DOMContentLoaded", async () => {
    await fetchPokemons('https://pokeapi.co/api/v2/pokemon?limit=1302');

    // Añadir el event listener para el input de búsqueda
    const btnSearch = document.getElementById('btnSearch');
    btnSearch.addEventListener('keyup', filtrarPokemons);
    if (btnSearch) {
        btnSearch.addEventListener('keyup', filtrarPokemons);
    }

    const pokemonRandom = document.getElementById('btnPokemonRandom');
    pokemonRandom.addEventListener("click", randomearPokemon)
 

    import('./menu.js')
    import('./movieSlider.js')
});


function randomearPokemon(){
    const indiceAleatorio = Math.floor(Math.random() * pokemonDataOriginal.length);
    const elementoAleatorio = pokemonDataOriginal[indiceAleatorio];
    

    const pokemonImageRandom = document.getElementById('pokemonImageRandom');
    pokemonImageRandom.innerHTML = `<img src="${elementoAleatorio.image}" alt="${elementoAleatorio.name}" />`;
    const pokemonNameRandom = document.getElementById('pokemonNameRandom');
    pokemonNameRandom.textContent = elementoAleatorio.name;
    btnPokemonRandom.disabled = true;  // Deshabilita el botón
}

closeModalBtn.addEventListener('click', () => {
    modalContainer.style.display = "none";
});

noUiSlider.create(weightSlider, {
        start: [0, 1000],
        connect: true,
        range: {
            min: 0,
            max: 1000
        },
        step: 0.1,
        format: {
            to: function (value) {
                return value.toFixed();  // Muestra los valores sin decimales
            },
            from: function (value) {
                return value;  // Convierte el valor de vuelta a número
            }
        },
        tooltips: true  // Activa los tooltips para mostrar los valores sobre los deslizadores
});

noUiSlider.create(heightSlider, {
    start: [0, 100],
    connect: true,
    range: {
        min: 0,
        max: 100
    },
    step: 0.1,
    format: {
        to: function (value) {
            return value.toFixed();  // Muestra los valores sin decimales
        },
        from: function (value) {
            return value;  // Convierte el valor de vuelta a número
        }
    },
    tooltips: true  // Activa los tooltips para mostrar los valores sobre los deslizadores
});

weightSlider.noUiSlider.on('update', function (values) {
    weightRange.textContent = `${values[0]} - ${values[1]} `;
    filtrarPokemons()
});

heightSlider.noUiSlider.on('update', function (values) {
    heightRange.textContent = `${values[0]} - ${values[1]} `;
    filtrarPokemons()
});

// Función para obtener los Pokémon desde la API
async function fetchPokemons(url) {
    document.getElementById('preloader').style.display = 'flex';

    const response = await fetch(url);
    const data = await response.json();

    totalPokemons = data.count;
    totalLoadedPokemons = 0;

    const detailedPokemons = await Promise.all(data.results.map(async (pokemon, index) => {
        const detailsResponse = await fetch(pokemon.url);
        const detailsData = await detailsResponse.json();
        
        totalLoadedPokemons++;
        loadingProgress = (totalLoadedPokemons / data.results.length) * 100;
        updateProgressBar(loadingProgress);

        const image = detailsData.sprites.other['official-artwork']?.front_default || 'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=';

        return {
            name: pokemon.name,
            image: image,
            url: pokemon.url,
            types: detailsData.types,
            weight:detailsData.weight,
            height:detailsData.height
        };
    }));

    pokemonDataOriginal = detailedPokemons;
    pokemonData = [...pokemonDataOriginal];

       setTimeout(() => {
                document.getElementById('preloader').style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500); // Espera 1 segundo adicional para que la barra llegue al 100%
            
    mostrarPokemons();
}

function updateProgressBar(progress) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
}

function mostrarPokemons() {
    const pokemonFragment = document.createDocumentFragment();
    const pokemonListContainer = document.getElementById('pokemonListContainer');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pokemons = pokemonData.slice(start, end);

    pokemonListContainer.innerHTML = '';

    if (pokemonData.length === 0) {
        pokemonListContainer.innerHTML = '<div class="no-results">No se encontraron Pokémon que coincidan con los filtros.</div>';
    } else {
        pokemons.forEach(pokemon => {
            const pokemonItem = document.createElement('div');
            pokemonItem.classList.add('pokemonCard');

            const pokemonImage = document.createElement('img');
            pokemonImage.src = pokemon.image;
            pokemonImage.alt = pokemon.name;

            const pokemonName = document.createElement('h1');
            pokemonName.textContent = pokemon.name;

            pokemonItem.addEventListener('click', () => {
                mostrarDetallesPokemon(pokemon);
            });

            pokemonItem.appendChild(pokemonName);
            pokemonItem.appendChild(pokemonImage);

            pokemonFragment.appendChild(pokemonItem)
        });
        pokemonListContainer.appendChild(pokemonFragment)
    }

    mostrarPaginacion();
  
}

async function mostrarDetallesPokemon(pokemon) {

    let evolutions = [];
    let index = 0;

    
    // Hacer una solicitud para obtener los detalles de la especie del Pokémon
    const speciesResponse = await fetch(pokemon.url.replace("pokemon", "pokemon-species"));
    if (!speciesResponse.ok) {

    const pokemonDetailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
    const pokemonDetails = await pokemonDetailsResponse.json();
    pokemon.id = pokemonDetails.id
    console.log(pokemon)
    evolutions.push(pokemon)
       
    }else{
        
    const speciesData = await speciesResponse.json();
    

    // Hacer una solicitud para obtener la cadena evolutiva del Pokémon
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();

    // Obtener la cadena evolutiva del Pokémon
    const evolutionChain = evolutionData.chain;

   
 
    let currentEvolution = evolutionChain;

    // Mientras haya evoluciones, agregarlas a la lista
    while (currentEvolution) {
        const evolutionName = currentEvolution.species.name;
    
        // Buscar los detalles del Pokémon (peso, altura, etc.) en pokemonDataOriginal
        const evolutionDataFound = pokemonDataOriginal.find(poke => poke.name === evolutionName);
    
        if (evolutionDataFound) {
            // Hacer una solicitud para obtener los detalles completos del Pokémon
            const pokemonDetailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionName}`);
            const pokemonDetails = await pokemonDetailsResponse.json();

            const pokemonDescription = await fetch(`${pokemonDetails.species.url}`)
            const pokemonDescriptionResponse = await pokemonDescription.json();

            const descriptionSpanish = pokemonDescriptionResponse.flavor_text_entries.find(entry => entry.language.name === 'es');

           
            // Obtener el ID del Pokémon desde la respuesta de la API
            const pokemonId = pokemonDetails.id;
    
            // Agregar los detalles del Pokémon a la lista de evoluciones
            evolutions.push({
                description:descriptionSpanish.flavor_text,
                name: evolutionDataFound.name,
                image: evolutionDataFound.image,
                weight: evolutionDataFound.weight,
                height: evolutionDataFound.height,
                id: pokemonId,
                type: pokemonDetails.types[0].type.name,
                level: 16
            });
        }
    
        // Si hay evoluciones secundarias en el índice 1, 2, etc., recorrerlas con otro while
        if (currentEvolution.evolves_to && currentEvolution.evolves_to.length > 0) {
            let evolutionIndex = 1; // Empezamos desde el índice 1
            while (currentEvolution.evolves_to[evolutionIndex]) {
                const nextEvolution = currentEvolution.evolves_to[evolutionIndex];
                const nextEvolutionName = nextEvolution.species.name;
    
                const nextEvolutionDataFound = pokemonDataOriginal.find(poke => poke.name === nextEvolutionName);
    
                if (nextEvolutionDataFound) {
                    // Obtener los detalles completos del Pokémon
                    const nextPokemonDetailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextEvolutionName}`);
                    const nextPokemonDetails = await nextPokemonDetailsResponse.json();

                    const nextPokemonDescription = await fetch(`${nextPokemonDetails.species.url}`)
                    const nextPokemonDescriptionResponse = await nextPokemonDescription.json();
        
                    const nextDescriptionSpanish = nextPokemonDescriptionResponse.flavor_text_entries.find(entry => entry.language.name === 'es');
                  
                  
                    const nextPokemonId = nextPokemonDetails.id;
    
                    // Agregar los detalles de la evolución secundaria
                    evolutions.push({
                        name: nextEvolutionDataFound.name,
                        description: nextDescriptionSpanish.flavor_text,
                        image: nextEvolutionDataFound.image,
                        weight: nextEvolutionDataFound.weight,
                        height: nextEvolutionDataFound.height,
                        id: nextPokemonId,
                        type: nextPokemonDetails.types[0].type.name,
                        level: 16
                    });
                }
    
                // Avanzar al siguiente índice de evolución secundaria
                evolutionIndex++;
            }
        }
    
        // Avanzar a la siguiente evolución principal
        currentEvolution = currentEvolution.evolves_to[0]; // Selecciona el primer Pokémon de la siguiente evolución
    }
     
    // Encontrar el índice del Pokémon actual en la lista de evoluciones
     index = evolutions.findIndex(data => data.name.toLowerCase() === pokemon.name.toLowerCase());
    }
    modalContainer.style.display = 'block';
    // Mostrar la página con los detalles de las evoluciones
    showPage(index, evolutions);
    generatePagination(evolutions, index);

    // Mostrar el modal con los detalles
    
}

function showPage(page,evolutions) {
    

    const modalPokemonData = evolutions[page];
    modalImage.src = modalPokemonData.image;

    const pokemonIdString = String(modalPokemonData.id);
    const pokemonIdFixed = pokemonIdString.padStart(4, '0'); // Aseguramos que tenga 4 dígitos
    modalPokemonId.textContent = `N.º ${pokemonIdFixed}`; 
    console.log(modalPokemonData.type)
    

    //modalImgType.src = `../imagenes/${modalPokemonData.type}.JPG`;
    modalPokemonName.textContent = modalPokemonData.name;
    modalPokemonDescription.textContent = modalPokemonData.description;
    modalImageButton.textContent = "Ver mas detalle";

    // Reiniciar y aplicar la animación de deslizamiento y desvanecimiento
    const modalImageContainer = document.querySelector('.modalImageContainer');
    const modalPokemonDetails = document.querySelector('.modalPokemonDetails');



    // Eliminar la transición temporalmente
    modalImageContainer.style.transition = "none";
    modalPokemonDetails.style.transition = "none";

    // Restablecer la opacidad y el desplazamiento
    modalImageContainer.style.opacity = 0;
    modalPokemonDetails.style.opacity = 0;
    modalImageContainer.style.transform = "translateY(30%)";
    modalPokemonDetails.style.transform = "translateY(30%)";

    // Forzar un reflujo para reiniciar la animación
    void modalImageContainer.offsetWidth;
    void modalPokemonDetails.offsetWidth;

    // Después de un pequeño retraso, aplicar la transición de deslizamiento y desvanecimiento
    setTimeout(() => {
        modalImageContainer.style.transition = "opacity 2s ease";
        modalPokemonDetails.style.transition = "transform 2s ease, opacity 2s ease";
        modalImageContainer.style.transform = "translateY(0)";
        modalPokemonDetails.style.transform = "translateY(0)";
        modalImageContainer.style.opacity = 1;
        modalPokemonDetails.style.opacity = 1;
    }, 50);
}

function generatePagination(evolutions,index) {
    const pageCount = evolutions.length;
    modalPaginationElement.innerHTML = '';

    for (let i = 0; i < pageCount; i++) {
        const pageRect = document.createElement('div');
        pageRect.classList.add('modalPage');
        if (i === index) {
            pageRect.classList.add('modalActivePage');
        }

        pageRect.addEventListener('click', () => {
            index = i;
            showPage(index, evolutions);
            generatePagination(evolutions,index); // Actualizar la paginación
        });

        modalPaginationElement.appendChild(pageRect);
    }
}

window.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        modalContainer.style.display = "none";
    }
});
/*
function mostrarDetallesPokemon2(){
    window.location.href = `pokemon-details.html?id=${pokemon.name}`;

    // O bien, mostrar un modal con la información:
    const modal = document.getElementById('pokemonModal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.image}" alt="${pokemon.name}" />
        <p>Altura: ${pokemon.height} dm</p>
        <p>Peso: ${pokemon.weight} hg</p>
        <p>Tipos: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <button onclick="cerrarModal()">Cerrar</button>
    `;
    modal.style.display = 'block';

}*/

function mostrarPaginacion() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(pokemonData.length / itemsPerPage);
    const maxPagesToShow = 5;

    pagination.innerHTML = ''; // Limpiar la paginación antes de crear los botones

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // Ajustar el rango de las páginas a mostrar si hay más de 5 páginas
    const pages = calculatePageRange(totalPages, startPage, endPage, maxPagesToShow);

    // Crear botones de paginación
    createPaginationButton(pagination, 'Primero', currentPage !== 1, 'first', 'Ir a la primera página');
    createPaginationButton(pagination, 'Atrás', currentPage > 1, 'prev', 'Ir a la página anterior');

    // Botones de página numerada
    pages.forEach(page => {
        createPageButton(pagination, page);
    });

    

    createPaginationButton(pagination, 'Siguiente', currentPage < totalPages, 'next', 'Ir a la siguiente página');
    createPaginationButton(pagination, 'Último', currentPage !== totalPages, 'last', 'Ir a la última página');
}

// Función para crear un botón de paginación con atributo aria-label
function createPaginationButton(pagination, text, isEnabled, action, ariaLabel) {
    const buttonItem = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = !isEnabled;

    // Configurar el aria-label para accesibilidad
    button.setAttribute('aria-label', ariaLabel);

    button.addEventListener('click', () => cambiarPagina(action));

    if (!isEnabled) {
        buttonItem.classList.add('disabled');
    } else {
        buttonItem.classList.remove('disabled');
    }

    buttonItem.appendChild(button);
    pagination.appendChild(buttonItem);
}

// Función para crear los botones de página numerada
function createPageButton(pagination, page) {
    const pageItem = document.createElement('li');
    const pageButton = document.createElement('button');
    pageButton.textContent = page;

    if (page === currentPage) {
        pageItem.classList.add('active');
    }

    pageButton.addEventListener('click', () => {
        currentPage = page;
        mostrarPokemons();
        mostrarPaginacion();
    });

    pageItem.appendChild(pageButton);
    pagination.appendChild(pageItem);
}

// Función para calcular el rango de páginas a mostrar
function calculatePageRange(totalPages, startPage, endPage, maxPagesToShow) {
    let pages = [];
    if (totalPages <= maxPagesToShow) {
        // Si hay menos páginas que el máximo, mostrar todas
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Mostrar un rango de páginas centrado alrededor de la página actual
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
    }
    return pages;
}

// Función para cambiar la página
function cambiarPagina(direction) {
    const totalPages = Math.ceil(pokemonData.length / itemsPerPage);

    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'first') {
        currentPage = 1;
    } else if (direction === 'last') {
        currentPage = totalPages;
    }

    mostrarPokemons();
    mostrarPaginacion();
}

export function filtrarPokemons() {
    
    const searchTerm = document.getElementById('btnSearch').value.toLowerCase();

        // Obtener los valores del slider de peso
    const weightValues = weightSlider.noUiSlider.get(); // Obtiene el valor del slider
    const minWeight = parseFloat(weightValues[0]*10); // Valor mínimo del slider
    const maxWeight = parseFloat(weightValues[1]*10); // Valor máximo del slider

    const heightValues = heightSlider.noUiSlider.get(); // Obtiene el valor del slider
    const minHeight = parseFloat(heightValues[0]*10); // Valor mínimo del slider
    const maxHeight = parseFloat(heightValues[1]*10); // Valor máximo del slider

    pokemonData = pokemonDataOriginal.filter(pokemon => {
        const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm);

        const matchesTypes = selectedTypes.length === 0 || selectedTypes.every(selectedType => 
            pokemon.types.some(type => type.type.name === selectedType)
          );

        const matchesHeight = pokemon.height >= minHeight && pokemon.height <= maxHeight;

        const matchesWeight = pokemon.weight >= minWeight && pokemon.weight <= maxWeight;
    
        return matchesSearch && matchesTypes && matchesWeight  && matchesHeight;
    });
    
    currentPage = 1;
    
    mostrarPokemons();
}



