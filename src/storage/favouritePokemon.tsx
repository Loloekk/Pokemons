import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FAVOURITE_KEY } from "../constants/storage";

export async function getFavouritePokemonName() {
  return AsyncStorage.getItem(FAVOURITE_KEY);
}

export async function setFavouritePokemonName(name: string) {
  await AsyncStorage.setItem(FAVOURITE_KEY, name);
}

export async function removeFavouritePokemonName() {
  await AsyncStorage.removeItem(FAVOURITE_KEY);
}

export async function saveFavouritePokemonName(name: string | null) {
  if (name) {
    await setFavouritePokemonName(name);
  } else {
    await removeFavouritePokemonName();
  }
}

export function useFavouritePokemonName() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["favourite"],
    queryFn: () => getFavouritePokemonName(),
  });

  const mutation = useMutation({
    mutationFn: async (name: string | null): Promise<string | null> => {
      await saveFavouritePokemonName(name);
      return name;
    },
    onSuccess: (name: string | null) => {
      queryClient.setQueryData(["favourite"], name);
    },
  });

  return {
    favouritePokemonName: query.data ?? null,
    isLoading: query.isLoading,
    refetch: query.refetch,
    toggleFavourite: mutation.mutate,
  };
}
