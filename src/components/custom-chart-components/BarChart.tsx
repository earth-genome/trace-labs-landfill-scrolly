import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
const Y_MAX = 191043.9235;
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const BarChart = ({
  data,
  width = 928,
  height = 500,
  xVariable,
  yVariable,
  horizontal = false,
}: {
  data: any[];
  width?: number;
  height?: number;
  xVariable: string;
  yVariable: string;
  horizontal?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Define margins
  const innerWidth = useMemo(() => {
    return width - margin.left - margin.right;
  }, [width]);
  const innerHeight = useMemo(() => {
    return height - margin.top - margin.bottom;
  }, [height]);

  // Scales
  const xScale = useMemo(() => {
    return horizontal
      ? d3.scaleLinear().domain([0, Y_MAX]).nice().range([0, innerWidth])
      : d3
          .scaleBand()
          .domain(data.map((d) => d[xVariable]))
          .range([0, innerWidth])
          .padding(0.1);
  }, [data, xVariable, innerWidth, horizontal]);

  const yScale = useMemo(() => {
    return horizontal
      ? d3
          .scaleBand()
          .domain(data.map((d) => d[yVariable]))
          .range([0, innerHeight])
          .padding(0.1)
      : d3.scaleLinear().domain([0, Y_MAX]).nice().range([innerHeight, 0]);
  }, [data, yVariable, innerHeight, horizontal]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Create container group
    const chartGroup = svg
      .selectAll(".chart-group")
      .data([null])
      .join("g")
      .attr("class", "chart-group")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Bind data to rectangles
    const bars = chartGroup
      .selectAll(".bar")
      .data(data, (d: any) => d.asset_id);

    // Remove old bars
    bars
      .exit()
      .transition()
      .duration(500)
      .attr(horizontal ? "width" : "height", 0)
      .remove();

    // Update existing bars
    // bars
    //   .transition()
    //   .duration(500)
    //   .attr("x", (d) => (horizontal ? 0 : xScale(d[xVariable]) ?? 0))
    //   .attr("y", (d) =>
    //     horizontal ? yScale(d[yVariable]) ?? 0 : yScale(d[yVariable]) ?? 0
    //   )
    //   .attr("width", (d) =>
    //     horizontal ? xScale(d[xVariable]) ?? 0 : xScale.bandwidth()
    //   )
    //   .attr("height", (d) =>
    //     horizontal ? yScale.bandwidth() : innerHeight - yScale(d[yVariable])
    //   );

    // Add new bars
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "lightgray")
      .attr("stroke", "black")
      .attr("x", (d) => (horizontal ? 0 : xScale(d[xVariable]) ?? 0))
      .attr("y", (d) => (horizontal ? yScale(d[yVariable]) ?? 0 : innerHeight))
      .attr("width", (d) => (horizontal ? 0 : xScale.bandwidth()))
      .attr("height", (d) => (horizontal ? yScale.bandwidth() : 0))
      .transition()
      .duration(500)
      .attr("width", (d) =>
        horizontal ? xScale(d[xVariable]) ?? 0 : xScale.bandwidth()
      )
      .attr("height", (d) => {
        // horizontal ? yScale.bandwidth() : innerHeight - yScale(d[yVariable]
        console.log(d.emissions_quantity_avoided);
        return 10;
      })
      .attr("y", (d) =>
        horizontal ? yScale(d[yVariable]) ?? 0 : yScale(d[yVariable]) ?? 0
      );

    // Axes
    const xAxis = horizontal ? d3.axisBottom(xScale) : d3.axisBottom(xScale);
    const yAxis = horizontal ? d3.axisLeft(yScale) : d3.axisLeft(yScale);

    svg
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(${margin.left},${margin.top + innerHeight})`
      )
      .transition()
      .duration(500)
      .call(xAxis);

    svg
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .transition()
      .duration(500)
      .call(yAxis);
  }, [
    data,
    xScale,
    yScale,
    innerHeight,
    innerWidth,
    margin,
    horizontal,
    xVariable,
    yVariable,
  ]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default BarChart;
