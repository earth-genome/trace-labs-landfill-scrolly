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
import LA_GEOJSON from "@/data/los-angeles-city.json";
const DEFAULT_OPACITY = 105;

const mapDefaultFill = [231, 242, 206, 200];
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
    highlightColor = [121, 180, 173, 255],
    defaultColor = [121, 180, 173, 100],
    strokeColor = [57, 144, 153, 255],
    radiusScale,
    currentStepCondition,
  }: {
    data: any;
    colorVariable: string;
    xVariable: string;
    yVariable: string;
    width: number;
    height: number;
    currentStepIndex: number;
    highlightColor: number[];
    defaultColor: number[];
    strokeColor: number[];
    radiusScale: d3.ScaleSqrt<number, number>;
    currentStepCondition: (d: any) => any;
  }) => {
    const [viewState, setViewState] = useState(initialViewState);
    const [hoverInfo, setHoverInfo] = useState<PickingInfo<any> | null>(null);

    // Compute opacity based on step conditions
    // const opacity = useMemo(() => {
    //   return (
    //     currentStepCondition?.dotOpacity ??
    //     (currentStepIndex >= 4 ? DEFAULT_OPACITY : 255)
    //   );
    // }, [currentStepCondition?.dotOpacity, currentStepIndex]);

    // Prepare colors with computed opacity

    // Extract the condition function
    const condition = useMemo(
      () => currentStepCondition?.condition ?? (() => false),
      [currentStepCondition]
    );

    // Pre-process data to compute fillColor and baseRadius
    const processedData = useMemo(() => {
      return data.map((d) => {
        const isHighlighted = condition(d);
        const baseRadius = radiusScale(d[xVariable]);

        let defaultColorWithOpacity = defaultColor;
        if (currentStepCondition?.label === "step 2 annex choropleth") {
          defaultColorWithOpacity = [...defaultColor.slice(0, 3), 10];
        }
        const fillColor = isHighlighted
          ? highlightColor
          : defaultColorWithOpacity;

        return {
          ...d, // Keep original properties
          baseRadius,
          fillColor,
        };
      });
    }, [data, condition, radiusScale, xVariable, highlightColor]);

    // Memoize the layers
    const layers = useMemo(() => {
      const annexCountries = Array.from(
        new Set(data.filter((d) => d.annexOrNot).map((d) => d.iso3_country))
      );

      const worldLayer = new GeoJsonLayer({
        id: "world-layer",
        data: worldGEOJSON.features.filter(
          (f) => f.properties.continent !== "Antarctica"
        ),
        getFillColor: (d) => {
          if (currentStepIndex === 0) {
            return mapDefaultFill;
          } else if (
            currentStepCondition?.label === "step 2 annex choropleth"
          ) {
            return annexCountries.includes(d.properties.iso_a3_eh)
              ? [231, 242, 206, 250]
              : [231, 242, 206, 10];
          } else if (currentStepCondition?.label === "step 4 LA example") {
            return d.properties.name === "Los Angeles County"
              ? [234, 234, 234, 250]
              : [234, 234, 234, 0];
          } else {
            return mapDefaultFill;
          }
        },
        getLineWidth: (d) => {
          if (currentStepIndex === 0) {
            return 0;
          } else if (
            currentStepCondition?.label === "step 2 annex choropleth"
          ) {
            return annexCountries.includes(d.properties.iso_a3_eh) ? 3 : 0;
          } else if (currentStepCondition?.label === "step 4 LA example") {
            return 0;
          } else {
            return 0.22;
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
        lineCapRounded: true,
        lineJointRounded: true,
        lineWidthUnits: "pixels",
        lineWidthScale: 1,
        lineWidthMinPixels: 0.0,
        lineWidthMaxPixels: 100,
      });

      const scatterplotLayer = new ScatterplotLayer({
        id: "landfill-dots",
        data: processedData,
        stroked: true,
        getPosition: (d) => [+d.lon, +d.lat],
        radiusUnits: "pixels",
        radiusMinPixels: 0.2,
        radiusMaxPixels: 200,
        getRadius: (d) => {
          const isHovered = hoverInfo?.object?.asset_id === d.asset_id;
          return isHovered ? d.baseRadius * 1.5 : d.baseRadius;
        },
        getFillColor: (d) => d.fillColor,
        getLineWidth: (d) => {
          const isHovered = hoverInfo?.object?.asset_id === d.asset_id;
          return isHovered ? 3 : 0;
        },
        getLineColor: strokeColor,
        lineWidthUnits: "pixels",
        lineWidthScale: 1,
        lineWidthMinPixels: 0,
        lineWidthMaxPixels: 100,
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
            duration: 100,
            easing: d3.easeCubicInOut,
          },
        },
        onHover: (info) => {
          setHoverInfo(info.object ? info : null);
        },
        updateTriggers: {
          getRadius: hoverInfo?.object?.asset_id,
          getLineWidth: hoverInfo?.object?.asset_id,
        },
        pickable: true,
      });

      const laLayer =
        currentStepCondition?.label === "step 4 LA example"
          ? new GeoJsonLayer({
              id: "la-layer",
              data: LA_GEOJSON,
              getFillColor: [234, 234, 234, 0],
              getLineColor: [0, 0, 0, 255],
              getLineWidth: (d) => {
                return 4;
              },
              lineWidthUnits: "pixels",
              lineWidthScale: 1,
              lineWidthMinPixels: 0,
              lineWidthMaxPixels: 100,
              lineCapRounded: true,
              lineJointRounded: true,
            })
          : null;
      return [worldLayer, laLayer, scatterplotLayer];
    }, [
      processedData,
      hoverInfo,
      strokeColor,
      currentStepCondition,
      currentStepIndex,
      data,
    ]);

    // Update viewState based on step changes
    useEffect(() => {
      if (currentStepCondition?.label === "step 4 LA example") {
        setViewState({
          longitude: -118.2426,
          latitude: 34.0549,
          zoom: 9.5,
          transitionInterpolator: new FlyToInterpolator({
            speed: 0.6,
            curve: 1.2,
          }),
          transitionDuration: 3000,
          transitionEasing: easeOutExpo,
        });
      } else if (currentStepIndex > 0) {
        setViewState({
          longitude: -94.499126,
          latitude: 29.565815,
          zoom: 1.2,
          transitionInterpolator: new FlyToInterpolator({
            speed: 0.6,
            curve: 1.2,
          }),
          transitionDuration: 2000,
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
          transitionEasing: easeOutExpo,
        });
      }
    }, [currentStepIndex]);

    return (
      <div
        style={{ width: "100%", height: "100%" }}
        onMouseLeave={() => {
          setHoverInfo(null);
        }}
      >
        <DeckGL
          initialViewState={viewState}
          controller={{
            doubleClickZoom: true,
            scrollZoom: false,
            touchRotate: true,
            minZoom: 0.000001,
            maxZoom: 10,
          }}
          layers={layers}
        >
          {currentStepCondition?.label === "step 4 LA example" && (
            <Map
              className="absolute top-0 left-0 w-full h-full"
              reuseMaps
              mapStyle={
                "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
              }
            />
          )}
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
      </div>
    );
  }
);

export default DeckglMap;
