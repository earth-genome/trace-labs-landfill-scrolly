import React from "react";

const LegendValues = [
  { value: "150K", displaySize: 32, circle: 8 },
  { value: "100K", displaySize: 24, circle: 6 },
  { value: "50K", displaySize: 16, circle: 4 },
  { value: "18K", displaySize: 8, circle: 2 },
];
const EmissionLegend = ({
  highlightColor,
  defaultColor,
  currentStepIndex,
}: {
  highlightColor: string;
  defaultColor: string;
  currentStepIndex: number;
}) => {
  return (
    <div className="bg-[#f8f8e9] bg-opacity-10  backdrop-blur-sm rounded-md w-[250px] space-y-4 z-50">
      <div className="space-y-4 ">
        {/* Color legend */}
        <div
          className="flex flex-col gap-2 font-semibold"
          style={{ fontSize: "10px" }}
        >
          <div className="flex items-start space-x-2">
            <span
              className="size-4 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: highlightColor }}
            ></span>
            <p className="text-gray-600 leading-tight">
              {currentStepIndex >= 10
                ? "The 100 landfills we are capping in this scenario"
                : "The 100 landfills we are capping in this scenario"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className="size-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: defaultColor }}
            ></span>
            <p className="text-gray-600">The rest</p>
          </div>
        </div>
        <p className="text-gray-700 font-bold" style={{ fontSize: "10px" }}>
          Emissions reduction potential (t)
        </p>
        {/* Size legend */}
        <div
          className="grid grid-cols-[40px_1fr] gap-y-4 gap-x-2 flex-col-reverse"
          style={{ fontSize: "10px", marginTop: "4px" }}
        >
          {[...LegendValues].reverse().map((item) => (
            <React.Fragment key={item.value}>
              <div className="relative flex items-center justify-center">
                <div
                  className="rounded-full  absolute"
                  style={{
                    width: `${item.circle * 4}px`,
                    height: `${item.circle * 4}px`,
                    backgroundColor: highlightColor,
                  }}
                />
              </div>
              <div className="text-gray-600 self-center">{item.value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmissionLegend;
