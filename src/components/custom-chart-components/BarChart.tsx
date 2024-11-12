import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";

const Y_MAX = 191043.9235;
const margin = { top: 20, right: 20, bottom: 30, left: 60 };

interface BarChartProps {
  data: any[];
  width?: number;
  height?: number;
  xVariable: string;
  yVariable: string;
  horizontal?: boolean;
  fillCondition?: (d: any) => boolean;
  defaultColor?: string;
  highlightColor?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 928,
  height = 500,
  xVariable,
  yVariable,
  horizontal = false,
  fillCondition,
  defaultColor = "steelblue",
  highlightColor = "orange",
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Define inner dimensions
  const innerWidth = useMemo(
    () => Math.max(250, width - margin.left - margin.right),
    [width]
  );
  const innerHeight = useMemo(
    () => Math.max(250, height - margin.top - margin.bottom),
    [height]
  );

  // Scales
  const xScale = useMemo(() => {
    return horizontal
      ? d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d[xVariable]) ?? 0])
          .nice()
          .range([0, innerWidth])
      : d3
          .scaleBand()
          .domain(data.map((d) => d[xVariable]))
          .range([0, innerWidth])
          .padding(0.5);
  }, [data, xVariable, innerWidth, horizontal]);

  const yScale = useMemo(() => {
    return horizontal
      ? d3
          .scaleBand()
          .domain(data.map((d) => d[yVariable]))
          .range([0, innerHeight])
          .padding(0.1)
      : d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d[yVariable]) ?? 0])
          .nice()
          .range([innerHeight, 0]);
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

    // Axes
    const xAxis = horizontal
      ? d3.axisBottom(xScale).tickSize(0).tickValues([])
      : d3.axisBottom(xScale).tickSize(0).tickValues([]);

    const yAxis = horizontal
      ? d3.axisLeft(yScale).tickSize(0).tickValues([])
      : d3.axisLeft(yScale).tickSize(0).tickValues(yScale.ticks(2));

    svg
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(${margin.left},${margin.top + innerHeight})`
      )
      .call(xAxis)
      .call((g) => (horizontal ? g.select(".domain").remove() : g));
    svg
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(yAxis);

    // Remove domain lines
    svg.select(".x-axis").select(".domain").remove();
    svg.select(".y-axis").select(".domain").remove();

    // Bars
    chartGroup
      .selectAll(".bar")
      .data(data, (d: any) => d[yVariable])
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "bar")
            .attr("fill", (d) =>
              fillCondition
                ? fillCondition(d)
                  ? highlightColor
                  : defaultColor
                : defaultColor
            )
            .attr("stroke", (d) =>
              fillCondition
                ? fillCondition(d)
                  ? highlightColor
                  : defaultColor
                : defaultColor
            )
            // Initial position and size of entering bars
            .attr("x", (d) => (horizontal ? 0 : xScale(d[xVariable]) ?? 0))
            .attr("y", (d) =>
              horizontal ? yScale(d[yVariable]) ?? 0 : innerHeight
            )
            .attr("width", (d) => (horizontal ? 0 : xScale.bandwidth()))
            .attr("height", (d) => (horizontal ? yScale.bandwidth() : 0))
            .call((enter) =>
              enter
                .transition()
                .duration(500)
                // Final position and size after transition
                .attr("x", (d) => (horizontal ? 0 : xScale(d[xVariable]) ?? 0))
                .attr("y", (d) =>
                  horizontal
                    ? yScale(d[yVariable]) ?? 0
                    : yScale(d[yVariable]) ?? 0
                )
                .attr("width", (d) =>
                  horizontal ? xScale(d[xVariable]) ?? 0 : xScale.bandwidth()
                )
                .attr("height", (d) => {
                  return horizontal
                    ? yScale.bandwidth()
                    : innerHeight - yScale(d[yVariable]);
                })
            ),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(500)
              .attr("x", (d) => (horizontal ? 0 : xScale(d[xVariable]) ?? 0))
              .attr("y", (d) =>
                horizontal
                  ? yScale(d[yVariable]) ?? 0
                  : yScale(d[yVariable]) ?? 0
              )
              .attr("width", (d) =>
                horizontal ? xScale(d[xVariable]) ?? 0 : xScale.bandwidth()
              )
              .attr("height", (d) => {
                return horizontal
                  ? yScale.bandwidth()
                  : innerHeight - yScale(d[yVariable]);
              })
              .attr("fill", (d) =>
                fillCondition
                  ? fillCondition(d)
                    ? highlightColor
                    : defaultColor
                  : defaultColor
              )
              .attr("stroke", (d) =>
                fillCondition
                  ? fillCondition(d)
                    ? highlightColor
                    : defaultColor
                  : defaultColor
              )
          ),
        (exit) =>
          exit.call((exit) =>
            exit
              .transition()
              .duration(500)
              .attr(horizontal ? "width" : "height", 0)
              .remove()
          )
      );
  }, [
    data,
    xScale,
    yScale,
    innerHeight,
    margin,
    horizontal,
    xVariable,
    yVariable,
    fillCondition,
    defaultColor,
    highlightColor,
  ]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default BarChart;
