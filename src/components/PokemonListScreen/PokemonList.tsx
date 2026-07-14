import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { PokemonDataProps } from "../../types/pokemon";
type PokemonListProps = {
  data: PokemonDataProps[];
  renderItem: ListRenderItem<PokemonDataProps>;
  loadPokemons: () => void;
  renderFooter: () => React.ReactElement | null;
};

export default function PokemonList({
  data,
  renderItem,
  loadPokemons,
  renderFooter,
}: PokemonListProps) {
  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokemons</Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        onEndReached={loadPokemons}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#e3350d",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    color: "#333",
  },
});
