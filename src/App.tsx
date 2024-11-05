import "./App.css";

import { useParentSize, ParentSize, useScreenSize } from "@visx/responsive";

import { useState, useCallback, useEffect, useMemo } from "react";

import * as d3 from "d3";
import { Scrollama, Step } from "react-scrollama";

// NOTE: Data

// import steelplant from "@/data/steel-plant.csv";
import data from "@/data/data.csv";
import stackedBarChartData from "@/data/stackedBarChart.csv";
// NOTE: config + static data
import {
  STEP_CONDITIONS,
  useStepFilteredData,
  STEP_METADATA,
  top100Conditions,
} from "@/utility/stepConfig";
// NOTE: Custom UI components
import Legend from "@/components/custom-ui-components/Legend";
// NOTE: Reusable UI components
import { Slider } from "@/components/reusable-ui-components/slider";

// NOTE: Big Container components
import DeckglMap from "./components/containers/DeckglMap";

// NOTE: Custom Chart components
import BarChart from "./components/custom-chart-components/BarChart";
import PieChart from "./components/custom-chart-components/PieChart";
const X_VARIABLE = "emissions_quantity_avoided";
const Y_VARIABLE = "asset_id";
const COLOR_VARIABLE = "gap";

const SORT_VARIABLE = "emissions_quantity_avoided";
const SORTED_DATA = data.sort((a, b) => +b[SORT_VARIABLE] - +a[SORT_VARIABLE]);
const top100MexicoIds = new Set(
  SORTED_DATA.filter((d) => d.iso3_country === "MEX")
    .sort(
      (a, b) =>
        b.emissions_quantity_avoided - a.emissions_quantity_avoided ||
        a.asset_id.localeCompare(b.asset_id)
    )
    .slice(0, 100)
    .map((d) => d.asset_id)
);

const top100AnnexIds = new Set(
  SORTED_DATA.filter((d) => (d["annexOrNot"] == "true" ? true : false))
    .sort(
      (a, b) =>
        b.emissions_quantity_avoided - a.emissions_quantity_avoided ||
        a.asset_id.localeCompare(b.asset_id)
    )
    .slice(0, 100)
    .map((d) => d.asset_id)
);

SORTED_DATA.forEach((d, i) => {
  d[SORT_VARIABLE] = +d[SORT_VARIABLE];
  d["lat"] = +d["lat"];
  d["lon"] = +d["lon"];
  d["annexOrNot"] = d["annexOrNot"] == "true" ? true : false;
  d.top100OrNot = i < 100;
  d.top100InMexico = top100MexicoIds.has(d.asset_id);
  d.top100InAnnex = top100AnnexIds.has(d.asset_id);
});

function App() {
  const { parentRef } = useParentSize();
  const [sliderValue, setSliderValue] = useState([33]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // This callback fires when a Step hits the offset threshold. It receives the
  // data prop of the step, which in this demo stores the index of the step.
  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
  };
  // <StackedBarChart
  //                 width={width}
  //                 height={height}
  //                 data={stackedBarChartData}
  //                 X_VARIABLE={"state"}
  //                 Y_VARIABLE={"population"}
  //                 GROUP_VARIABLE={"age"}
  //               />
  const filteredData = useStepFilteredData(SORTED_DATA, currentStepIndex);
  return (
    <div className=" relative ">
      <main className="flex flex-col ">
        <div className=" relative z-[-1]">
          {/* NOTE: Sticky Map Container */}
          <div className="sticky w-full h-screen top-0 overflow-hidden flex flex-col items-center justify-center">
            {/* I'm sticky. The current triggered step index is: {currentStepIndex} */}
            {/* <Slider
                className="w-full"
                defaultValue={[1]}
                max={1}
                step={0.1}
                onValueChange={(value) => setSliderValue(value)}
              /> */}

            <h1
              className="z-[100] text-lg font-semibold opacity-40"
              style={{ display: currentStepIndex == 0 ? "none" : "block" }}
            >
              Methane Matters
            </h1>
            <h2
              className="z-[100] mt-4 text-xl font-semibold"
              style={{ display: currentStepIndex == 0 ? "none" : "block" }}
            >
              {STEP_METADATA[currentStepIndex]?.label}
            </h2>
            <figure ref={parentRef} className="w-full h-full">
              <ParentSize>
                {({ width, height }) => {
                  return (
                    <DeckglMap
                      data={SORTED_DATA}
                      colorVariable={COLOR_VARIABLE}
                      xVariable={X_VARIABLE}
                      yVariable={Y_VARIABLE}
                      width={width}
                      height={height}
                      currentStepIndex={currentStepIndex}
                      STEP_CONDITIONS={STEP_CONDITIONS}
                    
                    />
                  );
                }}
              </ParentSize>
            </figure>
            {/* NOTE: Bottom Bar Chart Container */}
            <div
              style={{ display: currentStepIndex == 0 ? "none" : "flex" }}
              className="h-[400px] w-full absolute bottom-0 left-0 justify-center items-center"
            >
              <figure className="h-full w-4/5">
                {currentStepIndex !== 0 && (
                  <ParentSize>
                    {({ width, height }) => (
                      <BarChart
                        width={width}
                        height={height}
                        data={filteredData}
                        xVariable={Y_VARIABLE}
                        yVariable={X_VARIABLE}
                      />
                    )}
                  </ParentSize>
                )}
              </figure>
            </div>
            <div style={{ display: currentStepIndex == 0 ? "none" : "block" }}>
              <Legend />
            </div>
          </div>

          {/* NOTE: Steps Container */}

          <div className="relative z-10 mt-[-100vh] w-full">
            <Scrollama offset={0.4} onStepEnter={onStepEnter}>
              {[1, 2, 3, 4].map((_, stepIndex) => (
                <Step data={stepIndex} key={stepIndex}>
                  <div
                    style={{
                      paddingTop: `${stepIndex == 0 ? "10vh" : "0vh"}`,
                      paddingBottom: "110vh",
                    }}
                    id="g-header-container"
                    className="w-full  flex justify-center items-center"
                  >
                    <header
                      id="interactive-header"
                      className="h-[800px] w-4/5 flex flex-col justify-center items-center"
                    >
                      <h1
                        id="interactive-heading"
                        data-testid="headline"
                        className="text-[3rem] font-semibold tracking-widest"
                      >
                        Methane Matters
                      </h1>
                      <h2 className="text-[#42959D] text-[2rem]">
                        The Optimal Way to Reduce Landfill Emissions
                      </h2>
                      <p
                        id="interactive-leadin"
                        data-testid="interactive-leadin"
                        className="text-lg"
                      >
                        What is this tool...Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Vestibulum fermentum, nibh
                        et posuere posuere, nisi velit accumsan libero, vitae
                        luctus justo mi a est.
                      </p>
                    </header>
                  </div>
                </Step>
              ))}
            </Scrollama>
          </div>
        </div>

        <section className="h-screen w-screen bg-[#D4DADC] pt-[10vh] flex flex-col justify-center items-center">
          <h1 className="text-[3rem] font-semibold tracking-widest">
            Methane Matters
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor
            vel tellus id placerat. Aliquam erat volutpat. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Sed auctor vel tellus id
            placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed auctor vel tellus id placerat. Aliquam erat volutpat. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor vel
            tellus id placerat.{" "}
          </p>
          <div className="flex-grow w-2/3 flex justify-center items-center">
            {top100Conditions.map((d, i) => (
              <figure className="size-1/3">
                <ParentSize>
                  {({ width, height }) => {
                    return (
                      <PieChart
                        key={i}
                        data={d}
                        width={width}
                        height={height}
                        colors={["#42959D", "#42959D", "#42959D", "#42959D"]}
                      />
                    );
                  }}
                </ParentSize>
              </figure>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
