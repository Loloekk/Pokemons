import BottomSheet, { BottomSheetFlatListMethods } from "@gorhom/bottom-sheet";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import MapView, { LongPressEvent } from "react-native-maps";
import { fetchPokemonPage } from "../api/pokemon";
import Loader from "../components/Loader";
import PokemonMapList from "../components/MapScreen/PokemonMapList";
import PokemonMapMarker from "../components/MapScreen/PokemonMapMarker";
import TemporaryMarker from "../components/MapScreen/TemporaryMarker";
import PokemonListItem from "../components/PokemonListScreen/PokemonListItem";
import PokemonCard from "../components/PokemonScreen/PokemonCard";
import { TEMPORARY_MARKER_NAME } from "../constants/map";
import { usePokemonMapMarkers } from "../storage/pokemonMapMarkers";
import { PokemonDataProps, PokemonMapMarkerProps } from "../types/pokemon";

export default function MapScreen() {
  const [pendingLocation, setPendingLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pickerListRef = useRef<BottomSheetFlatListMethods>(null);
  const { markers, addPokemonMapMarkerAsync, removePokemonMapMarkerAsync } =
    usePokemonMapMarkers();
  const [temporaryMarker, setTemporaryMarker] = useState<
    PokemonMapMarkerProps | undefined
  >(undefined);
  const mapRef = useRef<MapView>(null);
  const { height: screenHeight } = useWindowDimensions();
  const [pickerSheetIndex, setPickerSheetIndex] = useState<number>(-1);
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
    null,
  );

  const detailsSheetRef = useRef<BottomSheet>(null);
  const pickerSheetRef = useRef<BottomSheet>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["pokemon-list"],
      queryFn: ({ pageParam }) => fetchPokemonPage(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get("offset"));
      },
    });

  useEffect(() => {
    async function getCurrentLocation() {
      if (Platform.OS === "android") {
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    }

    getCurrentLocation();
  }, []);

  const pickerSnapPoints = useMemo(() => ["34%", "62%"], []);
  const detailsSnapPoints = useMemo(() => ["62%"], []);
  const mapPadding = useMemo(
    () => ({
      top: 0,
      right: 0,
      bottom: selectedPokemonName
        ? screenHeight * 0.51
        : pickerSheetIndex === 1
          ? screenHeight * 0.51
          : pickerSheetIndex === 0
            ? screenHeight * 0.28
            : 0,
      left: 0,
    }),
    [pickerSheetIndex, screenHeight, selectedPokemonName],
  );

  if (Platform.OS === "android") {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          Buy Iphone, Android is not supported.
        </Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Loader />
        <Text style={styles.message}>Getting your location...</Text>
      </View>
    );
  }

  const { latitude, longitude } = location.coords;

  const pokemons =
    data?.pages.flatMap((page) => {
      return page.results;
    }) ?? [];

  const loadPokemons = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <Loader />;
  };

  if (isLoading) {
    return <Loader />;
  }

  const handleLongPress = async (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setPendingLocation({ latitude, longitude });
    setSelectedPokemonName(null);
    detailsSheetRef.current?.close();
    setTemporaryMarker({
      latitude,
      longitude,
      name: TEMPORARY_MARKER_NAME,
    });
    setPickerSheetIndex(0);
    pickerSheetRef.current?.snapToIndex(0);
    pickerListRef.current?.scrollToIndex({ index: 0 });
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handlePress = async () => {
    setSelectedPokemonName(null);
    detailsSheetRef.current?.close();
    setPickerSheetIndex(-1);
    pickerSheetRef.current?.close();
    setTemporaryMarker(undefined);
    setPendingLocation(null);
  };

  const handlePokemonSelect = async (pokemon: PokemonDataProps) => {
    if (!pendingLocation) return;
    setPendingLocation(null);
    pickerSheetRef.current?.close();
    setSelectedPokemonName(pokemon.name);
    detailsSheetRef.current?.snapToIndex(0);
    await addPokemonMapMarkerAsync({
      latitude: pendingLocation.latitude,
      longitude: pendingLocation.longitude,
      name: pokemon.name,
    });
    setTemporaryMarker(undefined);
  };

  const handleMarkerPress = (
    pokemonName: string,
    latitude: number,
    longitude: number,
  ) => {
    setSelectedPokemonName(pokemonName);
    setPickerSheetIndex(-1);
    setPendingLocation(null);
    pickerSheetRef.current?.close();
    detailsSheetRef.current?.snapToIndex(0);
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const renderItem = ({ item }: { item: PokemonDataProps }) => {
    return (
      <Pressable onPress={() => handlePokemonSelect(item)}>
        <PokemonListItem pokemonProps={item} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        mapPadding={mapPadding}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={true}
        onPress={handlePress}
        onLongPress={handleLongPress}
      >
        {Object.values(markers).map((marker) => (
          <PokemonMapMarker
            key={marker.name}
            {...marker}
            onPress={() =>
              handleMarkerPress(marker.name, marker.latitude, marker.longitude)
            }
          />
        ))}
        {temporaryMarker && (
          <TemporaryMarker
            latitude={temporaryMarker.latitude}
            longitude={temporaryMarker.longitude}
          />
        )}
      </MapView>
      <BottomSheet
        ref={pickerSheetRef}
        index={-1}
        snapPoints={pickerSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        onClose={async () => {
          setPendingLocation(null);
          setPickerSheetIndex(-1);
          setTemporaryMarker(undefined);
        }}
        onChange={(index: number) => {
          setPickerSheetIndex(index);
        }}
      >
        <PokemonMapList
          data={pokemons}
          renderItem={renderItem}
          loadPokemons={loadPokemons}
          renderFooter={renderFooter}
          ref={pickerListRef}
        />
      </BottomSheet>
      <BottomSheet
        ref={detailsSheetRef}
        index={-1}
        snapPoints={detailsSnapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        onClose={() => {
          setSelectedPokemonName(null);
        }}
      >
        {selectedPokemonName && (
          <PokemonCard
            pokemonName={selectedPokemonName}
            toggleRemoveFromMap={async () => {
              if (selectedPokemonName) {
                await removePokemonMapMarkerAsync(selectedPokemonName);
              }
              detailsSheetRef.current?.close();
              setSelectedPokemonName(null);
            }}
          />
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  message: { fontSize: 18, textAlign: "center" },
});
