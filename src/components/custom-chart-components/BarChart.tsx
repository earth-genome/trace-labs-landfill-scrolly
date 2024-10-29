import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, width = 928, height = 500 }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    const marginTop = 20, marginRight = 20, marginBottom = 30, marginLeft = 40;
    const innerWidth = width - marginLeft - marginRight;
    const innerHeight = height - marginTop - marginBottom;

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([innerHeight, 0]);

    // Create and animate bars
    const bars = svg.append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`)
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.category))
      .attr("y", innerHeight)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "steelblue");

    bars.transition()
      .duration(1000)
      .attr("y", d => y(d.value))
      .attr("height", d => innerHeight - y(d.value));

    // Add axes
    svg.append("g")
      .attr("transform", `translate(${marginLeft},${height - marginBottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`)
      .call(d3.axisLeft(y));

  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default BarChart;