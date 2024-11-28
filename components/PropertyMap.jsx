// 'use client';
// import { useEffect, useState } from 'react';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import Map, { Marker } from 'react-map-gl';
// import { setDefaults, fromAddress } from 'react-geocode';
// import Spinner from './Spinner';
// import Image from 'next/image';
// import pin from '@/assets/images/pin.svg';

// const PropertyMap = ({ property }) => {
//   const [lat, setLat] = useState(null);
//   const [lng, setLng] = useState(null);
//   const [viewport, setViewport] = useState({
//     latitude: 0,
//     longitude: 0,
//     zoom: 12,
//     width: '100%',
//     height: '500px',
//   });
//   const [loading, setLoading] = useState(true);
//   const [geocodeError, setGeocodeError] = useState(false);

//   setDefaults({
//     key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
//     language: 'en',
//     region: 'us',
//   });

//   useEffect(() => {
//     const fetchCoords = async () => {
//       try {
//         const res = await fromAddress(
//           `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
//         );

//         //  Check for results
//         if (res.results.length === 0) {
//           // No results found
//           setGeocodeError(true);
//           setLoading(false);
//           return;
//         }

//         const { lat, lng } = res.results[0].geometry.location;

//         setLat(lat);
//         setLng(lng);
//         setViewport({
//           ...viewport,
//           latitude: lat,
//           longitude: lng,
//         });

//         setLoading(false);
//       } catch (error) {
//         console.log(error);
//         setGeocodeError(true);
//         setLoading(false);
//       }
//     };

//     fetchCoords();
//   }, []);

//   if (loading) return <Spinner loading={loading} />;

//   // Handle case where geocoding failed
//   if (geocodeError) {
//     return <div className='text-xl'>No location data found</div>;
//   }

//   return (
//     !loading && (
//       <Map
//         mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
//         mapLib={import('mapbox-gl')}
//         initialViewState={{
//           longitude: lng,
//           latitude: lat,
//           zoom: 15,
//         }}
//         style={{ width: '100%', height: 500 }}
//         mapStyle='mapbox://styles/mapbox/streets-v9'
//       >
//         <Marker longitude={lng} latitude={lat} anchor='bottom'>
//           <Image src={pin} alt='location' width={40} height={40} />
//         </Marker>
//       </Map>
//     )
//   );
// };
// export default PropertyMap;
"use client";
import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl";
import Geocode from "nominatim-geocoder";
import Spinner from "./Spinner";
import Image from "next/image";
import pin from "@/assets/images/pin.svg";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  const geocoder = new Geocode();

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const query = `${property.location.street || ""}, ${property.location.city || ""}, ${property.location.state || ""}, ${property.location.zipcode || ""}`.trim().replace(/\s{2,}/g, " "); // Clean up extra spaces

        if (!query) {
          throw new Error("Invalid address data");
        }

        const res = await geocoder.search({ q: query });

        if (!res || res.length === 0) {
          setGeocodeError(true);
          setLoading(false);
          return;
        }

        const { lat, lon } = res[0];

        setLat(parseFloat(lat));
        setLng(parseFloat(lon));
        setViewport({
          ...viewport,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
      } catch (error) {
        console.error("Geocoding Error:", error.message);
        setGeocodeError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, []);

  if (loading) return <Spinner loading={loading} />;

  if (geocodeError) {
    return <div className="text-xl">No location data found.</div>;
  }

  return (
    <>
      {!loading && (
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          mapLib={import("mapbox-gl")}
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: 13,
          }}
          style={{ width: "100%", height: 500 }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <Marker longitude={lng} latitude={lat} anchor="bottom">
            <Image src={pin} alt="location" width={40} height={40} />
          </Marker>
        </Map>
      )}
    </>
  );
};

export default PropertyMap;
