export type PokemonStats = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
};

export type PokemonListItem = {
  name: string;
  url: string | null;
};
