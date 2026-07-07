type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string | null }[];
};

const PAGE_SIZE = 20;

export async function fetchPokemonPage(
  offset: number,
): Promise<PokemonListResponse> {
  // console.log(offset);
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${PAGE_SIZE}`,
  );
  if (!response.ok) throw new Error("Failed to fetch pokemons");
  const data: PokemonListResponse = await response.json();
  return data;
}
