import "./App.css";

import { useParentSize, ParentSize, useScreenSize } from "@visx/responsive";

import { useState, useCallback, useEffect, useMemo } from "react";

import * as d3 from "d3";
import { Scrollama, Step } from "react-scrollama";

// NOTE: Data

// import steelplant from "@/data/steel-plant.csv";
import data from "@/data/data.csv";
// import stackedBarChartData from "@/data/stackedBarChart.csv";
// NOTE: config + static data
import {
  STEP_CONDITIONS,
  useStepFilteredData,
  STEP_METADATA,
  top100Conditions,
} from "@/utility/stepConfig";
// NOTE: Custom UI components
import Legend from "@/components/custom-ui-components/Legend";
import VisibleTextBlock from "@/components/custom-ui-components/VisibleTextBlock";
// NOTE: Reusable UI components
// import { Slider } from "@/components/reusable-ui-components/slider";

// NOTE: Big Container components
import DeckglMap from "./components/containers/DeckglMap";

// NOTE: Custom Chart components
import BarChart from "./components/custom-chart-components/BarChart";
import PieChart from "./components/custom-chart-components/PieChart";
const X_VARIABLE = "emissions_quantity_avoided";
const Y_VARIABLE = "asset_id";
const COLOR_VARIABLE = "gap";

const topNumber = 100;
const SORT_VARIABLE = "emissions_quantity_avoided";
const SORTED_DATA = data.sort((a, b) => +b[SORT_VARIABLE] - +a[SORT_VARIABLE]);
const top100MexicoIds = new Set(
  SORTED_DATA.filter((d) => d.iso3_country === "MEX")
    .sort(
      (a, b) =>
        b.emissions_quantity_avoided - a.emissions_quantity_avoided ||
        a.asset_id.localeCompare(b.asset_id)
    )
    .slice(0, topNumber)
    .map((d) => d.asset_id)
);

const top100AnnexIds = new Set(
  SORTED_DATA.filter((d) => (d["annexOrNot"] == "true" ? true : false))
    .sort(
      (a, b) =>
        b.emissions_quantity_avoided - a.emissions_quantity_avoided ||
        a.asset_id.localeCompare(b.asset_id)
    )
    .slice(0, topNumber)
    .map((d) => d.asset_id)
);

SORTED_DATA.forEach((d, i) => {
  d[SORT_VARIABLE] = +d[SORT_VARIABLE];
  d["lat"] = +d["lat"];
  d["lon"] = +d["lon"];
  d["annexOrNot"] = d["annexOrNot"] == "true" ? true : false;
  d.top100OrNot = i < topNumber;
  d.top100InMexico = top100MexicoIds.has(d.asset_id);
  d.top100InAnnex = top100AnnexIds.has(d.asset_id);
});

const TotalNumberOfBars = 200;
const filteredData = SORTED_DATA.slice(0, TotalNumberOfBars);
const radiusScale = d3
  .scaleSqrt()
  .domain(d3.extent(SORTED_DATA, (d) => +d[X_VARIABLE]))
  .range([1, 20]);

// Color related
const defaultColor = "hsla(0, 0%, 78%, 1.0)";
const highlightColor = "hsla(0, 0%, 31%, 1.0)";
const strokeColor = "hsla(355, 100%, 100%, 1.0)";
function hslaToRGBA(hslaString) {
  // Create a temporary div to use the browser's color conversion
  const div = document.createElement("div");
  div.style.color = hslaString;
  document.body.appendChild(div);

  // Get the computed RGB values
  const rgbaColor = window.getComputedStyle(div).color;
  document.body.removeChild(div);

  // Extract RGBA values (converting alpha to 0-255 range)
  const [r, g, b, a] = rgbaColor.match(/[\d.]+/g).map(Number);
  return [r, g, b, Math.round(a * 255)];
}

function App() {
  const { parentRef } = useParentSize();
  const [sliderValue, setSliderValue] = useState([33]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // This callback fires when a Step hits the offset threshold. It receives the
  // data prop of the step, which in this demo stores the index of the step.
  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
  };

  console.log(filteredData);
  return (
    <div className=" relative ">
      <header className="h-screen  ">
        <h1 className="font-black max-w-[650px] text-[3rem] m-auto leading-[1.1]">
          Accelerating global decarbonization through emissionality: an example
          from reducing landfill methane emissions
        </h1>
        <p className="max-w-[650px] m-auto">
          What if we could cap 100 Landfills? Let’s imagine the funds and
          political will have come together amongst the UN’s Annex I
          (historically industrialized) nations to cap 100 landfills. Climate
          TRACE uses AI to track and characterize 9,624 landfills worldwide. The
          Annex I nations have recognized the potential to cut planet-heating
          emissions and are evaluating options for how to best prioritize this
          group of nearly 1% of all landfills tracked by Climate TRACE.
        </p>
      </header>
      <main className="flex flex-col ">
        <div className=" relative ">
          {/* sticky content starts */}
          {/* NOTE: Sticky Map Container */}
          <div className="sticky w-full h-screen top-0 overflow-hidden flex flex-col items-center justify-center ">
            {/* I'm sticky. The current triggered step index is: {currentStepIndex} */}
            {/* <Slider
                className="w-full"
                defaultValue={[1]}
                max={1}
                step={0.1}
                onValueChange={(value) => setSliderValue(value)}
              /> */}

            {currentStepIndex > 2 && (
              <>
                <section className="absolute top-0 left-[2%] max-w-[34vw]">
                  <h1 className=" text-3xl font-thin opacity-40 mb-8">
                    Methane Matters
                  </h1>
                  <VisibleTextBlock currentStepIndex={currentStepIndex} />
                  <h2 className="text-[2rem] font-bold">BIG NUMBER</h2>

                  <div>
                    <Legend
                      highlightColor={highlightColor}
                      defaultColor={defaultColor}
                    />
                  </div>
                </section>
              </>
            )}

            {/* 
            <h2
              className="z-[100] mt-4 text-xl font-semibold"
              style={{ display: currentStepIndex == 0 ? "none" : "block" }}
            >
              {STEP_METADATA[currentStepIndex]?.label}
            </h2> */}
            <figure
              ref={parentRef}
              className="w-full h-full z-[0] overflow-hidden absolute right-0 top-0"
            >
              <ParentSize>
                {({ width, height }) => {
                  return (
                    <DeckglMap
                      data={SORTED_DATA.slice().sort((a, b) =>
                        d3.ascending(
                          a.emissions_quantity_avoided,
                          b.emissions_quantity_avoided
                        )
                      )}
                      colorVariable={COLOR_VARIABLE}
                      xVariable={X_VARIABLE}
                      yVariable={Y_VARIABLE}
                      width={width}
                      height={height}
                      currentStepIndex={currentStepIndex}
                      STEP_CONDITIONS={STEP_CONDITIONS}
                      highlightColor={hslaToRGBA(highlightColor)}
                      defaultColor={hslaToRGBA(defaultColor)}
                      strokeColor={hslaToRGBA(strokeColor)}
                      radiusScale={radiusScale}
                    />
                  );
                }}
              </ParentSize>
            </figure>
            {/* NOTE: Bottom Bar Chart Container */}
            <div
              style={{ display: currentStepIndex >= 3 ? "flex" : "none" }}
              className="h-[300px] w-full absolute bottom-0 left-0 justify-center items-center"
            >
              <figure className="h-full w-full bg-[hsla(195, 10%, 100%, 0.582)] box-shadow-[0_0_10px_0_rgba(0,0,0,0.1)] rounded-md z-[50]">
                {currentStepIndex !== 0 && (
                  <ParentSize>
                    {({ width, height }) => (
                      <BarChart
                        width={width}
                        height={height}
                        data={filteredData}
                        fillCondition={STEP_CONDITIONS[currentStepIndex]}
                        xVariable={Y_VARIABLE}
                        yVariable={X_VARIABLE}
                        defaultColor={defaultColor}
                        highlightColor={highlightColor}
                      />
                    )}
                  </ParentSize>
                )}
              </figure>
            </div>
          </div>

          {/* sticky content ends */}
          {/* NOTE: Steps Container: flowing text */}
          <div className="relative z-10 mt-[-100vh] w-full ">
            <Scrollama offset={0.4} onStepEnter={onStepEnter}>
              {[1, 2, 3, 4, 5].map((_, stepIndex) => (
                <Step data={stepIndex} key={stepIndex}>
                  <div
                    style={{
                      paddingTop: `${stepIndex == 0 ? "10vh" : "0vh"}`,
                      paddingBottom: "110vh",
                      opacity: stepIndex < 3 ? 1 : 0,
                    }}
                    id="g-header-container"
                    className="w-full  justify-center items-center "
                  >
                    <header
                      id="interactive-header"
                      className="h-[800px] w-4/5 flex flex-col justify-center items-center"
                    >
                      {/* <h1
                        id="interactive-heading"
                        data-testid="headline"
                        className="text-[3rem] font-semibold tracking-widest"
                      >
                        Methane Matters
                      </h1> */}
                      <h2 className="text-[#42959D] text-[2rem]">
                        {STEP_METADATA[stepIndex]?.label}
                      </h2>
                      <p
                        id="interactive-leadin"
                        data-testid="interactive-leadin"
                        className="text-lg"
                      >
                        {STEP_METADATA[stepIndex]?.text}
                      </p>
                    </header>
                  </div>
                </Step>
              ))}
            </Scrollama>
          </div>
        </div>

        <section className="h-screen w-screen bg-[#D4DADC] pt-[10vh] flex flex-col justify-center items-center ">
          <div className="max-w-[650px] m-auto">
            <h1 className="text-[3rem] font-semibold tracking-widest">
              Optimizing for Impact
            </h1>
            <p>
              These scenarios demonstrate that effective climate action is best
              served by letting go of geographic constraints and prioritizing
              impact above all. When we look beyond national boundaries and
              directly optimize for the highest emissions reduction potential,
              we can significantly amplify our impact. The data is clear:
              focusing globally and making decisions based purely on potential
              emissions reduction, rather than political considerations, yields
              the greatest climate benefit.
            </p>
            <div className="flex-grow w-2/3 flex justify-center items-center">
              {/* {top100Conditions.map((d, i) => ( */}
              <figure className="size-[300px]">
                <ParentSize>
                  {({ width, height }) => (
                     <BarChart
                     width={width}
                     height={height}
                     data={[
                       { asset_id: "Global", emissions_quantity_avoided: 100 },
                       { asset_id: "Annex 1", emissions_quantity_avoided: 50 },
                     ]}
                     xVariable="emissions_quantity_avoided"
                     yVariable="asset_id"
                     horizontal={true}
                     defaultColor="hsla(0, 0%, 78%, 1.0)"
                   />
                  )}
                </ParentSize>
              </figure>
              {/* ))} */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
