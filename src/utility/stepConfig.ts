import { useMemo } from "react";

export const STEP_CONDITIONS = {
  1: (d) => d?.iso3_country === "MEX" && d?.top100OrNot === true,
  2: (d) => d?.annexOrNot === true && d?.top100OrNot === true,
  3: (d) => d?.top100OrNot === true,
} as const;

// Optional: Add metadata for each step if needed
const STEP_METADATA = {
  1: { label: "Mexican Top 100 Plants", description: "..." },
  2: { label: "Annexed Top 100 Plants", description: "..." },
  3: { label: "All Top 100 Plants", description: "..." },
} as const;

export const useStepFilteredData = (data: any[], stepIndex: number) => {
  return useMemo(() => {
    const condition = STEP_CONDITIONS[stepIndex];
    return condition ? data.filter(condition) : data;
  }, [data, stepIndex]);
};
