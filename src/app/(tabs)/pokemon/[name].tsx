import { useLocalSearchParams } from "expo-router";
import PokemonScreen from "../../../screens/PokemonScreen";

export default function PokemomDetailPage() {
    const { name } = useLocalSearchParams<{ name: string}>();
    return <PokemonScreen key = {name} pokemonName={name} />;
}