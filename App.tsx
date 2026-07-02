import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import PokemonScreen from './src/screens/PokemonScreen';
// import PokemonListScreen from './src/screens/PokemonListScreen';


export default function App() {
  return (
    <View style={styles.container}>
      <PokemonScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#434',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
