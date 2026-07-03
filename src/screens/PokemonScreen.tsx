import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PokemonStats = {
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string | null;
    };
}

type PokemonScreenProps = {
    pokemonName?: string;
}

export default function PokemonScreen({pokemonName = 'bulbasaur'}: PokemonScreenProps) {
    const insets = useSafeAreaInsets();
    const [pokemon, setPokemon] = useState<PokemonStats | null>(null);
    const [isLoading, setIsLoding] = useState<boolean>(true);

    useEffect(() => {
        const fetchPokemon = async () => {
            setIsLoding(true);
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName);
                const data = await response.json();
                setPokemon(data);
            }
            catch (error) {
                console.error("Pokemon fetch error: ", error)
            }
            finally {
                setIsLoding(false);
            }
        }
        fetchPokemon();
    }, [pokemonName]);

    if (isLoading) {
        return <Text>Loading!</Text>;
    }

    if (!pokemon) {
        return <Text>Pokemon fetch failed</Text>
    }

    return (
        <View style={[styles.container, {paddingTop: insets.top+20}]}>
            
            
            <View style={styles.header} >
                <Text style={styles.title}>{pokemon.name}</Text>
            </View>
            <View style={[styles.card, {
                marginLeft: insets.left + 10,
                marginRight: insets.right + 10,
                marginTop: 10}]} >
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
        backgroundColor: '#f5f5f5',
    },
    card: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#aaa',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        padding: 20,
        backgroundColor: '#e3350d',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        color: 'white',
    },
    params: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    image: {
        width: 200,
        height: 200,
    },
});