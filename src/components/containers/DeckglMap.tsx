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
  latitude: 30,
  zoom: 1.8,
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
    radiusScale,
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
    radiusScale: d3.ScaleSqrt<number, number>;
  }) => {
    const [viewState, setViewState] = useState(initialViewState);

    const getScatterplotConfig = useCallback(
      (stepIndex, d, isHovered = false) => {
        const condition = STEP_CONDITIONS[stepIndex];
        const isHighlighted = condition?.(d) ?? false;
        const baseRadius = isHighlighted ? radiusScale(d[xVariable]) : 1;

        return {
          radius: isHovered ? baseRadius * 1.5 : baseRadius, // Increase radius by 50% on hover
          fillColor: isHighlighted ? highlightColor : defaultColor,
          lineWidth: isHovered ? 3 : 0,
        };
      },
      [highlightColor, defaultColor, radiusScale, xVariable]
    );

    const [hoverInfo, setHoverInfo] = useState<PickingInfo<DataType>>({});

    const annexCountries = useMemo(
      () =>
        Array.from(
          new Set(data.filter((d) => d.annexOrNot).map((d) => d.iso3_country))
        ),
      [data]
    );
    const layers = useMemo(
      () =>
        [
          new GeoJsonLayer({
            id: "world-layer",
            data: worldGEOJSON.features.filter(
              (f) => f.properties.continent !== "Antarctica"
            ),
            getFillColor: (d) => {
              if (currentStepIndex === 0) {
                return [234, 234, 234, 30];
              } else if (currentStepIndex === 1) {
                return annexCountries.includes(d.properties.iso_a3_eh)
                  ?  [234, 234, 234, 130]
                  : [234, 234, 234, 30];
              } else {
                return [234, 234, 234, 30];
              }
            },
            getLineWidth:(d) => {
              if (currentStepIndex === 0) {
                return 0
              } else if (currentStepIndex === 1) {
                return annexCountries.includes(d.properties.iso_a3_eh)
                  ? 3
                  : 0;
              } else {
                return 0;
              }
            },
            transitions: {
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
              getFillColor: [currentStepIndex],
              getLineWidth: [currentStepIndex],
            },
            wireframe: true,
            pickable: true,
            autoHighlight: false,
            stroked: true,
            getLineColor: [0, 0, 0, 255],
       
            lineWidthUnits: "pixels",
            lineWidthScale: 1,
            lineWidthMinPixels: 0.25,
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
            getRadius: (d) => {
              const isHovered =
                hoverInfo &&
                hoverInfo.object &&
                hoverInfo.object.asset_id === d.asset_id;
              return getScatterplotConfig(currentStepIndex, d, isHovered)
                .radius;
            },
            getFillColor: (d) =>
              getScatterplotConfig(currentStepIndex, d).fillColor,
            lineWidthUnits: "pixels",
            lineWidthScale: 1,
            lineWidthMinPixels: 0,
            lineWidthMaxPixels: 100,
            getLineColor: strokeColor,
            getLineWidth: (d) => {
              const isHovered =
                hoverInfo &&
                hoverInfo.object &&
                hoverInfo.object.asset_id === d.asset_id;
              return getScatterplotConfig(currentStepIndex, d, isHovered)
                .lineWidth;
            },
            transitions: {
              getRadius: {
                duration: 100,
                easing: d3.easeCubicInOut,
              },
              getFillColor: {
                duration: 1000,
                easing: d3.easeCubicInOut,
              },
              getLineWidth: {
                duration: 100, // Faster transition for hover effect
                easing: d3.easeCubicInOut,
              },
            },
            // Hover
            onHover: (info, event) => {
              setHoverInfo(info.object ? info : null);
              return true;
            },
            updateTriggers: {
              getRadius: [currentStepIndex, hoverInfo], // Add hoverInfo as trigger
              getFillColor: [currentStepIndex],
              getLineWidth: [currentStepIndex, hoverInfo],
            },
            pickable: true,
          }),
        ].filter(Boolean),
      [
        data,
        currentStepIndex,
        getScatterplotConfig,
        highlightColor,
        defaultColor,
        hoverInfo,
      ] // Add hoverInfo dependency
    );

    useEffect(() => {
      if (currentStepIndex >= 3) {
        setViewState({
          longitude: -94.499126,
          latitude: 29.565815,
          zoom: 1.2,
          transitionInterpolator: new FlyToInterpolator({
            speed: 0.6,
            curve: 1.2,
          }),
          transitionDuration: 2000,
          // transitionDuration: "auto",
          transitionEasing: easeOutExpo,
        });
      } else {
        setViewState({
          ...initialViewState,
          transitionInterpolator: new FlyToInterpolator({
            speed: 0.6,
            curve: 0.8,
          }),
          transitionDuration: 2000,
          // transitionDuration: "auto",
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
            doubleClickZoom: true,
            scrollZoom: false,
            touchRotate: true,
            minZoom: 0.000001,
            maxZoom: 10,
          }}
          layers={[...layers].filter(Boolean)}
        >
          {/* <Map
            className="absolute top-0 left-0 w-full h-full"
            reuseMaps
            mapStyle={
              "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            }
          /> */}
          {hoverInfo && hoverInfo.object && (
            <Tooltip
              left={hoverInfo.x + 10}
              top={hoverInfo.y + 10}
              tooltipData={hoverInfo.object}
              formatter={d3.format(".2s")}
              showMapUXInfo={true}
              containerWidth={width}
              containerHeight={height}
            />
          )}
        </DeckGL>
      </map>
    );
  }
);

export default DeckglMap;
