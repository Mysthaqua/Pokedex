import Engine from "./Engine.js";
import Pokemon from "./Pokemon.js";

const API_URL = "https://pokeapi.co/api/v2";

export default class G1Engine extends Engine {
  constructor(scale = 4) {
    super();

    this.scale = 8 * scale;
    this.pokemons = [];

    (async () => {
      for (let i = 1; i < 8; i++) {
        await this.getPokemon(i).then((pokemon) => this.pokemons.push(pokemon));
      }
    })();

    this.background = new Image();
    this.background.src = "./assets/img/G1/pokedex.png";

    this.background.addEventListener("load", () => {
      this.width = (this.background.width * this.scale) / 8;
      this.height = (this.background.height * this.scale) / 8;

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.ctx.font = `${this.scale}px G1`;
    });

    this.pokeball = new Image();
    this.pokeball.src = "./assets/img/G1/pokeball.png";

    this.cursorLeft = new Image();
    this.cursorLeft.src = "./assets/img/G1/cursor1.png";
    this.cursorLeft.pos = 3;

    this.cursorRight = new Image();
    this.cursorRight.src = "./assets/img/G1/cursor1.png";
    this.cursorRight.pos = 10;

    this.selected = false;
    this.updating = false;

    window.addEventListener("keydown", (e) => {
      let pokemon, pokemonsSeen, pokemonsCaught;
      switch (e.key) {
        case "ArrowDown":
          if (!this.selected) {
            if (this.cursorLeft.pos < 15) {
              this.cursorLeft.pos += 2;
            } else if (this.pokemons[this.pokemons.length - 1].id < 151) {
              if (!this.updating) this.nextPokemon();
            }
          } else if (this.cursorRight.pos < 16) {
            this.cursorRight.pos += 2;
          }
          break;
        case "ArrowUp":
          if (!this.selected) {
            if (this.cursorLeft.pos > 3) {
              this.cursorLeft.pos -= 2;
            } else if (this.pokemons[0].id > 1) {
              if (!this.updating) this.previousPokemon();
            }
          } else if (this.cursorRight.pos > 10) {
            this.cursorRight.pos -= 2;
          }
          break;
        case "Enter":
        case "ArrowRight":
          if (!this.selected) {
            this.selected = true;
            this.cursorLeft.src = "./assets/img/G1/cursor2.png";
            this.cursorRight.pos = 10;
          }
          break;
        case "Escape":
        case "ArrowLeft":
          this.selected = false;
          this.cursorLeft.src = "./assets/img/G1/cursor1.png";
          break;
        case "s":
          pokemon = this.pokemons[Math.floor(this.cursorLeft.pos / 2) - 1];
          pokemonsSeen = JSON.parse(localStorage.getItem("pokemonsSeen")) ?? [];
          pokemonsCaught =
            JSON.parse(localStorage.getItem("pokemonsCaught")) ?? [];

          if (pokemon.hasBeenSeen) {
            pokemon.hasBeenSeen = false;
            pokemonsSeen = pokemonsSeen.filter((id) => id !== pokemon.id);
            localStorage.setItem("pokemonsSeen", JSON.stringify(pokemonsSeen));
            pokemon.hasBeenCaught = false;
            pokemonsCaught = pokemonsCaught.filter((id) => id !== pokemon.id);
            localStorage.setItem(
              "pokemonsCaught",
              JSON.stringify(pokemonsCaught)
            );
          } else {
            pokemon.hasBeenSeen = true;
            pokemonsSeen.push(pokemon.id);
            localStorage.setItem("pokemonsSeen", JSON.stringify(pokemonsSeen));
          }
          break;
        case "c":
          pokemon = this.pokemons[Math.floor(this.cursorLeft.pos / 2) - 1];
          pokemonsSeen = JSON.parse(localStorage.getItem("pokemonsSeen")) ?? [];
          pokemonsCaught =
            JSON.parse(localStorage.getItem("pokemonsCaught")) ?? [];

          if (pokemon.hasBeenCaught) {
            pokemon.hasBeenCaught = false;
            pokemonsCaught = pokemonsCaught.filter((id) => id !== pokemon.id);
            localStorage.setItem(
              "pokemonsCaught",
              JSON.stringify(pokemonsCaught)
            );
          } else {
            pokemon.hasBeenCaught = true;
            pokemonsCaught.push(pokemon.id);
            localStorage.setItem(
              "pokemonsCaught",
              JSON.stringify(pokemonsCaught)
            );
            pokemon.hasBeenSeen = true;
            pokemonsSeen.push(pokemon.id);
            localStorage.setItem("pokemonsSeen", JSON.stringify(pokemonsSeen));
          }
          break;
      }
    });

    const controls = document.createElement("div");

    const p = document.createElement("p");
    p.innerHTML = "Controls:";
    controls.appendChild(p);

    const ul = document.createElement("ul");

    const liArrows = document.createElement("li");
    const spanArrows = document.createElement("span");
    spanArrows.innerHTML = "Arrow keys: navigate";
    liArrows.appendChild(spanArrows);

    const liEnter = document.createElement("li");
    const spanEnter = document.createElement("span");
    spanEnter.innerHTML = "Enter: select";
    liEnter.appendChild(spanEnter);

    const liEscape = document.createElement("li");
    const spanEscape = document.createElement("span");
    spanEscape.innerHTML = "Escape: cancel";
    liEscape.appendChild(spanEscape);

    const liS = document.createElement("li");
    const spanS = document.createElement("span");
    spanS.innerHTML = "S: seen";
    liS.appendChild(spanS);

    const liC = document.createElement("li");
    const spanC = document.createElement("span");
    spanC.innerHTML = "C: caught";
    liC.appendChild(spanC);

    ul.appendChild(liArrows);
    ul.appendChild(liEnter);
    ul.appendChild(liEscape);
    ul.appendChild(liS);
    ul.appendChild(liC);
    controls.appendChild(ul);

    document.body.appendChild(controls);
  }

  draw() {
    if (this.updating) return;

    this.ctx.drawImage(this.background, 0, 0, this.width, this.height);

    this.ctx.fillText("CONTENTS", this.scale, 2 * this.scale);
    this.ctx.fillText("SEEN", 16 * this.scale, 3 * this.scale);
    this.ctx.fillText("OWN", 16 * this.scale, 6 * this.scale);
    this.ctx.fillText("DATA", 16 * this.scale, 11 * this.scale);
    this.ctx.fillText("CRY", 16 * this.scale, 13 * this.scale);
    this.ctx.fillText("AREA", 16 * this.scale, 15 * this.scale);
    this.ctx.fillText("QUIT", 16 * this.scale, 17 * this.scale);

    const pokemonsSeen = JSON.parse(localStorage.getItem("pokemonsSeen")) ?? [];
    const pokemonsCaught =
      JSON.parse(localStorage.getItem("pokemonsCaught")) ?? [];
    this.ctx.fillText(pokemonsSeen.length, 18 * this.scale, 4 * this.scale);
    this.ctx.fillText(pokemonsCaught.length, 18 * this.scale, 7 * this.scale);

    this.pokemons.forEach((pokemon, i) => {
      this.ctx.fillText(
        `${
          pokemon?.hasBeenSeen ? pokemon.id.toString().padStart(3, "0") : "000"
        }`,
        this.scale,
        (3 + 2 * i) * this.scale
      );
      this.ctx.fillText(
        pokemon?.hasBeenSeen ? pokemon.name.toUpperCase() : `-`.repeat(10),
        4 * this.scale,
        (4 + 2 * i) * this.scale
      );
      if (pokemon?.hasBeenCaught) {
        this.ctx.drawImage(
          this.pokeball,
          3 * this.scale,
          (2 * i + 3) * this.scale,
          this.scale,
          this.scale
        );
      }
    });

    this.ctx.drawImage(
      this.cursorLeft,
      0,
      this.cursorLeft.pos * this.scale,
      this.scale,
      this.scale
    );
    if (this.selected) {
      this.ctx.drawImage(
        this.cursorRight,
        15 * this.scale,
        this.cursorRight.pos * this.scale,
        this.scale,
        this.scale
      );
    }
  }

  nextPokemon() {
    this.updating = true;
    this.pokemons.shift();
    this.getPokemon(this.pokemons[this.pokemons.length - 1].id + 1).then(
      (pokemon) => {
        this.pokemons.push(pokemon);
        this.updating = false;
      }
    );
  }

  previousPokemon() {
    this.updating = true;
    this.pokemons.pop();
    this.getPokemon(this.pokemons[0].id - 1).then((pokemon) => {
      this.pokemons.unshift(pokemon);
      this.updating = false;
    });
  }

  async getPokemon(i) {
    const data = await (await fetch(`${API_URL}/pokemon/${i}`)).json();

    const pokemonsSeen = JSON.parse(localStorage.getItem("pokemonsSeen")) ?? [];
    const pokemonsCaught =
      JSON.parse(localStorage.getItem("pokemonsCaught")) ?? [];

    return new Pokemon(
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
      ),
      pokemonsSeen.includes(data.id),
      pokemonsCaught.includes(data.id)
    );
  }
}
