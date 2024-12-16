function addScrollEvent(buttonId, targetSelector) {
    document.getElementById(buttonId).addEventListener("click", function() {
        const targetElement = document.querySelector(targetSelector);
        targetElement.scrollIntoView({ behavior: "smooth" });
    });
}

// Agregar eventos a los botones
addScrollEvent("btnMenuPokedex", ".pokedeHeader");
addScrollEvent("btnMenuMovie", "#peliculas");
addScrollEvent("btnMenuGames", "#juegos");