import { Stack, useLocalSearchParams } from "expo-router";
import PokemonDetailsScreen from "../../screens/PokemonDetailsScreen";

export default function PokemomDetailPage() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <PokemonDetailsScreen key={name} pokemonName={name} />
    </>
  );
}
