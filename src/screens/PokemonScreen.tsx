import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FAVOURITE_KEY } from "../constants/storage";
import { Ionicons } from "@expo/vector-icons";

type PokemonStats = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
};

type PokemonScreenProps = {
  type: "favourite" | "details";
  pokemonNameProp?: string;
};

export default function PokemonScreen({
  pokemonNameProp = "bulbasaur",
  type = "favourite",
}: PokemonScreenProps) {
  const insets = useSafeAreaInsets();
  const [pokemonName, setPokemonName] = useState<string | null>(null);
  const [favouritePokemonName, setFavouritePokemonName] = useState<
    string | null
  >(pokemonNameProp);
  const [pokemon, setPokemon] = useState<PokemonStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadPokemon = useCallback(async () => {
    setIsLoading(true);
    let favouriteName: string | null = null;
    let name: string | null =
      type === "details" ? (pokemonNameProp ?? null) : null;
    try {
      favouriteName = await AsyncStorage.getItem(FAVOURITE_KEY);
      setFavouritePokemonName(favouriteName);
      if (type === "favourite") {
        name = favouriteName;
      }
      setPokemonName(name);
      if (!name) {
        setPokemon(null);
        return;
      }
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error("Pokemon fetch error:", error);
      setPokemon(null);
    } finally {
      setIsLoading(false);
    }
  }, [type, pokemonNameProp]);

  // useEffect(() => {
  //     if (type === 'details') {
  //         loadPokemon();
  //     }
  // }, [type, pokemonNameProp, loadPokemon]);

  useFocusEffect(
    useCallback(() => {
      loadPokemon();
    }, [loadPokemon]),
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#e3350d" />
      </View>
    );
  }

  if (!pokemonName && type === "favourite") {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: type === "favourite" ? insets.top + 20 : 0 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Favourite Pokemon</Text>
        </View>
        <View>
          <Text style={styles.params}>Like some pokemon to show him there</Text>
        </View>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: type === "favourite" ? insets.top + 20 : 0 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pokemon</Text>
        </View>
        <View>
          <Text style={styles.params}>PokemonFetchFailed</Text>
        </View>
      </View>
    );
  }

  const toggleFavourite = async () => {
    if (pokemonName === favouritePokemonName) {
      try {
        await AsyncStorage.removeItem(FAVOURITE_KEY);
        setFavouritePokemonName(null);
      } catch (error) {
        console.error("Unlike pokemon failed", error);
      }
    } else {
      try {
        if (pokemonName) {
          await AsyncStorage.setItem(FAVOURITE_KEY, pokemonName);
          setFavouritePokemonName(pokemonName);
        } else {
          await AsyncStorage.removeItem(FAVOURITE_KEY);
          setFavouritePokemonName(null);
        }
      } catch (error) {
        console.error("Like pokemon error", error);
      }
    }
  };

  const isFavourite = favouritePokemonName === pokemonName;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: type === "favourite" ? insets.top + 20 : 0 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{pokemon.name}</Text>
        <Pressable
          onPress={toggleFavourite}
          style={styles.heartButton}
          hitSlop={12}
        >
          <Ionicons
            name={isFavourite ? "heart" : "heart-outline"}
            size={28}
            color="white"
          />
        </Pressable>
      </View>
      <View
        style={[
          styles.card,
          {
            marginLeft: insets.left + 10,
            marginRight: insets.right + 10,
            marginTop: 10,
          },
        ]}
      >
        {pokemon.sprites && pokemon.sprites.front_default && (
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.image}
          />
        )}
        <Text style={styles.params}>Height: {pokemon.height}</Text>
        <Text style={styles.params}>Weight: {pokemon.weight}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#aaa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    padding: 20,
    backgroundColor: "#e3350d",
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "white",
  },
  params: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  image: {
    width: 200,
    height: 200,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  heartButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
});
