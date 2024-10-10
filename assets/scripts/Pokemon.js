export default class Pokemon {
  constructor(
    id,
    name,
    img,
    weight,
    height,
    types,
    abilities,
    hasBeenSeen,
    hasBeenCaught
  ) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.weight = weight;
    this.height = height;
    this.types = types;
    this.abilities = abilities;

    this.hasBeenSeen = hasBeenSeen;
    this.hasBeenCaught = hasBeenCaught;
  }

  render(container) {
    const pokemonPicture = container.querySelector("#pokemon-picture");
    pokemonPicture.src = this.img;

    const pokemonId = container.querySelector("#pokemon-id");
    pokemonId.textContent = `#${this.id}`;

    const pokemonName = container.querySelector("#pokemon-name");
    pokemonName.innerHTML = this.name;

    const pokemonWeight = container.querySelector("#pokemon-weight");
    pokemonWeight.innerHTML = `${this.weight.toFixed(1)} kg`;

    const pokemonHeight = container.querySelector("#pokemon-height");
    pokemonHeight.innerHTML = `${this.height.toFixed(1)} m`;

    const pokemonTypes = container.querySelector("#pokemon-types");
    pokemonTypes.innerHTML = "";
    this.types.forEach((type) => {
      const pokemonTypeLi = document.createElement("li");
      const pokemonTypeSpan = document.createElement("span");
      pokemonTypeSpan.innerHTML = type;
      pokemonTypeLi.appendChild(pokemonTypeSpan);
      pokemonTypes.appendChild(pokemonTypeLi);
    });

    const pokemonAbilities = container.querySelector("#pokemon-abilities");
    pokemonAbilities.innerHTML = "";
    this.abilities.forEach((ability) => {
      const pokemonAbilityLi = document.createElement("li");
      const pokemonAbilitySpan = document.createElement("span");
      pokemonAbilitySpan.innerHTML = ability;
      pokemonAbilityLi.appendChild(pokemonAbilitySpan);
      pokemonAbilities.appendChild(pokemonAbilityLi);
    });
  }
}
