import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { POKEMON_MAP_MARKERS_KEY } from "../constants/storage";
import { PokemonMapMarkerProps } from "../types/pokemon";

export type PokemonMapMarkers = Record<string, PokemonMapMarkerProps>;

async function getPokemonMapMarkers() {
  const raw = await AsyncStorage.getItem(POKEMON_MAP_MARKERS_KEY);

  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as PokemonMapMarkers;
  } catch (error) {
    console.error("Error parsing pokemon map markers", error);
    return {};
  }
}

async function setPokemonMapMarkers(markers: PokemonMapMarkers) {
  await AsyncStorage.setItem(POKEMON_MAP_MARKERS_KEY, JSON.stringify(markers));
}

export async function removePokemonMapMarkers() {
  await AsyncStorage.removeItem(POKEMON_MAP_MARKERS_KEY);
}

async function removePokemonMapMarker(name: string) {
  const markers = await getPokemonMapMarkers();
  delete markers[name];
  await setPokemonMapMarkers(markers);
}

async function addPokemonMapMarker(marker: PokemonMapMarkerProps) {
  const markers = await getPokemonMapMarkers();
  markers[marker.name] = marker;
  await setPokemonMapMarkers(markers);
}

export function usePokemonMapMarkers() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["pokemon-map-markers"],
    queryFn: () => getPokemonMapMarkers(),
  });

  const addPokemonMapMarkerMutation = useMutation({
    mutationFn: async (
      marker: PokemonMapMarkerProps,
    ): Promise<PokemonMapMarkerProps> => {
      await addPokemonMapMarker(marker);
      return marker;
    },
    onSuccess: (marker: PokemonMapMarkerProps) => {
      queryClient.setQueryData<PokemonMapMarkers>(
        ["pokemon-map-markers"],
        (old) => ({
          ...old,
          [marker.name]: marker,
        }),
      );
    },
  });

  const removePokemonMapMarkerMutation = useMutation({
    mutationFn: async (name: string): Promise<string> => {
      await removePokemonMapMarker(name);
      return name;
    },
    onSuccess: (name: string) => {
      queryClient.setQueryData<PokemonMapMarkers>(
        ["pokemon-map-markers"],
        (old = {}) => {
          const { [name]: _, ...rest } = old;
          return rest;
        },
      );
    },
  });

  return {
    markers: query.data ?? {},
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    addPokemonMapMarkerAsync: addPokemonMapMarkerMutation.mutateAsync,
    removePokemonMapMarkerAsync: removePokemonMapMarkerMutation.mutateAsync,
  };
}
