
import { MultiSelectSearch } from "../custom-ui-components/MultiSelectSearch";



export const HeatGapHeader = ({ countrySelector }) => {
 

  return (
    <div className="mx-auto   py-2 md:px-6">
      <div className="flex items-center mx-4 md:space-x-4">
        <h2 className="text-2xl lg:text-xl font-bold  lg:text-black hidden md:block">
          Country
        </h2>
        <span className="text-gray-600 hidden md:block">in</span>
        <MultiSelectSearch
          frameworks={countrySelector.map((d) => {
            return {
              value: d.shortName,
              label: d.longName,
            };
          })}
        />
      </div>
    </div>
  );
};
