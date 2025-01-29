import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ParticleBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("position", "fixed")
      .style("top", 0)
      .style("left", 0)
      .style("z-index", 0)
      .style("pointer-events", "none");

    const particleCount = 50;
    const maxRadius = 5;

    const particles = d3.range(particleCount).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      radius: Math.random() * maxRadius + 2,
    }));

    const particleSelection = svg
      .selectAll("circle")
      .data(particles)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.radius)
      .attr("fill", "rgba(255, 255, 255, 0.7)")
      .attr("stroke", "rgba(255, 255, 255, 0.5)")
      .attr("stroke-width", 0.5);

    const tick = () => {
      particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.x < 0 || particle.x > width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > height) particle.dy *= -1;
      });

      particleSelection.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    };

    const interval = d3.interval(() => tick(), 16);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      svg.attr("width", newWidth).attr("height", newHeight);

      particles.forEach((particle) => {
        particle.x = Math.random() * newWidth;
        particle.y = Math.random() * newHeight;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      interval.stop();
      window.removeEventListener("resize", handleResize);
      svg.remove();
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ParticleBackground;
