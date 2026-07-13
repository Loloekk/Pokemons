import { View } from "react-native";
import PokemonImage from "../PokemonImage";

export default function MapPin({ pokemonName }: { pokemonName: string }) {
  return (
    <View style={{ alignItems: "center", width: 36, height: 42 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: "#E53935",
          backgroundColor: "#fff",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PokemonImage
          pokemonName={pokemonName}
          style={{ width: 32, height: 32, borderRadius: 16 }}
          loaderSize={20}
          loaderStyle={{
            paddingVertical: 0,
            width: 32,
            height: 32,
          }}
        />
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderTopWidth: 10,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: "#E53935",
          marginTop: -2,
        }}
      />
    </View>
  );
}
