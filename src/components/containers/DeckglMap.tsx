// @ts-nocheck
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import * as d3 from "d3";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import {
  FlyToInterpolator,
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight,
  PickingInfo,
} from "@deck.gl/core";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";

import Tooltip from "@/components/reusable-ui-components/tooltip";
import worldGEOJSON from "@/data/world.json";

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

const initialViewState = {
  longitude: 0,
  latitude: 0,
  zoom: 1,
  pitch: 0,
  bearing: 0,
};
const DeckglMap = memo(
  ({

    data,
    colorVariable,
    xVariable,
    yVariable,
    width,
    height,
    currentStepIndex = 0,
    STEP_CONDITIONS,
    highlightColor = [121, 180, 173, 255],
    defaultColor = [121, 180, 173, 100],
    strokeColor = [57, 144, 153, 255],
  }: {

    data: any; // Assuming GeoJSON type, adjust if necessary
    colorVariable: string;
    xVariable: string;
    yVariable: string;
    width: number;
    height: number;
    currentStepIndex: number;
    STEP_CONDITIONS: Record<number, (d: any) => boolean>;
    highlightColor: number[];
    defaultColor: number[];
    strokeColor: number[];
  }) => {
    const [viewState, setViewState] = useState(initialViewState);

    const COLORS = {
      RED: [255, 0, 0],
      LIGHT_GRAY: [211, 211, 211],
      BLACK: [234, 234, 234],
      BROWN: [165, 42, 42],
    } as const;

    const getScatterplotConfig = useCallback((stepIndex, d) => {
      const condition = STEP_CONDITIONS[stepIndex];
      const isHighlighted = condition?.(d) ?? false;

      return {
        radius: isHighlighted ? 10 : 1,
        fillColor: isHighlighted ? highlightColor : defaultColor,
        lineWidth: isHighlighted ? 1 : 0,
      };
    }, []);

    const [hoverInfo, setHoverInfo] = useState<PickingInfo<DataType>>({});

    const layers = useMemo(
      () =>
        [
          new GeoJsonLayer({
            id: "world-layer",
            data: worldGEOJSON,
            getFillColor: [231, 242, 206, 12],
            wireframe: true,
            pickable: true,
            autoHighlight: false,
            stroked: true,
            getLineColor: (d) => {
              if (currentStepIndex === 1 && d.properties.iso_a3_eh === "MEX") {
                return [0, 0, 0, 255];
              } else {
                return [0, 0, 0, 255];
              }
            },

            getLineWidth: (d) => {
              if (currentStepIndex === 1 && d.properties.iso_a3_eh == "MEX") {
                return 4;
              } else {
                return 0;
              }
            },
            lineWidthUnits: "pixels",
            lineWidthScale: 1,
            lineWidthMinPixels: 0.1,
            lineWidthMaxPixels: 100,
          }),
          new ScatterplotLayer({
            id: "steel-plant-dots",
            data: data,
            stroked: true,
            getPosition: (d) => [+d.lon, +d.lat],
            radiusUnits: "pixels",
            radiusMinPixels: 0.2,
            radiusMaxPixels: 200,
            getRadius: (d) => getScatterplotConfig(currentStepIndex, d).radius,
            getFillColor: (d) =>
              getScatterplotConfig(currentStepIndex, d).fillColor,
            lineWidthUnits: "pixels",
            lineWidthScale: 1,
            lineWidthMinPixels: 0,
            lineWidthMaxPixels: 100,
            getLineColor: strokeColor,
            getLineWidth: (d) =>
              getScatterplotConfig(currentStepIndex, d).lineWidth,
            transitions: {
              getRadius: {
                duration: 1000,
                easing: d3.easeCubicInOut,
              },
              getFillColor: {
                duration: 1000,
                easing: d3.easeCubicInOut,
              },
              getLineWidth: {
                duration: 1000,
                easing: d3.easeCubicInOut,
              },
            },
            updateTriggers: {
              getRadius: [currentStepIndex], // Tell deck.gl to re-evaluate when currentStepIndex changes
              getFillColor: [currentStepIndex],
              getLineWidth: [currentStepIndex],
            },
            pickable: false,
          }),
        ].filter(Boolean),
      [ data, currentStepIndex, getScatterplotConfig]
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

    useEffect(() => {
      if (currentStepIndex === 1) {
        setViewState({
          longitude: -102.5528,
          latitude: 23.6345,
          zoom: 5,
          transitionInterpolator: new FlyToInterpolator({
            speed: 0.6,
            curve: 1.2,
          }),
          transitionDuration: 1000,
          transitionDuration: "auto",
          transitionEasing: easeOutExpo,
        });
      } else {
        setViewState({
          ...initialViewState,
          transitionInterpolator: new FlyToInterpolator({
            speed: 0.6,
            curve: .8,
          }),
          transitionDuration: 1000,
          transitionDuration: "auto",
          transitionEasing: easeOutExpo,
        });
      }
    }, [currentStepIndex]);
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
          layers={[...layers].filter(Boolean)}
          onHover={(info) => setHoverInfo(info.object ? info : null)}
        >
          <Map
            className="absolute top-0 left-0 w-full h-full"
            reuseMaps
            mapStyle={
              "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            }
          />
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
  }
);

export default DeckglMap;
