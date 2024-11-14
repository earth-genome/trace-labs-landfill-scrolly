import React from "react";

const LegendValues = [
  { value: "191K", displaySize: 40, circle: 10 },
  { value: "150K", displaySize: 32, circle: 8 },
  { value: "100K", displaySize: 24, circle: 6 },
  { value: "50K", displaySize: 16, circle: 4 },
  { value: "18K", displaySize: 8, circle: 2 },
];
const EmissionLegend = ({
  highlightColor,
  defaultColor,
}: {
  highlightColor: string;
  defaultColor: string;
}) => {
  return (
    <div className="bg-[#f8f8e9] bg-opacity-10  backdrop-blur-sm text-sm rounded-md w-[300px] space-y-4 z-50">
      <div className="space-y-4 ">
        {/* Color legend */}
        <div className="flex flex-col gap-2 ">
          <div className="flex items-start space-x-2">
            <span
              className="size-4 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: highlightColor }}
            ></span>
            <p className="text-gray-600">
              The 100 largest landfills across Annex I countries
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
        <p className="text-gray-700 font-bold">Emission quantity avoided (T)</p>
        {/* Size legend */}
        <div className="grid grid-cols-[40px_1fr] gap-y-3 gap-x-2 flex-col-reverse">
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
