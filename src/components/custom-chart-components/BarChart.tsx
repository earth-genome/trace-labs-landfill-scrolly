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
  
    // Create container if it doesn't exist
    const chartGroup = svg
      .selectAll('.chart-group')
      .data([null])
      .join('g')
      .attr('class', 'chart-group')
      .attr("transform", `translate(${marginLeft},${marginTop})`);
  
    // Update scales are now in useMemo, so no need to update domains here
  
    // Data join with proper key function
    const bars = chartGroup
      .selectAll(".bar")
      .data(filteredData, d => d.asset_id);
  
    // Remove exiting bars with transition
    bars.exit()
      .transition()
      .duration(1000)
      .attr("width", 0)
      .remove();
  
    // Update existing bars
    bars.transition()
      .duration(1000)
      .attr("y", d => y(d[yVariable]) ?? 0)
      .attr("x", 0)
      .attr("width", d => x(d[xVariable]) ?? 0)
      .attr("height", y.bandwidth());
  
    // Add new bars
    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d[yVariable]) ?? 0)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", "lightgray")
      .attr("stroke", "black")
      .transition()
      .duration(1000)
      .attr("width", d => x(d[xVariable]) ?? 0);
  
    // Update axes
    const xAxis = svg
      .selectAll('.x-axis')
      .data([null])
      .join('g')
      .attr('class', 'x-axis')
      .attr("transform", `translate(${marginLeft},${height - marginBottom})`);
  
    const yAxis = svg
      .selectAll('.y-axis')
      .data([null])
      .join('g')
      .attr('class', 'y-axis')
      .attr("transform", `translate(${marginLeft},${marginTop})`);
  
    xAxis.transition().duration(1000).call(d3.axisBottom(x));
    yAxis.transition().duration(1000).call(d3.axisLeft(y));
  
  }, [filteredData, width, height, x, y, xVariable, yVariable]);
  
  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default BarChart;
