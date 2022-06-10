import * as React from "react";
import { useEffect, useRef } from "react";

// CSS styles
import "./index.css";

// TomTom SDK
import * as tt from "@tomtom-international/web-sdk-maps";
import * as tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

export default function Home() {
  const API_KEY = "8heklGGF5vF1b9RMUZZ2Rg2rlHTPB2ms";
  const AMSTERDAM = { lon: 4.896029, lat: 52.371807 };

  const map = useRef();
  const mapContainer = useRef();

  function createRoute() {
    const routeOptions = {
      key: API_KEY,
      locations: [
        [4.87631, 52.36366],
        [4.91191, 52.36619],
      ],
      travelMode: "truck",
      vehicleCommercial: true,
    };

    tts.services.calculateRoute(routeOptions).then((response) => {
      console.log(response.toGeoJson());
      console.log(response);
      var geojson = response.toGeoJson();
      map.current.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        paint: {
          "line-color": "#a51414",
          "line-width": 8,
        },
      });

      var bounds = new tt.LngLatBounds();
      geojson.features[0].geometry.coordinates.forEach(function (point) {
        bounds.extend(tt.LngLat.convert(point)); // creates a bounding area
      });
      map.current.fitBounds(bounds, {
        duration: 300,
        padding: 50,
        maxZoom: 14,
      }); // zooms the map to the searched route
    });
  }

  useEffect(() => {
    map.current = tt.map({
      key: API_KEY,
      container: mapContainer.current.id,
      center: AMSTERDAM,
      zoom: 10,
      language: "en-GB",
    });

    map.current.addControl(new tt.FullscreenControl());
    map.current.addControl(new tt.NavigationControl());

    return () => {
      map.current.remove();
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="">
      <div className="container">
        {/* <nav className="nav">
          <h1> TomTom Maps in Gatsby</h1>
        </nav> */}
        <div ref={mapContainer} className="map" id="map" />
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            createRoute();
          }}
        >
          calculate route
        </button>
      </div>
    </div>
  );
}
