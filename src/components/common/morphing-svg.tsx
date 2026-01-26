'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const NUM_NODES_PER_AXIS = 10;
const SPACING = 500 / NUM_NODES_PER_AXIS;
const NUM_CONNECTIONS = 15;

export function MorphingSvg() {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<SVGCircleElement[]>([]);
  const linesRef = useRef<SVGPathElement[]>([]);
  
  const allNodes = [];
  const totalNodes = NUM_NODES_PER_AXIS * NUM_NODES_PER_AXIS;
  for (let i = 0; i < NUM_NODES_PER_AXIS; i++) {
    for (let j = 0; j < NUM_NODES_PER_AXIS; j++) {
      allNodes.push({
        cx: SPACING / 2 + i * SPACING,
        cy: SPACING / 2 + j * SPACING,
      });
    }
  }

  useEffect(() => {
    if (!svgRef.current) return;
    
    const nodes = nodesRef.current;
    const lines = linesRef.current;
    
    // Initial setup for lines
    gsap.set(lines, { opacity: 0 });

    const animateConnections = () => {
        for (let i = 0; i < NUM_CONNECTIONS; i++) {
            const node1 = nodes[Math.floor(Math.random() * totalNodes)];
            const node2 = nodes[Math.floor(Math.random() * totalNodes)];
            const line = lines[i];

            if (node1 && node2 && line) {
                const x1 = node1.getAttribute('cx');
                const y1 = node1.getAttribute('cy');
                const x2 = node2.getAttribute('cx');
                const y2 = node2.getAttribute('cy');
                
                // Set path and prepare for draw animation
                line.setAttribute('d', `M${x1},${y1} L${x2},${y2}`);
                const pathLength = line.getTotalLength();
                gsap.set(line, {
                  strokeDasharray: pathLength,
                  strokeDashoffset: pathLength,
                  opacity: 1
                });
                
                // Animate
                gsap.to(line, {
                    strokeDashoffset: 0,
                    duration: 1.0,
                    ease: 'power2.in',
                    delay: Math.random() * 2, // Stagger start time
                    onComplete: () => {
                       // Fade out after drawing
                       gsap.to(line, {
                           opacity: 0,
                           duration: 0.5,
                           delay: 0.5
                       });
                    }
                });
            }
        }
    }
    
    // Run the animation loop
    animateConnections();
    const animationInterval = setInterval(animateConnections, 3500); // Repeat every 3.5 seconds

    return () => clearInterval(animationInterval);
    
  }, [totalNodes]);


  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full object-contain"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.3 }} />
        </linearGradient>
      </defs>
      <g>
         {/* Node grid */}
        {allNodes.map((node, i) => (
          <circle
            key={`node-${i}`}
            ref={el => { if (el) nodesRef.current[i] = el; }}
            cx={node.cx}
            cy={node.cy}
            r="1.5"
            fill="hsl(var(--primary))"
            opacity="0.3"
          />
        ))}
        {/* Animated connections */}
        {Array.from({ length: NUM_CONNECTIONS }).map((_, i) => (
            <path
                key={`line-${i}`}
                ref={el => { if (el) linesRef.current[i] = el; }}
                stroke="url(#gradient1)"
                strokeWidth="0.5"
                fill="none"
            />
        ))}
      </g>
    </svg>
  );
}
