import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface PieChartProps {
  data: { name: string; value: number }[];
  width?: number;
  height?: number;
  colors?: string[]; // New prop for custom colors
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 928,
  height = 500,
  colors, // Accept custom colors
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous SVG content
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const color = d3
      .scaleOrdinal<string, string>()
      .domain(data.map((d) => d.name))
      .range(
        colors && colors.length >= data.length
          ? colors // Use custom colors if provided
          : d3
              .quantize(
                (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
                data.length
              )
              .reverse()
      );

    const pie = d3
      .pie<{ name: string; value: number }>()
      .sort(null)
      .value((d) => d.value);

    const arc = d3
      .arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius - 1);

    const labelRadius = radius * 0.8;

    const arcLabel = d3
      .arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    const arcs = pie(data);

    const svg = svgElement
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .style("max-width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");

    // Group for the slices
    const g = svg.append("g").attr("stroke", "white");

    // Bind data to paths (slices)
    const path = g.selectAll("path").data(arcs, (d: any) => d.data.name);

    // Exit old slices
    path
      .exit()
      .transition()
      .duration(750)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.startAngle = interpolate(t);
          return arc(d);
        };
      })
      .remove();

    // Update existing slices
    path
      .transition()
      .duration(750)
      .attrTween("d", function (d) {
        const previous = this._current;
        const current = d;
        if (previous) {
          const interpolate = d3.interpolate(previous, current);
          this._current = interpolate(1);
          return function (t) {
            return arc(interpolate(t));
          };
        } else {
          const interpolate = d3.interpolate(
            { startAngle: 0, endAngle: 0 },
            current
          );
          this._current = interpolate(1);
          return function (t) {
            return arc(interpolate(t));
          };
        }
      })
      .attr("fill", (d) => color(d.data.name));

    // Enter new slices
   const newPath = path
    .enter()
    .append("path")
    .attr("fill", (d) => color(d.data.name))
    .attr("d", arc)  // Just use arc directly here
    .each(function (d) {
      this._current = d;
    });

    newPath
      .transition()
      .duration(750)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        this._current = interpolate(1);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    // Labels group
    const text = svg
      .append("g")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs, (d: any) => d.data.name);

    // Exit old labels
    text.exit().remove();

    // Update existing labels
    text
      .transition()
      .duration(750)
      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .style("opacity", (d) => (d.endAngle - d.startAngle > 0.25 ? 1 : 0))
      .select("tspan")
      .text((d) => d.data.name);

    // Enter new labels
    const newText = text
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .style("opacity", 0)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.name)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.value.toLocaleString("en-US"))
      );

    newText.transition().duration(750).style("opacity", 1);
  }, [data, width, height, colors]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
