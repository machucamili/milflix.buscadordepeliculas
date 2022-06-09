// Se definen los elementos del DOM
let inputPeli = document.querySelector("#nombre_pelicula");
let boton = document.querySelector("#boton");
let pelis = document.getElementsByClassName("pelis")[0];
let clear = document.querySelector("#clear");
let form = document.querySelector("form");
let pop = document.getElementsByClassName("pop")[0];
let up = document.getElementsByClassName("up")[0];
let url;
let i;

window.onload = () => {
    popular() // Se ponen las peliculas populares (linea...)
}

form.addEventListener("submit", (e) => { // Cuando se aprete el "enter" una vez escrito el nombre de la peli...
    e.preventDefault() // Previene que la página se recargue
    defaultAll(pelis); // Se borran todas las posibles peliculas anteriores
    var nombrePeli = inputPeli.value; // Se define el nombre de la pelicula a buscar
    url = `https://api.themoviedb.org/3/search/movie?api_key=af0e0a76ec3a39a7dc32e7f88e6e6968&language=en-US&query=${nombrePeli}&page=1&`;
    callAPI(url, pelis) // Se buscan y ponen las peliculas en el contenedor ("#pelis") [HTML linea 36] (funcion linea...)
})

boton.addEventListener("click", () => { // cuando se clickea el boton, entonces...
    defaultAll(pelis); // Se borran todas las posibles peliculas anteriores (funcion linea...)
    var nombrePeli = inputPeli.value; // Se define el nombre de la pelicula a buscar
    url = `https://api.themoviedb.org/3/search/movie?api_key=af0e0a76ec3a39a7dc32e7f88e6e6968&language=en-US&query=${nombrePeli}&page=1&`;
    callAPI(url, pelis) // Se buscan y ponen las peliculas en el contenedor ("#pelis") [HTML linea 36] (funcion linea...)
})

clear.addEventListener("click", () => { // Cuando se apreta el botón de borrar, se sacan todas las peliculas anteriores, y se reestablece el input
    defaultAll(pelis) // Se borran todas las posibles peliculas anteriores
    inputPeli.value = ""; // Se restablece el input.
    popular() // Se ponen las peliculas populares (linea...)
})

function defaultAll(cosa) { // Esta función solamente borra todos los elementos dentro de algo (en este caso el contenedor de pelis)
    cosa.innerHTML = "";
};

function popular() { // Esta función busca los más populares y los pone dentro del contenedor (pelis)
    url = `https://api.themoviedb.org/3/discover/movie?api_key=af0e0a76ec3a39a7dc32e7f88e6e6968&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1&with_watch_monetization_types=flatrate`;
    callAPI(url, pelis);
}

function similarMovie(id) { // Se buscan peliculas similares y se ponen en el contenedor (upPelis)
    console.log(id)
    url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=af0e0a76ec3a39a7dc32e7f88e6e6968&language=en-US&page=1`; 
    callAPI(url, upPelis);
}

function callAPI(url, contenedor) { // Plantilla de llamar función, para no ponerlo 4 veces en el código
    fetch(`${url}`, {
        method: "GET",
        redirect: "follow",
    }) /* Se comunica con el API TMDb */
    .then((success) => success.json())
    .then((data) => {
        fecthing(data, contenedor)
    })
    .catch((error) => {
        console.log(error);
    })
}

function fecthing(data, contenedor) { // Esta función recibe los datos del API (sin importar del fetch), Crea las tarjetas y las pone en el contenedor (contenedor).
    i = -1; //  Solamente un index para evitar el error de la última pelicula (Me salió de pedo y no lo pienso cambiar ni lo sé explicar);
    let test = data.results;
    for (var pelicula of test) { // Para cada resultado hacer... 

        // Se crean todos los elementos de la tarjeta
            let items = document.createElement("div");
            let imgcont = document.createElement("div");
            let img = document.createElement("img");
            let titulo = document.createElement("h3");
            i++ // Acá se solucionó el problema

        // Se definen los valores del futuro Pop-Up (No funcionó con promesas porque me tomaba la última pelicula que cargó)        
            let image = test[i].poster_path;
            let voteave = test[i].vote_average;
            let poptitle = test[i].title.toUpperCase();
            let popdate = test[i].release_date.slice(0, 4);
            let popover = test[i].overview;
            let popId = test[i].id;
            img.addEventListener("click", (i) => { //al darle click a una tarjeta...
                // Aclaración; en vez de hacer un solo Pop-Up lo dividí en dos; el Pop se queda atrás, da blur y tiene un evento para cerrar. El Up está adelante, y tiene todo el contenido.
                pop.style.display = "none"
                up.style.display = "none"
                pop.style.display = "flex";
                up.style.display = "flex";
            // Se estiliza el Up, (preferí usar el código para simplicifar el código, pero quedó feo, así que luego lo haré con React)
                up.innerHTML = ` 
                    <div class="upDiv1">
                        <img src="${"https://image.tmdb.org/t/p/w500" + image}">
                        <div class="upDiv1-1">
                            <div>
                            <span class="material-symbols-outlined">star</span>
                            <p>${voteave}</p>
                            </div>
                            <div>
                            <span class="material-symbols-outlined">today</span>
                            <p>${popdate}</p>
                            </div>
                            
                            
                        </div>
                    </div>
                    <div class="upDiv2">
                        <h2>${poptitle}</h2>
                        <p>${popover}</p>
                        <h3>Similar movies</h3>
                        <div id="upPelis">
                        </div>
                    </div>
                `
                let upPelis = document.getElementById("upPelis"); // se define el contenedor
                pop.addEventListener("click", () => { // Se cierra el pop
                    pop.style.display = "none"
                    up.style.display = "none"
                })

                document.querySelector("body").appendChild(pop); // se implementa el Pop-Up
                document.querySelector("body").appendChild(up)
                similarMovie(popId);
            })
            
            items.classList.add("items");
            imgcont.classList.add("imgcont"); // Se le asignan las respectivas clases para poder darles estilo
             
            img.src = "https://image.tmdb.org/t/p/w500" + pelicula.poster_path; // Se definen los valores de la tarjeta haciendo uso de los resultados de la API (Nombre y foto)
            titulo.textContent = pelicula.title;

            items.appendChild(imgcont); // Se incluyen todos los elementos dentro de la tarjeta
            imgcont.appendChild(img);
            items.appendChild(titulo);

            contenedor.appendChild(items); // Se agrega la tarteja dentro del contenedor de tarjetas
        }
}

// ctrl + alt + point = elegir diferentes puntos.
// shift + alt + point = elegir todo para abajo.