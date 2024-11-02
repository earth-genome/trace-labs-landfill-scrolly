// simulationWorker.js
import * as d3 from "d3";


let simulation;
let nodesToAdd = [];
let lastProgress = 0;

self.onmessage = function (e) {
  const { type, data } = e.data;

  if (type === 'INIT') {
    const { initialNodes, nodesToAddData, simulationParams } = data;
    nodesToAdd = nodesToAddData;

    simulation = d3.forceSimulation(initialNodes)
      .force('x', d3.forceX().strength(simulationParams.xStrength).x(d => d.targetX))
      .force('y', d3.forceY().strength(simulationParams.yStrength).y(d => d.targetY))
      .force('charge', d3.forceManyBody().strength(simulationParams.chargeStrength).theta(0.9))
      .alpha(1)
      .alphaDecay(0.01)
      .alphaMin(0.25)
      .velocityDecay(0.4)
      .stop();

    // Pre-tick the simulation
    for (let i = 0; i < 130; i++) {
      simulation.tick();
    }

    // Send initial nodes to main thread
    postMessage({ type: 'INITIAL_NODES', nodes: simulation.nodes() });

    // Start the animation loop
    requestAnimationFrame(animate);
  }
};

function animate() {
  const progress = performance.now();

  // Add new nodes based on delay
  const newNodes = [];
  for (let i = nodesToAdd.length - 1; i >= 0; i--) {
    const node = nodesToAdd[i];
    if (node.delay <= progress) {
      newNodes.push(node);
      nodesToAdd.splice(i, 1);
    }
  }

  if (newNodes.length > 0) {
    const simulationNodes = simulation.nodes();
    simulationNodes.push(...newNodes);
    simulation.nodes(simulationNodes).alpha(1);
  }

  // Advance the simulation
  simulation.tick();

  // Send updated nodes to the main thread
  postMessage({ type: 'UPDATE_NODES', nodes: simulation.nodes() });

  // Continue animation if needed
  if (simulation.alpha() > 0.01 || nodesToAdd.length > 0) {
    requestAnimationFrame(animate);
  } else {
    postMessage({ type: 'SIMULATION_COMPLETE' });
  }
}
