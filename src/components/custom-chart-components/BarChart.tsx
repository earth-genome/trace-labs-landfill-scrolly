import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { useStepFilteredData } from "../../utility/stepConfig";

const BarChart = ({
  data,
  width = 928,
  height = 500,
  stepIndex,
  xVariable,
  yVariable,
}: {
  data: any[];
  width: number;
  height: number;
  stepIndex: number;
  xVariable: string;
  yVariable: string;
}) => {
  const svgRef = useRef(null);
  const filteredData = useStepFilteredData(data, stepIndex);
  const marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 140;
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;
  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d[xVariable])])
        .range([0, innerWidth]),
    [filteredData, xVariable, innerWidth]
  );

  const y = useMemo(
    () =>
      d3
        .scaleBand()
        .domain([...new Set(filteredData.map((d) => d[yVariable]))])
        .range([innerHeight, 0])
        .padding(0.1),
    [filteredData, yVariable, innerHeight]
  );
  useEffect(() => {
    if (filteredData.length > 100 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    // Create scales

    console.log(filteredData);
    // // Create and animate bars
    const bars = svg
      .append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`)
      .selectAll("rect")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d[yVariable]) ?? 0)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", (d) => x(d[xVariable]) ?? 0)
      .attr("fill", "lightgray")
      .attr("stroke", "black");

    // bars
    //   .transition()
    //   .duration(1000)
    //   .attr("y", (d) => y(d[yVariable]))
    //   .attr("height", (d) => innerHeight - y(d[yVariable]));

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},${height - marginBottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`)
      .call(d3.axisLeft(y));
  }, [filteredData, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default BarChart;
