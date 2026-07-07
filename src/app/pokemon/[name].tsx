import { Stack, useLocalSearchParams } from "expo-router";
import PokemonScreen from "../../screens/PokemonScreen";

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
      <PokemonScreen key={name} pokemonNameProp={name} type="details" />
    </>
  );
}
