const LegendValues = [
  { value: 191044, size: 40 },
  { value: 150000, size: 32 },
  { value: 100000, size: 24 },
  { value: 50000, size: 16 },
  { value: 18350, size: 8 },
];

const EmissionLegend = () => {
  return (
    <div
      id="legend"
      className="bg-[#f8f8e9] bg-opacity-10 backdrop-blur-sm p-4 text-sm rounded-md w-64 space-y-4 z-50 absolute bottom-0 left-4"
    >
      {/* <!-- Title for legend --> */}
      <div>
        <p className="font-semibold text-gray-700">
          Ranking of Emission quantity avoided
        </p>
        {/* <!-- Color legend --> */}
        <div className="flex items-center space-x-2 mt-2">
          <span className="w-3 h-3 bg-[#79B4AD] rounded-full"></span>
          <p className="text-gray-600">Top100</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-[#79b4ad36] rounded-full"></span>
          <p className="text-gray-600">Other</p>
        </div>
      </div>

      {/* <!-- Title for size legend --> */}
    </div>
  );
};

export default EmissionLegend;
