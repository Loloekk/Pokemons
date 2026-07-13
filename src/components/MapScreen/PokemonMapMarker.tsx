import { Marker } from "react-native-maps";
import { PokemonMapMarkerProps } from "../../types/pokemon";
import MapPin from "./MapPin";

type PokemonMapMarkerComponentProps = PokemonMapMarkerProps & {
  onPress?: (name: string) => void;
  title?: string;
};
export default function PokemonMapMarker({
  latitude,
  longitude,
  name,
  onPress,
  title,
}: PokemonMapMarkerComponentProps) {
  return (
    <Marker
      key={name}
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      title={title}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -22 }}
      tracksViewChanges={false}
      onPress={(event) => {
        event.stopPropagation?.();
        onPress?.(name);
      }}
    >
      <MapPin pokemonName={name} />
    </Marker>
  );
}
