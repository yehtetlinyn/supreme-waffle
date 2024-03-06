import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";

import { HiLocationMarker } from "react-icons/hi";
import { MapContainer, TileLayer } from "react-leaflet";
import { GrClose } from "react-icons/gr";
import { useSearchParams } from "next/navigation";
import { Marker, Tooltip, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import styles from "./map.module.css";
import commonStyles from "../styles/commonStyles.module.css";
import LocationPickerMarker from "./locationPickerMarker";
import axios from "axios";

const LocationPickerModal = ({
  location,
  setLocation,
  isOpen = false,
  toggle,
  loadingData,
  setValue,
  getValues,
  clearErrors,
  selectedAccordionIndex,
  edit = false,
  create = false,
  view = false,
}) => {
  const searchParams = useSearchParams();
  const activeTabName = searchParams.get("tab") || "site";

  const [markerPosition, setMarkerPosition] = useState({});

  const [markerName, setMarkerName] = useState("---");
  const [isLoading, setIsLoading] = useState(false);

  const basemapUrl =
    "https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

  const mapApiKey =
    "AAPK5aa7fd347c824282aaf6f1e1ebdd9d35QdnSHcENH8tbDuG1xxs5x3qkk_Y5V9sFUsDhQf8eafojt0lkZ9SUFcNqzzqJYQbP";

  const reverseGeocodeUrl =
    "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode";

  const pickLocation = () => {
    //setLocation({ ...markerPosition, location: markerName });
    if (activeTabName == "site") {
      // after selecting location in site tab, the lat long will automatically fill in respective input field
      setValue("latitude", markerPosition.lat);
      setValue("longitude", markerPosition.lng);
      setValue("location", markerName);
      clearErrors(["location", "latitude", "longitude"]);
    } else if (activeTabName == "attendanceCheckpoint") {
      // after selecting location in attendance checkpoint tab, the lat long will automatically fill in respective input field
      setValue(
        `attendanceCheckpoint.${selectedAccordionIndex}.latitude`,
        markerPosition.lat
      );
      setValue(
        `attendanceCheckpoint.${selectedAccordionIndex}.longitude`,
        markerPosition.lng
      );
      setValue(
        `attendanceCheckpoint.${selectedAccordionIndex}.location`,
        markerName
      );
      clearErrors([
        `attendanceCheckpoint.${selectedAccordionIndex}.latitude`,
        `attendanceCheckpoint.${selectedAccordionIndex}.longitude`,
        `attendanceCheckpoint.${selectedAccordionIndex}.location`,
      ]);
    }
    toggle();
  };

  const hasLatLongValueInAttendanceCheckpoint =
    getValues(`attendanceCheckpoint[${selectedAccordionIndex}].latitude`) &&
    getValues(`attendanceCheckpoint[${selectedAccordionIndex}].longitude`)
      ? true
      : false;

  const hasLatLongInSite =
    getValues().latitude && getValues().longitude ? true : false;

  // for current location
  // if there is no lat long in input box => get current location
  // if there is lat long in input box  => get the exisiting location
  const getLocation = (hasLatLong, latitude, longitude) => {
    //const error = (err) => console.log("gelocation error", err);
    // const options = {
    //   enableHighAccuracy: true,
    //   maximumAge: 15000,
    //   timeout: 30000,
    // };
    if (!hasLatLong) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position?.coords;
            setMarkerPosition({
              ...markerPosition,
              lat: latitude,
              lng: longitude,
            });
          }
          // error,
          // options
        );
      }
    } else {
      setMarkerPosition({
        lat: latitude,
        lng: longitude,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (activeTabName === "site") {
        // site create and edit choose on map
        getLocation(
          hasLatLongInSite,
          getValues().latitude,
          getValues().longitude
        );
      } else if (activeTabName === "attendanceCheckpoint") {
        // attendance checkpoint choose on map
        const latitude = getValues(
          `attendanceCheckpoint[${selectedAccordionIndex}].latitude`
        );
        const longitude = getValues(
          `attendanceCheckpoint[${selectedAccordionIndex}].longitude`
        );
        getLocation(hasLatLongValueInAttendanceCheckpoint, latitude, longitude);
      }
    }
  }, [isOpen]);

  // * to get loocation detail from arcgis api
  useEffect(() => {
    if (markerPosition.lat && markerPosition.lng && markerPosition !== null) {
      const fetchLocationName = async () => {
        setIsLoading(true);

        try {
          const { data } = await axios.get(reverseGeocodeUrl, {
            params: {
              location: `${markerPosition?.lng},${markerPosition?.lat}`,
              f: "json",
              token: mapApiKey,
            },
          });
          console.log("data", data);
          setMarkerName(data.address?.ShortLabel);
        } catch (err) {
          console.log(err);
        }

        setIsLoading(false);
      };

      !!reverseGeocodeUrl && !!mapApiKey && fetchLocationName();
    }
  }, [markerPosition]);

  return (
    <Modal
      centered
      isOpen={isOpen}
      backdropClassName={
        activeTabName === "attendanceCheckpoint" ? styles.mapModal : ""
      }
    >
      <ModalHeader className={styles.modalheader}>
        <span>Select a Location </span>
        <span onClick={toggle}>
          <GrClose color="#c60e0e" />
        </span>
      </ModalHeader>

      <ModalBody>
        <div className={styles.modalbody}>
          {markerPosition?.lat && markerPosition?.lng ? (
            <MapContainer
              center={[markerPosition?.lat, markerPosition?.lng]}
              zoom={25}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
              doubleClickZoom={false}
              attributionControl={true}
            >
              <TileLayer
                url={`${basemapUrl}?token=${mapApiKey}`}
                // url={`https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}?token=${mapApiKey}`}
              />

              <LocationPickerMarker
                markerPosition={[markerPosition?.lat, markerPosition?.lng]}
                //   markerPosition={[16.8230912, 96.157696]}
                setMarkerPosition={setMarkerPosition}
                view={view}
              />
            </MapContainer>
          ) : (
            <span>Loading...</span>
          )}
        </div>
        <div className={styles.tail}>
          <div className={styles.locationName}>
            <span className="d-inline-flex align-items-center">
              <HiLocationMarker style={{ fontSize: "1rem" }} />
              {isLoading ? (
                <span style={{ color: "#000000" }}>
                  {"finding nearest location..."}
                </span>
              ) : (
                <span>{markerName ? markerName : "---"}</span>
              )}
            </span>
          </div>
          <div className={styles.zoomNote}>
            <span>Please zoom in (+) for better accuracy</span>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <Button
              onClick={view ? toggle : pickLocation}
              className={commonStyles.formCreateBtn}
            >
              {view ? "Close" : "Done"}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default LocationPickerModal;
