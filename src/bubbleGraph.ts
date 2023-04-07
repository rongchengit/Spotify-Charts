import * as d3 from 'd3'; //importing everything from d3
import { useRef } from 'react';
import { TrackData } from './Graph';

function normalizeRadius(value: number, minValue: number, maxValue: number, minRadius: number, maxRadius: number) {
  // Check if minValue and maxValue are equal
  if (minValue === maxValue) {
    // Return the average of minRadius and maxRadius
    return (minRadius + maxRadius) / 2;
  }

  // Normalize the input value within the range of minValue to maxValue
  const normalizedValue = (value - minValue) / (maxValue - minValue);

  // Scale the normalized value to the range of minRadius to maxRadius
  const radius = minRadius + (normalizedValue * (maxRadius - minRadius));

  return radius;
}


export default function buildGraph(data:TrackData[], backgroundImageURL: string){
const max = data.reduce((max: number, value: any) => max > value.count ? max : value.count, 1)
const min = data.reduce((min: number, value: any) => min < value.count ? min : value.count, max)
d3.select("#bubbleChart").select("svg").remove(); //ensure it doesnt redraw graph, it is used to get rid of second graph
const width = 1000
const height = 1000

// append the svg object to the body of the page
const svg = d3.select("#bubbleChart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  
svg.append("defs")
  .selectAll("pattern")
  .data(data)
  .enter()
  .append("pattern")
  .attr("id",(d:TrackData, i: number) => i)
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", 1)
  .attr("width", 1)
  .attr("patternUnits", "objectBoundingBox")
  .append("image")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", (d: any)=> normalizeRadius(d.count,min,max,25,100)*2)// position for the image
  .attr("width", (d: any)=> normalizeRadius(d.count,min,max,25,100)*2)
  .attr("preserveAspectRatio", "none")
  .attr("xlink:href", (d:TrackData) => d.image);

// Initialize the circle: all located at the center of the svg area
const node = svg.append("g")
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", (d: any)=> normalizeRadius(d.count,min,max,25,100))
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .style("fill", (d:TrackData, i: number) => `url(#${i})`)
  .attr("stroke", "#1DB954")
  .style("stroke-width", 4)
  .on("click", onBubbleClick)
  .on("mouseleave", onBubbleLeave)
  //@ts-ignore
  .call(d3.drag() // call specific function when circle is dragged
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)); 
  

const tooltip = d3.select("#bubbleChart")
  .append("div")
  .style("opacity", 0)
  .style("position", "absolute")
  .attr("class", "tooltip") 
  .style("background-color", "black")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "#1DB954");

//for background
svg.insert("image", ":first-child")
  .attr("href", backgroundImageURL)
  .attr("width", width)
  .attr("height", height)
  .attr("preserveAspectRatio","xMidYMid slice")
  .style("opacity",0.5)
  

// Features of the forces applied to the nodes:
const simulation = d3.forceSimulation()
  .force("center", d3.forceCenter().x(width / 2).y(height / 2)) //set the center of gravity for the center of the gravity
  .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
  .force("collide", d3.forceCollide().strength(.5).radius((d: any)=> normalizeRadius(d.count,min,max,25,100)).iterations(1)) // Force that avoids circle overlapping
  .force("attract", d3.forceRadial(0, width / 2, height / 2).strength(0.05))//how strong the attraction it is to the center of the gravityt

// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(data as any)
    //@ts-ignore
    .on("tick", function(d){
    //@ts-ignore
      node.attr("cx", d => d.x).attr("cy", d => d.y)
    });

// What happens when a circle is dragged?
//@ts-ignore
function dragstarted(event, d) {
 if (!event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
}
//@ts-ignore
function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}
//@ts-ignore
function dragended(event, d) {
 if (!event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
}

function onBubbleClick(event: any, d: TrackData) {
  tooltip.style("opacity", 1).html("artist: "+ d.name + "<br />count: "+ d.count)
  .style("left",event.pageX + "px") //event.pageX and event.pageY makes it relative position to the page for zooming + mobile
  .style("top",event.pageY + "px");    
}
function onBubbleLeave(event: any, d: any) {
  tooltip.transition().duration(500).style("opacity", 0);

  
}
}