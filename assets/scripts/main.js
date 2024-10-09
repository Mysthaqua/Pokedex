const API_URL = "https://pokeapi.co/api/v2";

const pokemonSearch = document.querySelector("#pokemon-search");
const searchInput = document.querySelector("#search-input");
const pokemonDisplay = document.querySelector("#pokemon-display");
const pokemonPicture = document.querySelector("#pokemon-picture");
const pokemonId = document.querySelector("#pokemon-id");
const pokemonName = document.querySelector("#pokemon-name");
const pokemonWeight = document.querySelector("#pokemon-weight");
const pokemonHeight = document.querySelector("#pokemon-height");
const pokemonTypes = document.querySelector("#pokemon-types");
const pokemonAbilities = document.querySelector("#pokemon-abilities");
const pokemonPrevious = document.querySelector("#pokemon-previous");
const pokemonNext = document.querySelector("#pokemon-next");

pokemonDisplay.style.display = "none";
pokemonPrevious.style.display = "none";
pokemonNext.style.display = "none";

const getPokemon = async (pokemon) => {
  const data = await (await fetch(`${API_URL}/pokemon/${pokemon}`)).json();

  pokemonDisplay.style.display = "block";
  pokemonPrevious.style.display = "block";
  pokemonNext.style.display = "block";

  pokemonPicture.src = data.sprites.front_default;
  pokemonId.innerHTML = `#${data.id}`;
  pokemonName.innerHTML = `${data.name.substring(0, 1).toUpperCase()}${data.name
    .substring(1)
    .toLowerCase()}`;
  pokemonWeight.innerHTML = `${(data.weight / 10).toFixed(1)} kg`;
  pokemonHeight.innerHTML = `${(data.height / 10).toFixed(1)} m`;

  pokemonTypes.innerHTML = "";
  data.types.forEach((type) => {
    const pokemonTypeLi = document.createElement("li");
    const pokemonTypeSpan = document.createElement("span");
    pokemonTypeSpan.innerHTML = `${type.type.name
      .substring(0, 1)
      .toUpperCase()}${type.type.name.substring(1).toLowerCase()}`;
    pokemonTypeLi.appendChild(pokemonTypeSpan);
    pokemonTypes.appendChild(pokemonTypeLi);
  });

  pokemonAbilities.innerHTML = "";
  data.abilities.forEach((ability) => {
    const pokemonAbilityLi = document.createElement("li");
    const pokemonAbilitySpan = document.createElement("span");
    pokemonAbilitySpan.innerHTML = `${ability.ability.name
      .substring(0, 1)
      .toUpperCase()}${ability.ability.name.substring(1).toLowerCase()}`;
    pokemonAbilityLi.appendChild(pokemonAbilitySpan);
    pokemonAbilities.appendChild(pokemonAbilityLi);
  });

  if (data.id > 1) {
    pokemonPrevious.removeAttribute("disabled");
    pokemonPrevious.onclick = async () => {
      await getPokemon(data.id - 1);
    };
  } else {
    pokemonPrevious.setAttribute("disabled", true);
  }

  if (data.id < 1025) {
    pokemonNext.removeAttribute("disabled");
    pokemonNext.onclick = async () => {
      await getPokemon(data.id + 1);
    };
  } else {
    pokemonNext.setAttribute("disabled", true);
  }
};

pokemonSearch.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pokemon = searchInput.value.toLowerCase();
  searchInput.value = "";
  await getPokemon(pokemon);
});
