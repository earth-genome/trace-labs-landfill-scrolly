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
import { STEP_CONDITIONS, useStepFilteredData } from "@/utility/stepConfig";
// NOTE: Custom UI components

// NOTE: Reusable UI components
import { Slider } from "@/components/reusable-ui-components/slider";

// NOTE: Big Container components
import DeckglMap from "./components/containers/DeckglMap";
import { HeatGapHeader } from "./components/containers/Header";

// NOTE: Custom Chart components
import BarChart from "./components/custom-chart-components/BarChart";

const X_VARIABLE = "emissions_quantity_avoided";
const Y_VARIABLE = "asset_id";
const COLOR_VARIABLE = "gap";

const SORT_VARIABLE = "emissions_quantity_avoided";
const SORTED_DATA = data.sort((a, b) => +b[SORT_VARIABLE] - +a[SORT_VARIABLE]);

SORTED_DATA.forEach((d, i) => {
  d[SORT_VARIABLE] = +d[SORT_VARIABLE];
  d["lat"] = +d["lat"];
  d["lon"] = +d["lon"];
  d["annexOrNot"] = d["annexOrNot"] == "true" ? true : false;
  d.top100OrNot = i < 100;
});
const arrayLength = SORTED_DATA.length;

const allCountries = [
  {
    longName: "Afghanistan",
    shortName: "AFG",
  },
  {
    longName: "Albania",
    shortName: "ALB",
  },
  {
    longName: "Algeria",
    shortName: "DZA",
  },
  {
    longName: "Angola",
    shortName: "AGO",
  },
  {
    longName: "Antarctica",
    shortName: "ATA",
  },
  {
    longName: "Argentina",
    shortName: "ARG",
  },
  {
    longName: "Armenia",
    shortName: "ARM",
  },
  {
    longName: "Australia",
    shortName: "AUS",
  },
  {
    longName: "Austria",
    shortName: "AUT",
  },
  {
    longName: "Azerbaijan",
    shortName: "AZE",
  },
  {
    longName: "Bahamas",
    shortName: "BHS",
  },
  {
    longName: "Bangladesh",
    shortName: "BGD",
  },
  {
    longName: "Belarus",
    shortName: "BLR",
  },
  {
    longName: "Belgium",
    shortName: "BEL",
  },
  {
    longName: "Belize",
    shortName: "BLZ",
  },
  {
    longName: "Benin",
    shortName: "BEN",
  },
  {
    longName: "Bhutan",
    shortName: "BTN",
  },
  {
    longName: "Bolivia",
    shortName: "BOL",
  },
  {
    longName: "Bosnia and Herzegovina",
    shortName: "BIH",
  },
  {
    longName: "Botswana",
    shortName: "BWA",
  },
  {
    longName: "Brazil",
    shortName: "BRA",
  },
  {
    longName: "Brunei Darussalam",
    shortName: "BRN",
  },
  {
    longName: "Bulgaria",
    shortName: "BGR",
  },
  {
    longName: "Burkina Faso",
    shortName: "BFA",
  },
  {
    longName: "Burundi",
    shortName: "BDI",
  },
  {
    longName: "Cambodia",
    shortName: "KHM",
  },
  {
    longName: "Cameroon",
    shortName: "CMR",
  },
  {
    longName: "Canada",
    shortName: "CAN",
  },
  {
    longName: "Central African Republic",
    shortName: "CAF",
  },
  {
    longName: "Chad",
    shortName: "TCD",
  },
  {
    longName: "Chile",
    shortName: "CHL",
  },
  {
    longName: "China",
    shortName: "CHN",
  },
  {
    longName: "Colombia",
    shortName: "COL",
  },
  {
    longName: "Costa Rica",
    shortName: "CRI",
  },
  {
    longName: "Côte d'Ivoire",
    shortName: "CIV",
  },
  {
    longName: "Croatia",
    shortName: "HRV",
  },
  {
    longName: "Cuba",
    shortName: "CUB",
  },
  {
    longName: "Cyprus",
    shortName: "CYP",
  },
  {
    longName: "Czech Republic",
    shortName: "CZE",
  },
  {
    longName: "Dem. Rep. Korea",
    shortName: "PRK",
  },
  {
    longName: "Democratic Republic of the Congo",
    shortName: "COD",
  },
  {
    longName: "Denmark",
    shortName: "DNK",
  },
  {
    longName: "Djibouti",
    shortName: "DJI",
  },
  {
    longName: "Dominican Republic",
    shortName: "DOM",
  },
  {
    longName: "Ecuador",
    shortName: "ECU",
  },
  {
    longName: "Egypt",
    shortName: "EGY",
  },
  {
    longName: "El Salvador",
    shortName: "SLV",
  },
  {
    longName: "Equatorial Guinea",
    shortName: "GNQ",
  },
  {
    longName: "Eritrea",
    shortName: "ERI",
  },
  {
    longName: "Estonia",
    shortName: "EST",
  },
  {
    longName: "Ethiopia",
    shortName: "ETH",
  },
  {
    longName: "Falkland Islands / Malvinas",
    shortName: "FLK",
  },
  {
    longName: "Fiji",
    shortName: "FJI",
  },
  {
    longName: "Finland",
    shortName: "FIN",
  },
  {
    longName: "France",
    shortName: "FRA",
  },
  {
    longName: "French Southern and Antarctic Lands",
    shortName: "ATF",
  },
  {
    longName: "Gabon",
    shortName: "GAB",
  },
  {
    longName: "Georgia",
    shortName: "GEO",
  },
  {
    longName: "Germany",
    shortName: "DEU",
  },
  {
    longName: "Ghana",
    shortName: "GHA",
  },
  {
    longName: "Greece",
    shortName: "GRC",
  },
  {
    longName: "Greenland",
    shortName: "GRL",
  },
  {
    longName: "Guatemala",
    shortName: "GTM",
  },
  {
    longName: "Guinea",
    shortName: "GIN",
  },
  {
    longName: "Guinea-Bissau",
    shortName: "GNB",
  },
  {
    longName: "Guyana",
    shortName: "GUY",
  },
  {
    longName: "Haiti",
    shortName: "HTI",
  },
  {
    longName: "Honduras",
    shortName: "HND",
  },
  {
    longName: "Hungary",
    shortName: "HUN",
  },
  {
    longName: "Iceland",
    shortName: "ISL",
  },
  {
    longName: "India",
    shortName: "IND",
  },
  {
    longName: "Indonesia",
    shortName: "IDN",
  },
  {
    longName: "Iran",
    shortName: "IRN",
  },
  {
    longName: "Iraq",
    shortName: "IRQ",
  },
  {
    longName: "Ireland",
    shortName: "IRL",
  },
  {
    longName: "Israel",
    shortName: "ISR",
  },
  {
    longName: "Italy",
    shortName: "ITA",
  },
  {
    longName: "Jamaica",
    shortName: "JAM",
  },
  {
    longName: "Japan",
    shortName: "JPN",
  },
  {
    longName: "Jordan",
    shortName: "JOR",
  },
  {
    longName: "Kazakhstan",
    shortName: "KAZ",
  },
  {
    longName: "Kenya",
    shortName: "KEN",
  },
  {
    longName: "Kingdom of eSwatini",
    shortName: "SWZ",
  },
  {
    longName: "Kosovo",
    shortName: "KOS",
  },
  {
    longName: "Kuwait",
    shortName: "KWT",
  },
  {
    longName: "Kyrgyzstan",
    shortName: "KGZ",
  },
  {
    longName: "Lao PDR",
    shortName: "LAO",
  },
  {
    longName: "Latvia",
    shortName: "LVA",
  },
  {
    longName: "Lebanon",
    shortName: "LBN",
  },
  {
    longName: "Lesotho",
    shortName: "LSO",
  },
  {
    longName: "Liberia",
    shortName: "LBR",
  },
  {
    longName: "Libya",
    shortName: "LBY",
  },
  {
    longName: "Lithuania",
    shortName: "LTU",
  },
  {
    longName: "Luxembourg",
    shortName: "LUX",
  },
  {
    longName: "Madagascar",
    shortName: "MDG",
  },
  {
    longName: "Malawi",
    shortName: "MWI",
  },
  {
    longName: "Malaysia",
    shortName: "MYS",
  },
  {
    longName: "Mali",
    shortName: "MLI",
  },
  {
    longName: "Mauritania",
    shortName: "MRT",
  },
  {
    longName: "Mexico",
    shortName: "MEX",
  },
  {
    longName: "Moldova",
    shortName: "MDA",
  },
  {
    longName: "Mongolia",
    shortName: "MNG",
  },
  {
    longName: "Montenegro",
    shortName: "MNE",
  },
  {
    longName: "Morocco",
    shortName: "MAR",
  },
  {
    longName: "Mozambique",
    shortName: "MOZ",
  },
  {
    longName: "Myanmar",
    shortName: "MMR",
  },
  {
    longName: "Namibia",
    shortName: "NAM",
  },
  {
    longName: "Nepal",
    shortName: "NPL",
  },
  {
    longName: "Netherlands",
    shortName: "NLD",
  },
  {
    longName: "New Caledonia",
    shortName: "NCL",
  },
  {
    longName: "New Zealand",
    shortName: "NZL",
  },
  {
    longName: "Nicaragua",
    shortName: "NIC",
  },
  {
    longName: "Niger",
    shortName: "NER",
  },
  {
    longName: "Nigeria",
    shortName: "NGA",
  },
  {
    longName: "North Macedonia",
    shortName: "MKD",
  },
  {
    longName: "Northern Cyprus",
    shortName: "CYN",
  },
  {
    longName: "Norway",
    shortName: "NOR",
  },
  {
    longName: "Oman",
    shortName: "OMN",
  },
  {
    longName: "Pakistan",
    shortName: "PAK",
  },
  {
    longName: "Palestine",
    shortName: "PSX",
  },
  {
    longName: "Panama",
    shortName: "PAN",
  },
  {
    longName: "Papua New Guinea",
    shortName: "PNG",
  },
  {
    longName: "Paraguay",
    shortName: "PRY",
  },
  {
    longName: "Peru",
    shortName: "PER",
  },
  {
    longName: "Philippines",
    shortName: "PHL",
  },
  {
    longName: "Poland",
    shortName: "POL",
  },
  {
    longName: "Portugal",
    shortName: "PRT",
  },
  {
    longName: "Puerto Rico",
    shortName: "PRI",
  },
  {
    longName: "Qatar",
    shortName: "QAT",
  },
  {
    longName: "Republic of Korea",
    shortName: "KOR",
  },
  {
    longName: "Republic of the Congo",
    shortName: "COG",
  },
  {
    longName: "Romania",
    shortName: "ROU",
  },
  {
    longName: "Russian Federation",
    shortName: "RUS",
  },
  {
    longName: "Rwanda",
    shortName: "RWA",
  },
  {
    longName: "Saudi Arabia",
    shortName: "SAU",
  },
  {
    longName: "Senegal",
    shortName: "SEN",
  },
  {
    longName: "Serbia",
    shortName: "SRB",
  },
  {
    longName: "Sierra Leone",
    shortName: "SLE",
  },
  {
    longName: "Slovakia",
    shortName: "SVK",
  },
  {
    longName: "Slovenia",
    shortName: "SVN",
  },
  {
    longName: "Solomon Islands",
    shortName: "SLB",
  },
  {
    longName: "Somalia",
    shortName: "SOM",
  },
  {
    longName: "Somaliland",
    shortName: "SOL",
  },
  {
    longName: "South Africa",
    shortName: "ZAF",
  },
  {
    longName: "South Sudan",
    shortName: "SDS",
  },

  {
    longName: "Spain",
    shortName: "ESP",
  },
  {
    longName: "Sri Lanka",
    shortName: "LKA",
  },
  {
    longName: "Sudan",
    shortName: "SDN",
  },

  {
    longName: "Suriname",
    shortName: "SUR",
  },
  {
    longName: "Sweden",
    shortName: "SWE",
  },
  {
    longName: "Switzerland",
    shortName: "CHE",
  },
  {
    longName: "Syria",
    shortName: "SYR",
  },
  {
    longName: "Taiwan",
    shortName: "TWN",
  },
  {
    longName: "Tajikistan",
    shortName: "TJK",
  },
  {
    longName: "Tanzania",
    shortName: "TZA",
  },
  {
    longName: "Thailand",
    shortName: "THA",
  },
  {
    longName: "The Gambia",
    shortName: "GMB",
  },
  {
    longName: "Timor-Leste",
    shortName: "TLS",
  },
  {
    longName: "Togo",
    shortName: "TGO",
  },
  {
    longName: "Trinidad and Tobago",
    shortName: "TTO",
  },
  {
    longName: "Tunisia",
    shortName: "TUN",
  },
  {
    longName: "Turkey",
    shortName: "TUR",
  },
  {
    longName: "Turkmenistan",
    shortName: "TKM",
  },
  {
    longName: "Uganda",
    shortName: "UGA",
  },
  {
    longName: "Ukraine",
    shortName: "UKR",
  },
  {
    longName: "United Arab Emirates",
    shortName: "ARE",
  },
  {
    longName: "United Kingdom",
    shortName: "GBR",
  },
  {
    longName: "United States",
    shortName: "USA",
  },
  {
    longName: "Uruguay",
    shortName: "URY",
  },
  {
    longName: "Uzbekistan",
    shortName: "UZB",
  },
  {
    longName: "Vanuatu",
    shortName: "VUT",
  },
  {
    longName: "Venezuela",
    shortName: "VEN",
  },
  {
    longName: "Vietnam",
    shortName: "VNM",
  },
  {
    longName: "Western Sahara",
    shortName: "SAH",
  },
  {
    longName: "Yemen",
    shortName: "YEM",
  },
  {
    longName: "Zambia",
    shortName: "ZMB",
  },
  {
    longName: "Zimbabwe",
    shortName: "ZWE",
  },
];
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
  return (
    <div className=" relative ">
      <main className="flex flex-col lg:ml-2 ">
        <header className="w-full bg-transparent">
          {/* <HeatGapHeader countrySelector={allCountries} /> */}
        </header>

        <div
          className="flex flex-col items-center justify-center"
          style={{ margin: "0vh", border: "2px dashed skyblue" }}
        >
          <div
            style={{ position: "sticky", top: 0, border: "1px solid orchid" }}
          >
            I'm sticky. The current triggered step index is: {currentStepIndex}
            <div className="w-screen h-screen stick  md:pt-0 rounded  md:col-span-2 lg:col-span-4 ">
              <Slider
                className="w-full"
                defaultValue={[1]}
                max={1}
                step={0.1}
                onValueChange={(value) => setSliderValue(value)}
              />
              {/*  aspect-[4/3] md:aspect-[16/9]  */}
              <div className=" w-full h-full flex flex-col md:flex-row mx-10">
                <figure
                  ref={parentRef}
                  className="flex-grow max-md:h-[205px] relative z-10  lg:order-last"
                >
                  <ParentSize>
                    {({ width, height }) => {
                      return (
                        <DeckglMap
                          zoomToWhichState={""}
                          zoomToWhichCounty={""}
                          geographyData={[]}
                          data={SORTED_DATA}
                          colorVariable={COLOR_VARIABLE}
                          xVariable={X_VARIABLE}
                          yVariable={Y_VARIABLE}
                          width={width}
                          currentStepIndex={currentStepIndex}
                          STEP_CONDITIONS={STEP_CONDITIONS}
                        />
                      );
                    }}
                  </ParentSize>
                </figure>
              </div>
            </div>
          </div>
          <Scrollama offset={0.5} onStepEnter={onStepEnter} debug>
            {[1, 2, 3, 4, 5].map((_, stepIndex) => (
              <Step data={stepIndex} key={stepIndex}>
                <div
                  style={{
                    marginTop: `${
                      stepIndex == 0 ? "30vh" : 50 * stepIndex + "vh"
                    }`,
                    marginBottom: stepIndex == 4 ? "50vh" : 0,
                  }}
                  id="g-header-container"
                >
                  <header id="interactive-header">
                    <h1 id="interactive-heading" data-testid="headline">
                      Lorem ipsum dolor sit amet,
                    </h1>

                    <p id="interactive-leadin" data-testid="interactive-leadin">
                      What is this tool...Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Vestibulum fermentum, nibh et
                      posuere posuere, nisi velit accumsan libero, vitae luctus
                      justo mi a est. Morbi sel, vitae pharetra ante euismod ac.
                      Nam ipsum urna, fringilla sit amet diam eget, faucibus
                      eleifend leo. 
                    </p>
                    <div className="size-[500px]">
                      <ParentSize>
                        {({ width, height }) => {
                          return (
                            <BarChart
                              width={width}
                              height={height}
                              data={SORTED_DATA}
                              stepIndex={currentStepIndex}
                              xVariable={X_VARIABLE}
                              yVariable={Y_VARIABLE}
                            />
                          );
                        }}
                      </ParentSize>
                    </div>
                  </header>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>

        <footer id="interactive-header">
          <h1 id="interactive-heading" data-testid="headline">
            Lorem ipsum dolor sit amet,
          </h1>

          <p id="interactive-leadin" data-testid="interactive-leadin">
            What is this tool...Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Vestibulum fermentum, nibh et posuere posuere, nisi
            velit accumsan libero, vitae luctus justo mi a est. Morbi sel, vitae
            pharetra ante euismod ac. Nam ipsum urna, fringilla sit amet diam
            eget, faucibus eleifend leo. 
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
