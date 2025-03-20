// app/setting/page.js
"use client";

import { useState, useRef } from "react";
import * as d3 from "d3";

export default function Setting() {
  const [combination, setCombination] = useState("");
  const svgRef = useRef(null);

  const renderGraph = () => {
    const input = combination.trim();
    if (!input) return;
    const nodesArray = input.split(/\s+/);

    // Build unique nodes list.
    const nodes = [];
    const nodesMap = {};
    nodesArray.forEach((d) => {
      if (!nodesMap[d]) {
        nodes.push({ id: d });
        nodesMap[d] = true;
      }
    });

    // Build links as a cycle: a → b, b → c, ... last → first.
    const links = [];
    for (let i = 0; i < nodesArray.length; i++) {
      const source = nodesArray[i];
      const target = i === nodesArray.length - 1 ? nodesArray[0] : nodesArray[i + 1];
      links.push({ source, target });
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // Setup the simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link", d3.forceLink(links).id((d) => d.id).distance(150))
      .on("tick", ticked);

    // Draw links
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    // Draw nodes
    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", "steelblue")
      .on("click", (event, d) => {
        // Reset all nodes to steelblue then highlight the clicked one.
        svg.selectAll("circle").attr("fill", "steelblue");
        d3.select(event.currentTarget).attr("fill", "orange");
        alert("Start node set to: " + d.id);
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Add labels
    const labels = svg
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .text((d) => d.id);

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Combination Setting</h2>
      <p>
        Enter a combination (space-separated nodes). For example, "a b c" will generate a cycle graph: a→b, b→c, and c→a.
      </p>
      <input
        type="text"
        value={combination}
        onChange={(e) => setCombination(e.target.value)}
        placeholder="a b c"
        style={{ width: "300px", marginRight: "1rem" }}
      />
      <button onClick={renderGraph}>Render Graph</button>
      <br />
      <br />
      <svg ref={svgRef} width="600" height="400"></svg>
    </div>
  );
}
