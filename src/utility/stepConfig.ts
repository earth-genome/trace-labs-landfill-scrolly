import { useMemo } from "react";

// Optional: Add metadata for each step if needed
export const STEP_METADATA = {
  0: { label: "All Plants", text: "..." },
  1: { label: "Mexican Top 100 Plants", text: "..." },
  2: { label: "Annexed Top 100 Plants", text: "..." },
  3: { label: "All Top 100 Plants", text: "..." },
} as const;

export const STEP_CONDITIONS = {
  1: (d: any) => d?.top100InMexico === true,
  2: (d: any) => d?.top100InAnnex === true,
  3: (d: any) => d?.top100OrNot === true,
} as const;

export const useStepFilteredData = (data: any[], stepIndex: number) => {
  return useMemo(() => {
    const condition = STEP_CONDITIONS[stepIndex];
    return condition ? data.filter(condition) : data;
  }, [data, stepIndex]);
};
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

export const top100Conditions = [
  [
    { name: "A", value: 0.25 },
    { name: "B", value: 0.75 },
  ],
  [
    { name: "A", value: 0.25 },
    { name: "B", value: 0.75 },
  ],
  [
    { name: "A", value: 0.25 },
    { name: "B", value: 0.75 },
  ],
];
