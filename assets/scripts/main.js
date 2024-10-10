import Pokemon from "./Pokemon.js";

const API_URL = "https://pokeapi.co/api/v2";

const pokemonSearch = document.querySelector("#pokemon-search");
const searchInput = document.querySelector("#search-input");
const pokemonDisplay = document.querySelector("#pokemon-display");
const pokemonPrevious = document.querySelector("#pokemon-previous");
const pokemonNext = document.querySelector("#pokemon-next");

const getPokemon = async (search) => {
  try {
    const data = await (await fetch(`${API_URL}/pokemon/${search}`)).json();
    const pokemon = new Pokemon(
      data.id,
      `${data.name.substring(0, 1).toUpperCase()}${data.name
        .substring(1)
        .toLowerCase()}`,
      data.sprites.front_default,
      data.weight / 10,
      data.height / 10,
      data.types.map(
        (type) =>
          `${type.type.name.substring(0, 1).toUpperCase()}${type.type.name
            .substring(1)
            .toLowerCase()}`
      ),
      data.abilities.map(
        (ability) =>
          `${ability.ability.name
            .substring(0, 1)
            .toUpperCase()}${ability.ability.name.substring(1).toLowerCase()}`
      )
    );

    pokemon.render(pokemonDisplay);

    if (pokemon.id > 1) {
      pokemonPrevious.removeAttribute("disabled");
      pokemonPrevious.onclick = async () => {
        await getPokemon(pokemon.id - 1);
      };
    } else {
      pokemonPrevious.setAttribute("disabled", true);
    }

    if (pokemon.id < 1025) {
      pokemonNext.removeAttribute("disabled");
      pokemonNext.onclick = async () => {
        await getPokemon(pokemon.id + 1);
      };
    } else {
      pokemonNext.setAttribute("disabled", true);
    }
  } catch (error) {
    pokemonDisplay.classList.remove("show");
    pokemonDisplay.classList.add("hide");
    pokemonPrevious.classList.remove("show");
    pokemonPrevious.classList.add("hide");
    pokemonNext.classList.remove("show");
    pokemonNext.classList.add("hide");
  }
};

pokemonSearch.addEventListener("submit", async (e) => {
  e.preventDefault();
  const search = searchInput.value.toLowerCase();
  searchInput.value = "";

  pokemonDisplay.classList.remove("hide");
  pokemonDisplay.classList.add("show");
  pokemonPrevious.classList.remove("hide");
  pokemonPrevious.classList.add("show");
  pokemonNext.classList.remove("hide");
  pokemonNext.classList.add("show");

  await getPokemon(search);
});
