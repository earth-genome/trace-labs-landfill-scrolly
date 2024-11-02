// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import * as d3 from "d3-force";

import { COORDINATE_SYSTEM } from "@deck.gl/core";

const pointCount = 10000;
const duration = 5; // Duration in seconds

const ForceSimulationDeckGL = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const deckRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const simulationRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Initialize nodes
    const initialNodes = [];
    for (let i = 0; i < 50; i++) {
      initialNodes.push({
        x: centerX,
        y: centerY,
        targetX: centerX,
        targetY: centerY,
      });
    }

    // Create nodes to add later
    const nodesToAdd = [];
    for (let i = 0; i < pointCount; i++) {
      nodesToAdd.push({
        x: centerX + width * Math.sin(Math.random() * (2 * Math.PI)),
        y: centerY + width * Math.cos(Math.random() * (2 * Math.PI)),
        delay: Math.random() * (duration * 1000),
        targetX: centerX,
        targetY: centerY,
      });
    }

    // Initialize D3 force simulation
    simulationRef.current = d3
      .forceSimulation(initialNodes)
      .force(
        "x",
        d3
          .forceX()
          .strength(0.05)
          .x((d) => d.targetX)
      )
      .force(
        "y",
        d3
          .forceY()
          .strength(0.05)
          .y((d) => d.targetY)
      )
      .force("charge", d3.forceManyBody().strength(-0.005).theta(0.95))
      .alpha(1)
      .alphaDecay(0.01)
      .alphaMin(0.25)
      .velocityDecay(0.4)
      .stop();

    // Pre-tick the simulation
    for (let i = 0; i < 1000; i++) {
      simulationRef.current.tick();
    }

    // Start animation
    const startTime = performance.now();
    const animate = (time) => {
      const progress = time - startTime;
      const simulationNodes = simulationRef.current.nodes();
      const newNodes = [];

      // Add new nodes based on delay
      for (let i = 0; i < nodesToAdd.length; i++) {
        const node = nodesToAdd[i];
        if (node.delay < progress) {
          newNodes.push(node);
          nodesToAdd.splice(i, 1);
          i--;
        }
      }

      if (newNodes.length > 0) {
        simulationNodes.push(...newNodes);
        simulationRef.current.nodes(simulationNodes).alpha(1);
      }

      // Advance the simulation
      console.time("simulation-tick");
      simulationRef.current.tick();
      console.timeEnd("simulation-tick");

      setNodes([...simulationRef.current.nodes()]);
      // Continue animation
      if (simulationRef.current.alpha() > 0.01 || nodesToAdd.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
      simulationRef.current.stop();
    };
  }, [width, height]);

  // Create the Deck.gl layer
  const scatterplotLayer = useMemo(() => {
    return [
      new ScatterplotLayer({
        id: "scatterplot-layer",
        data: nodes,
        pickable: false,
        // coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        getPosition: (d) => {
          return [d.x - centerX, d.y - centerY];
        }, // Adjust for Deck.gl coordinates
        getRadius: 3,
        getFillColor: [156, 99, 153],
        radiusUnits: "pixels",
        radiusMinPixels: 0.2,
        radiusMaxPixels: 200,
        updateTriggers: {
          getPosition: nodes, // Ensure layer updates when nodes change
        },
      }),
    ];
  }, [nodes]);

  return (
    <DeckGL
      ref={deckRef}
      width={width}
      height={height}
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 3,
        maxZoom: 20,
        pitch: 0,
        bearing: 0,
      }}
      controller={false}
      layers={scatterplotLayer}
    />
  );
};

export default ForceSimulationDeckGL;
