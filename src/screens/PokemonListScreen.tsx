import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Pokemon = {
    name: string;
    url: string | null;
}

type PokemonListResponse = {
    count : number;
    next : string | null;
    previous: string | null;
    results: Pokemon[];
}

export default function PokemonListScreen() {
    const insets = useSafeAreaInsets();
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoding] = useState<boolean> (false);
    const [nextUrl, setNextUrl] = useState<string | null> ('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10');



    const getPokemonImageUrl = (pokemon: Pokemon) => {
        if (!pokemon.url) return "";
    
        const id = pokemon.url.split('/').filter(Boolean).pop();
        if (!id) return "";
    
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };

    const fetchPokemons = async () => {
        if (isLoading || !nextUrl)
            return;
        try{
            setIsLoding(true);
            const response = await fetch(nextUrl);
            const data: PokemonListResponse = await response.json();
            setPokemons(prevPokemons => [...prevPokemons, ...data.results]);
            setNextUrl(data.next);
        }   
        catch (error){
            console.error('Pokemons list fetch failed: ', error);
        }
        finally{
            setIsLoding(false);
        }
    }


    const renderItem = ({ item }: { item: Pokemon }) => (
        <View style={styles.card}>
            <Image 
                source={{uri: getPokemonImageUrl(item)}} 
                style={styles.image} 
            />
            <Text style={styles.name}>{item.name}</Text>
        </View>
    );

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#e3350d" />
            </View>
        );
    };

    return (
        <View style={[styles.container,{paddingTop: insets.top+20}]}>
            <View style={styles.header}>
                <Text style={styles.title}>Pokemons</Text>
            </View>

            <FlatList
                data={pokemons}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                onEndReached={fetchPokemons}
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#e3350d',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 30,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        textTransform: 'capitalize',
        color: '#333',
    },
    loaderContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

