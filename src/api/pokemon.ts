import { LIST_PAGE_SIZE } from "../constants/api";

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string | null }[];
};

export async function fetchPokemonPage(
  offset: number,
): Promise<PokemonListResponse> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${LIST_PAGE_SIZE}`,
  );
  if (!response.ok) throw new Error("Failed to fetch pokemons");
  const data: PokemonListResponse = await response.json();
  return data;
}
