export type PokemonStats = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
};

export type PokemonListItemProps = {
  name: string;
  url: string | null;
};

export type PokemonMapMarkerProps = {
  latitude: number;
  longitude: number;
  name: string;
};
