import React, { useMemo } from "react";

import { SquareDashedMousePointer } from "lucide-react";
const Tooltip = ({
  left,
  top,

  showMapUXInfo = false,
  showScatterplotUXInfo = false,
  containerWidth,
  containerHeight,
}: {
  left: number;
  top: number;
  county: string;
  state: string;
  gap: string;
  worry: string;
  rating: string;
  showMapUXInfo: boolean;
  showScatterplotUXInfo: boolean;
  containerWidth: number;
  containerHeight: number;
}) => {
  // Memoize the styles to avoid creating new objects on each render
  const tooltipStyle = useMemo(
    () => ({
      left: left > containerWidth / 2 ? left : left,
      top: top > containerHeight / 2 ? top : top,
      boxShadow: "#B5B5B5 1.5px 1.5px",
    }),
    [left, top]
  );

  // Memoize the color style for the gap div
  // const gapStyle = useMemo(
  //   () => ({
  //     backgroundColor: colorScale(gap),
  //   }),
  //   [colorScale, gap]
  // );

  return (
    <div
      style={tooltipStyle}
      className="absolute desktop:min-w-[350px] z-[1000] pointer-events-none max-w-md min-w-[200px] bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] px-2 border-2 border-[#B5B5B5]"
    >
      <div className="px-4 py-2 border-b border-gray-200 ">
        <h2 className="text-sm font-bold text-gray-800 text-center">ABC</h2>
      </div>
      <div className="px-4 py-2 ">
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-semibold">Gap</p>
            <div className="mt-1">
              <div className="h-6 w-16">
                <p className="text-white text-lg font-bold leading-6">DEF</p>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400">
            <p className="text-sm ">Worry</p>
            <p className="text-xl p-0.5">GHI</p>
          </div>
          <div className="text-center text-gray-400">
            <p className="text-sm ">Rating</p>
            <p className="text-xl p-0.5">JKL</p>
          </div>
        </div>

        {/* Clickable: info for UX */}
        {showMapUXInfo && (
          <div className="my-1 flex justify-center">
            <p className="text-sm flex items-center gap-1 text-[rgba(107,114,128,.6)] mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M10 9a1 1 0 0 1 1-1a1 1 0 0 1 1 1v4.47l1.21.13l4.94 2.19c.53.24.85.77.85 1.35v4.36c-.03.82-.68 1.47-1.5 1.5H11c-.38 0-.74-.15-1-.43l-4.9-4.2l.74-.77c.19-.21.46-.32.74-.32h.22L10 19zm1-4a4 4 0 0 1 4 4c0 1.5-.8 2.77-2 3.46v-1.22c.61-.55 1-1.35 1-2.24a3 3 0 0 0-3-3a3 3 0 0 0-3 3c0 .89.39 1.69 1 2.24v1.22C7.8 11.77 7 10.5 7 9a4 4 0 0 1 4-4m0-2a6 6 0 0 1 6 6c0 1.7-.71 3.23-1.84 4.33l-1-.45A5.02 5.02 0 0 0 16 9a5 5 0 0 0-5-5a5 5 0 0 0-5 5c0 2.05 1.23 3.81 3 4.58v1.08C6.67 13.83 5 11.61 5 9a6 6 0 0 1 6-6"
                />
              </svg>
              Click to zoom into county
            </p>
          </div>
        )}

        {showScatterplotUXInfo && (
          <p className="text-xs text-gray-400 font-thin flex items-center">
            <SquareDashedMousePointer />
            <span className="ml-2">
              Click and hold to lasso multiple points
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(Tooltip);
