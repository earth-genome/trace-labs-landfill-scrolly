// @ts-nocheck
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const StackedBarChart = ({
  data,
  width = 928,
  height = 500,
  X_VARIABLE,
  Y_VARIABLE,
  GROUP_VARIABLE,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    const marginTop = 10,
      marginRight = 10,
      marginBottom = 20,
      marginLeft = 40;


    // Determine the series that need to be stacked
    const series = d3
      .stack()
      .keys(d3.union(data.map((d) => d[GROUP_VARIABLE])))
      .value(([, D], key) => {
       
        return +D.get(key)[Y_VARIABLE]
      })
      ( d3.index(
        data,
        (d) => d[X_VARIABLE],
        (d) => d[GROUP_VARIABLE]
      ));

    // Prepare the scales for positional and color encodings
    const x = d3
      .scaleBand()
      .domain(
        d3.groupSort(
          data,
          (D) => -d3.sum(D, (d) => d[Y_VARIABLE]), // Sort by the sum of the Y_VARIABLE
          (d) => d[X_VARIABLE]
        )
      )
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
      .rangeRound([height - marginBottom, marginTop]);

    const color = d3
      .scaleOrdinal()
      .domain(series.map((d) => d.key))
      .range(d3.schemeRdGy[series.length])
      .unknown("#ccc");

    // Create the SVG container
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const layers = svg
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", (d) => color(d.key));

    layers.each(function (layerData, layerIndex) {
      d3.select(this)
        .selectAll("rect")
        .data(layerData)
        .join("rect")
        .attr("x", (d) => x(d.data[0]))
        .attr("y", (d) => y(d[0])) // Start from the bottom of each bar
        .attr("height", 0) // Start with zero height
        .attr("width", x.bandwidth())
        .transition()
        .duration(300)
        .delay(layerIndex * 100) // Delay each layer's animation
        .attr("y", (d) => y(d[1])) // Move up to the top of each bar
        .attr("height", (d) => Math.max(0, y(d[0]) - y(d[1]))); // Grow the height
    });

    // Append the horizontal axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((g) => g.selectAll(".domain").remove());

    // Append the vertical axis
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call((g) => g.selectAll(".domain").remove());
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default StackedBarChart;
