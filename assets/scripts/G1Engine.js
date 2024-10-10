import Engine from "./Engine.js";
import Pokemon from "./Pokemon.js";

const API_URL = "https://pokeapi.co/api/v2";

export default class G1Engine extends Engine {
  constructor(scale = 4) {
    super();

    this.scale = 8 * scale;
    this.index = 1;
    this.pokemons = [];
    this.getPokemons();

    this.background = new Image();
    this.background.src = "./assets/img/G1/pokedex.png";

    this.width = (this.background.width * this.scale) / 8;
    this.height = (this.background.height * this.scale) / 8;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx.font = `${this.scale}px G1`;

    this.pokeball = new Image();
    this.pokeball.src = "./assets/img/G1/pokeball.png";

    this.cursorLeft = new Image();
    this.cursorLeft.src = "./assets/img/G1/cursor1.png";
    this.cursorLeft.pos = 3;

    this.cursorRight = new Image();
    this.cursorRight.src = "./assets/img/G1/cursor1.png";
    this.cursorRight.pos = 10;

    this.selected = false;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowDown":
          if (!this.selected) {
            if (this.cursorLeft.pos < this.pokemons.length * 2 + 1) {
              this.cursorLeft.pos += 2;
            } else if (
              this.cursorLeft.pos == this.pokemons.length * 2 + 1 &&
              this.index < 148
            ) {
              this.cursorLeft.pos = 3;
              this.index += 7;
              this.getPokemons();
            }
          } else if (this.cursorRight.pos < 16) {
            this.cursorRight.pos += 2;
          }
          break;
        case "ArrowUp":
          if (!this.selected) {
            if (this.cursorLeft.pos > 3) {
              this.cursorLeft.pos -= 2;
            } else if (this.cursorLeft.pos == 3 && this.index > 1) {
              this.cursorLeft.pos = 15;
              this.index -= 7;
              this.getPokemons();
            }
          } else if (this.cursorRight.pos > 10) {
            this.cursorRight.pos -= 2;
          }
          break;
        case "Enter":
          if (!this.selected) {
            this.selected = true;
            this.cursorLeft.src = "./assets/img/G1/cursor2.png";
            this.cursorRight.pos = 10;
          }
          break;
        case "Escape":
          this.selected = false;
          this.cursorLeft.src = "./assets/img/G1/cursor1.png";
          break;
        /* case "ArrowLeft":
          if (this.cursor.pos.x == 15) {
            this.cursor.pos.x = 0;
            this.cursor.pos.y = 3;
            this.cursor.src = "./assets/img/G1/cursor.png";
          }
          break;
        case "ArrowRight":
          if (this.cursor.pos.x == 0) {
            this.cursor.pos.x = 15;
            this.cursor.pos.y = 10;
            this.cursor.src = "./assets/img/G1/cursor2.png";
          }
          break; */
      }
    });
  }

  async draw() {
    this.ctx.drawImage(this.background, 0, 0, this.width, this.height);

    this.ctx.fillText("CONTENTS", this.scale, 2 * this.scale);
    this.ctx.fillText("SEEN", 16 * this.scale, 3 * this.scale);
    this.ctx.fillText("OWN", 16 * this.scale, 6 * this.scale);
    this.ctx.fillText("DATA", 16 * this.scale, 11 * this.scale);
    this.ctx.fillText("CRY", 16 * this.scale, 13 * this.scale);
    this.ctx.fillText("AREA", 16 * this.scale, 15 * this.scale);
    this.ctx.fillText("QUIT", 16 * this.scale, 17 * this.scale);

    // PLACEHOLDER
    this.ctx.fillText("0", 18 * this.scale, 4 * this.scale);
    // PLACEHOLDER
    this.ctx.fillText("0", 18 * this.scale, 7 * this.scale);

    this.pokemons.forEach((pokemon, i) => {
      this.ctx.fillText(
        `${
          pokemon?.hasBeenSeen
            ? (this.index + i).toString().padStart(3, "0")
            : "000"
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

    // PLACEHOLDER
    /* this.ctx.drawImage(
      this.pokeball,
      3 * this.scale,
      3 * this.scale,
      this.scale,
      this.scale
    ); */

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

  async getPokemons() {
    this.pokemons = [];
    for (let i = this.index; i < this.index + 7 && i <= 151; i++) {
      const data = await (await fetch(`${API_URL}/pokemon/${i}`)).json();
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
      this.pokemons.push(pokemon);
    }
  }
}
