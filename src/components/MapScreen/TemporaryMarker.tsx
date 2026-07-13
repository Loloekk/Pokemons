import { Marker } from "react-native-maps";
import { TEMPORARY_MARKER_NAME } from "../../constants/map";
export default function TemporaryMarker({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return (
    <Marker
      key={TEMPORARY_MARKER_NAME}
      coordinate={{
        latitude,
        longitude,
      }}
      title={TEMPORARY_MARKER_NAME}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -20 }}
      tracksViewChanges={false}
    ></Marker>
  );
}
