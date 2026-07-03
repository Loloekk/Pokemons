import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen 
            name="index"
            options={{ title: 'List'}} 
        />
        <Tabs.Screen 
            name="bulbasaur"
            options={{ title: 'Bulbasaur'}} 
        />
        <Tabs.Screen 
            name="pokemon/[name]"
            options={{ 
              href: null,
              title: 'Pokemons'}} 
        />
      </Tabs>
  );
}