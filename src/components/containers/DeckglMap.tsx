import { useEffect, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";

import DeckGL from "@deck.gl/react";
import {
  FlyToInterpolator,
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight,
} from "@deck.gl/core";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";

import Tooltip from "@/components/reusable-ui-components/tooltip";
import worldGEOJSON from "@/data/world.json";

// console.log(
//   "data",
//   worldGEOJSON.features
//     .map((d) => {
//       return {
//         longName: d.properties.name_long,
//         shortName: d.properties.adm0_a3,
//       };
//     })
//     .sort((a, b) => a.longName.localeCompare(b.longName))
// );
const LIGHT_GRAY = [234, 234, 234, 255];
const BLACK = [0, 0, 0, 255];
type DataType = {
  position: [longitude: number, latitude: number];
  message: string;
};
const defaultOpacity = 235;
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
const twoSigFigFormatter = d3.format(".2r");
const elevationScale = d3.scaleLinear().domain([-1, 1]).range([0, 2000]);

const DeckglMap = ({
  zoomToWhichState,
  zoomToWhichCounty,
  geographyData,
  data,
  colorVariable,
  xVariable,
  yVariable,
  width,
  height,
  currentStepIndex,
}: {
  zoomToWhichState: Record<string, any>; // Adjust type as necessary
  zoomToWhichCounty: Record<string, any>; // Adjust type as necessary
  geographyData: GeoJSON.FeatureCollection;
  data: any; // Assuming GeoJSON type, adjust if necessary
  colorVariable: string;
  xVariable: string;
  yVariable: string;
  width: number;
  height: number;
  currentStepIndex: number;
}) => {
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1,
    pitch: 0,
    bearing: 0,
  });

  const getScatterplotConfig = useCallback((stepIndex: number) => {
    return {
      radius: stepIndex === 2 ? 200000 : 100000,
      // Use the predefined color arrays
      fillColor: stepIndex === 3 ? BLACK : LIGHT_GRAY,
      lineWidth: stepIndex === 1 ? 30000 : 1,
    };
  }, []);
  const [hoverInfo, setHoverInfo] = useState<PickingInfo<DataType>>({});

  const layers = useMemo(
    () =>
      [
        new GeoJsonLayer({
          id: "world-layer",
          data: worldGEOJSON,
          getFillColor: [255, 0, 0, 2],
          wireframe: true,
          pickable: true,
          autoHighlight: false,
          stroked: true,
          getLineColor: [0, 0, 0, 255],
          // extruded: true,
          // getElevation: (f) => {
          //   // console.log(elevationScale(f.properties[colorVariable]));
          //   return elevationScale(f.properties[colorVariable]);
          // },
          // elevationScale: 100,
          getLineWidth: 1,
          lineWidthUnits: "pixels",
          lineWidthScale: 1,
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 100,
        }),
        new ScatterplotLayer({
          id: "steel-plant-dots",
          data: data,
          stroked: true,
          getPosition: (d) => [+d.longitude, +d.latitude],
          getRadius: getScatterplotConfig(currentStepIndex).radius,
          // Use updateTriggers to force updates
          updateTriggers: {
            getFillColor: currentStepIndex,
            getLineWidth: currentStepIndex,
            getRadius: currentStepIndex,
          },
          getFillColor: getScatterplotConfig(currentStepIndex).fillColor,
          getLineColor: [0, 0, 0],
          getLineWidth: getScatterplotConfig(currentStepIndex).lineWidth,
          transitions: {
            getRadius: {
              duration: 1000,
              easing: d3.easeCubicInOut,
            },
            getFillColor: {
              duration: 1000,
              easing: d3.easeCubicInOut,
              enter: (value) => value, // Add enter transition
            },
            getLineWidth: {
              duration: 1000,
              easing: d3.easeCubicInOut,
            },
          },
          pickable: false,
        }),
      ].filter(Boolean),
    [geographyData, data, currentStepIndex, getScatterplotConfig]
  );

  const hoverLayer = useMemo(() => {
    if (!hoverInfo || !hoverInfo.object) return null;
    return new GeoJsonLayer({
      id: "hover-layer",
      data: [hoverInfo.object],
      pickable: false,
      stroked: true,
      filled: true,
      getFillColor: (d) => {
        // const { r, g, b } = d3.color(colorScale(d.properties[colorVariable]));
        const a = 255;
        return [234, 234, 234, a];
      },
      lineWidthUnits: "pixels",
      lineWidthScale: 1,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 10,
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 2,
    });
  }, [hoverInfo]);

  return (
    <map
      style={{ width: "100%", height: "100%" }}
      onMouseLeave={() => {
        setHoverInfo(null);
      }}
    >
      {/* IMPORTANT: must use initialViewState instead of viewState, which overwrites state, and uses stale state */}
      <DeckGL
        initialViewState={viewState}
        // onViewStateChange={onViewStateChange}
        controller={{
          doubleClickZoom: false,
          scrollZoom: false,
          touchRotate: true,
          minZoom: 0.000001,
          maxZoom: 10,
        }}
        layers={[...layers, hoverLayer].filter(Boolean)}
        onHover={(info) => setHoverInfo(info.object ? info : null)}
      >
        {/* {hoverInfo && hoverInfo.object && (
          <Tooltip
            left={hoverInfo.x + 10}
            top={hoverInfo.y + 10}
            county={hoverInfo.object.properties.NAME}
            state={hoverInfo.object.properties.STATENAME}
            gap={twoSigFigFormatter(hoverInfo.object.properties[colorVariable])}
            worry={twoSigFigFormatter(hoverInfo.object.properties[yVariable])}
            rating={twoSigFigFormatter(hoverInfo.object.properties[xVariable])}
            showMapUXInfo={true}
            containerWidth={width}
            containerHeight={height}
          />
        )} */}
      </DeckGL>
    </map>
  );
};

export default DeckglMap;
