<template>
  <b-container>
    <b-row>
      <b-col>
        <b-row class="custom-container">
          <h2 class="title">Number of nodes</h2>
          <svg width="100%" height="500">
            <g class="building" ref="building"></g>
            <g class="trajectories" ref="chart"></g>
            <div></div>
          </svg>
           <div ref="tooltip" class="tooltip" style="opacity: 0;"></div>
        </b-row>

        <b-row class="custom-container2" ref="container2">
          <h2 class="title" >Relationships</h2>
          <div class="chartContainer2" ref="chartContainer"></div>
        </b-row>
        <b-row class="custom-container3" ref="container3">
          <h2 class="title" >Force Graph</h2>
          <p>Rendi il grafico più complesso</p>
         
          <label for="nodeRange">Aumenta le relazioni tra nodi: {{ maxNodes }}</label>
            <input type="range" id="nodeRange" :min="0" :max="1000" v-model="maxNodes" @input="handleNodeRangeChange">
  
          <div class="chartContainer3" ref="chartContainer3"><svg class="aiuto"></svg></div>
           <p>Visualizza il Force graph selezionando le entità desiderate</p>
           <b-dropdown id="dropdown-1" :text="selectedValues[0]" c class="m-md-2">
                <b-dropdown-item  @click="prove1('company')">Company</b-dropdown-item>
                <b-dropdown-item  @click="prove1('political_organization')">Political Organization</b-dropdown-item>
                <b-dropdown-item  @click="prove1('organization')">Organization</b-dropdown-item>
                <b-dropdown-divider  @click="prove1('Company')"></b-dropdown-divider>
                <b-dropdown-item @click="prove1('vessel')">Vessel</b-dropdown-item>
                <b-dropdown-item @click="prove1('person')">Person</b-dropdown-item>
                <b-dropdown-item @click="prove1('location')">Location</b-dropdown-item>
                <b-dropdown-item @click="prove1('movement')">Movement</b-dropdown-item>
                <b-dropdown-item @click="prove1('event')">Event</b-dropdown-item>
            </b-dropdown>
            <b-dropdown id="dropdown-1" :text="selectedValues[1]" class="m-md-2">
                <b-dropdown-item  @click="prove2('company')">Company</b-dropdown-item>
                <b-dropdown-item  @click="prove2('political_organization')">Political Organization</b-dropdown-item>
                <b-dropdown-item  @click="prove2('organization')">Organization</b-dropdown-item>
                <b-dropdown-divider  @click="prove2('Company')"></b-dropdown-divider>
                <b-dropdown-item @click="prove2('vessel')">Vessel</b-dropdown-item>
                <b-dropdown-item @click="prove2('person')">Person</b-dropdown-item>
                <b-dropdown-item @click="prove2('location')">Location</b-dropdown-item>
                <b-dropdown-item @click="prove2('movement')">Movement</b-dropdown-item>
                <b-dropdown-item @click="prove1('event')">Event</b-dropdown-item>
            </b-dropdown>
             <b-row class="custom-container3" ref="container3">
             
            <div class="chartContainer6" ref="chartContainer7"><p>Tipi di relazione</p><svg class="aiuto3"></svg></div>
            
            <div class="chartContainer6" ref="chartContainer7"><p>Numero di relazioni sospette</p><svg class="aiuto4"></svg></div>
        </b-row>
          <div class="chartContainer3" ref="chartContainer5"><svg class="aiuto2"></svg></div>
        </b-row>
       
        <b-row class="custom-container6" ref="container3">
            
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import * as d3 from 'd3';
import { defineComponent } from 'vue';
import { BRow, BFormInput, BCol, BBadge, BListGroupItem, BListGroup, BContainer, BDropdownItem,
    BDropdownDivider, BDropdown } from 'bootstrap-vue-next';
import drawnChart2 from '@/assets/gestioneData';
var data;
var data2;
var nodeName;
var filteredNodes;

const color = d3.scaleOrdinal(d3.schemeCategory10);
const drag = simulation => {
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
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

//secondo grafico
function graficoComplesso2(nodeName, tipo1, tipo2) {
    // Copio i dati originali
    var originalLinks = JSON.parse(JSON.stringify(data.links));
    var originalNodes = JSON.parse(JSON.stringify(data2));

    // Filtro i nodi in base ai tipi specificati e ai nodi di interesse
    const filteredNodes = originalNodes.filter(n => 
        n.type === tipo1 || n.type === tipo2 ||
        ["Mar de la Vida OJSC", "Oceanfront Oasis Inc Carriers", 8327, 979893388].includes(n.id) ||
        !n.type // Include i nodi senza tipo
    );
    
    // Creo un set di ID dei nodi filtrati per una ricerca rapida
    const nodeIds = new Set(filteredNodes.map(n => n.id));

    // Filtro i link in base ai nodi filtrati
    const filteredLinks = originalLinks.filter(l => 
        nodeIds.has(l.source) && nodeIds.has(l.target)
    );
     // Imposta i pesi dei nodi basati sul numero di collegamenti
    const nodeWeights = {};
    filteredLinks.forEach(l => {
        nodeWeights[l.source] = (nodeWeights[l.source] || 0) + 1;
        nodeWeights[l.target] = (nodeWeights[l.target] || 0) + 1;
    });
    filteredNodes.forEach(n => {
        n.weight = nodeWeights[n.id] || 0;
    });
    // Verifico i link filtrati
    console.log('Filtered Links:', filteredLinks); // Debug: Controlla i link filtrati

    const div = d3.select("div.tooltip");
    const gethtml = (id, links) => {
        return `<div>node: ${id}</div> <div>links: ${links}</div>`;
    }

    const simulation = d3.forceSimulation(filteredNodes)
        .force('link', d3.forceLink(filteredLinks).id(d => d.id).strength(0.02))
        .force('charge', d3.forceManyBody().strength(-800))
        .force("center", d3.forceCenter(1500, 1500))
        .force('collision', d3.forceCollide().radius(100))
        .velocityDecay(0.9) 
        .alphaDecay(0.1); 


    function linkForceOfType(type) {
        return d3.forceLink(filteredLinks)
            .id(d => d.type)
            .strength(0.9);
    }

    simulation
        .force('link_type_1', linkForceOfType("location"))
        .force('link_type_2', linkForceOfType("organization"))
        .force('link_type_3', linkForceOfType("political_organization"))
        .force('link_type_4', linkForceOfType("movement"))
        .force('link_type_5', linkForceOfType("company"))
        .force('link_type_6', linkForceOfType("person"));
    d3.select(".aiuto2").selectAll("*").remove();
        const svg = d3.select(".aiuto2")
            .attr("viewBox", [0, 0, 3000, 3000]) //dimensioni vista grafico
            .attr("preserveAspectRatio", "xMidYMid meet");

    
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const linkSelection2 = svg.selectAll('line')
        .data(filteredLinks)
        .join('line')
        .style("stroke", "#ccc");

    const nodeSelection = svg.selectAll('circle')
        .data(filteredNodes)
        .enter()
        .append('circle')
        .attr('r', d => {
            if (["Mar de la Vida OJSC", "Oceanfront Oasis Inc Carriers", 8327, 979893388 ].includes(d.id)) {
                return 20;
            } else {
               return 10;
            }
        })
        .attr("fill", d => {
            if (["Mar de la Vida OJSC", "Oceanfront Oasis Inc Carriers", 8327, 979893388 ].includes(d.id)) {
                return 'black';
            } else {
                return color(d.type);
            }
        })
        .on('mouseover', function (event, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
            div.transition()
                .duration(50)
                .style("opacity", 1);
            div.html(gethtml(d.id, d.weight));
            const bbox = this.getBoundingClientRect();
            div.html(gethtml(d.id, d.weight))
                .style("left", `${bbox.x + window.scrollX + bbox.width / 2}px`)
                .style("top", `${bbox.y + window.scrollY - 58}px`);
            linkSelection2
                .style("stroke", l => l.source.id === d.id || l.target.id === d.id ? 'red' : '#ccc')
                .style("stroke-width", l => l.source.id === d.id || l.target.id === d.id ? 3 : 1);
            nodeSelection
                .attr('r', n => n.id === d.id ? 15 : 10)
                //.style("stroke", n => n.id === d.id ? 'red' : 'none')
                .style("stroke-width", n => n.id === d.id ? 2 : 0);
        })
        .on('mouseout', function (event, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            div.transition()
                .duration('50')
                .style("opacity", 0);
        });

    simulation.on('tick', () => {
        linkSelection2
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        nodeSelection
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });
      // Fermo la simulazione dopo un certo numero di iterazioni
    setTimeout(() => {
        simulation.stop();
    }, 9000); 

    // Creazione della legenda
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(50, 50)'); 

    const legendData = Array.from(new Set(filteredNodes.map(d => d.type)));

     legend.selectAll('rect')
        .data(legendData)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * 40) // spaziatura verticale tra i rettangoli
        .attr('width', 40) 
        .attr('height', 40) 
        .attr('fill', d => color(d));

    legend.selectAll('text')
        .data(legendData)
        .enter()
        .append('text')
        .attr('x', 50) 
        .attr('y', (d, i) => i * 40 + 30) 
        .style('font-size', '30px') 
        .text(d => d || "non specificato");

    costruzioneBarChart(filteredLinks, linkSelection2);
    costruzioneBarChart2(filteredLinks,filteredNodes, linkSelection2, tipo1, tipo2)
}

function costruzioneBarChart2(filteredLinks, filteredNodes, linkSelection, tipo1, tipo2){

    var arrayRel=[tipo1, tipo2, "organization", "non specificato"];
    var arrayRel2={};
    arrayRel.forEach(key => {
    arrayRel2[key] = 0;
    });
    console.log(filteredLinks);
    for (var i = 0; i < filteredLinks.length; i++) {
        if(filteredLinks[i]["source"].id==="âIllegal" || filteredLinks[i]["source"].id==="âillegalâ"){
            let nodeIdToFind = filteredLinks[i]["target"];
            const foundNodes = filteredNodes.filter(node => node.id === nodeIdToFind.id);
            console.log(foundNodes);
            let tipo=foundNodes[0].type || "non specificato";
            console.log(tipo);
            arrayRel2[tipo]++;
        }
        if(filteredLinks[i]["target"].id==="âIllegal" || filteredLinks[i]["target"].id==="âillegalâ"){
            let nodeIdToFind = filteredLinks[i]["source"];
            const foundNodes = filteredNodes.filter(node => node.id === nodeIdToFind.id);
            console.log(foundNodes);
            let tipo=foundNodes[0].type || "non specificato";
            console.log(tipo);
            arrayRel2[tipo]++;
        }
    }
    var array3 = Object.keys(arrayRel2).map(key => ({
    name: key,
    value: arrayRel2[key]
    }));
    console.log(array3);
    const margin = { top: 30, right: 50, bottom: 0, left: 130 };
    const width = 600;
    const height = 600;
    d3.select(".aiuto4").selectAll("*").remove();
    const svg = d3.select(".aiuto4")
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("viewBox", '0 0 3000 3000')
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
    .domain([0, d3.max(array3, d => +d.value)])
    .range([0, width+350]);
    
    
    const y = d3.scaleBand()
    .domain(array3.map(d => d.name))
    .range([0, height])
    .padding(0.3);

    svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));

    const bars = svg.selectAll('.bar')
    .data(array3);

    bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => y(d.name))
    .attr('width', 0)
    .attr('height', y.bandwidth())
    .on('click', function (event, d) {
            console.log(d);
            highlightLinks2(d.name, linkSelection);
        })
    .transition()
    .duration(1000)
    .attr('width', d => x(+d.value))
    
    
    svg.selectAll('.x-axis text')
        .style('font-size', '6em') // dimensione desiderata per i testi dell'asse x      
        .attr('transform', 'rotate(-55)') // Ruota i numeri di 55 gradi per evitare sovrapposizioni
        .style('text-anchor', 'end');
    svg.selectAll('.y-axis text')
        .style('font-size', '6em'); 
    

    bars.transition()
    .duration(1000)
    .attr('width', d => x(+d.value));

    bars.exit().transition()
    .duration(1000)
    .attr('width', 0)
    .remove();
}

function costruzioneBarChart(filteredLinks, linkSelection){
    var arrayRel=["membership", "partnership", "ownership", "family_relationship"]
    var arrayRel2={};
    arrayRel.forEach(key => {
    arrayRel2[key] = 0;
    });
    for (var i = 0; i < filteredLinks.length; i++) {
    let tipo = filteredLinks[i]["type"];
    arrayRel2[tipo]++;
    }
    var array3 = Object.keys(arrayRel2).map(key => ({
    name: key,
    value: arrayRel2[key]
    }));

    

const margin = { top: 30, right: 50, bottom: 0, left: 180 };
    //const width = 1000 - margin.left - margin.right;
    //const height = 1000 - margin.top - margin.bottom;
    const width = 600;
    const height = 600;
    d3.select(".aiuto3").selectAll("*").remove();
    const svg = d3.select(".aiuto3")
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("viewBox", '0 0 3000 3000')
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear()
    .domain([0, d3.max(array3, d => +d.value)])
    .range([0, width+450]);
    

    const y = d3.scaleBand()
    .domain(array3.map(d => d.name))
    .range([0, height])
    .padding(0.3);

    svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));

    const bars = svg.selectAll('.bar')
    .data(array3);

    bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => y(d.name))
    .attr('width', 0)
    .attr('height', y.bandwidth())
    .on('click', function (event, d) {
            console.log(d);
            highlightLinks(d.name, linkSelection);
            resetOtherLinks(d.name, linkSelection);
        })
    .transition()
    .duration(1000)
    .attr('width', d => x(+d.value))
    
    
    svg.selectAll('.x-axis text')
        .style('font-size', '6em')      
        .attr('transform', 'rotate(-55)') 
        .style('text-anchor', 'end'); 
    svg.selectAll('.y-axis text')
        .style('font-size', '6em'); 
    

    bars.transition()
    .duration(1000)
    .attr('width', d => x(+d.value));

    bars.exit().transition()
    .duration(1000)
    .attr('width', 0)
    .remove();
}

function highlightLinks2(entity, linkSelection) {
    var i=data.links;
    console.log(linkSelection);
    linkSelection.style('stroke', d => (((d.source.id === "âIllegal" || d.source.id ==="âillegalâ") && (d.target.type===entity ||  typeof d.target.type === 'undefined')) || ((d.target.id === "âIllegal" || d.target.id ==="âillegalâ") &&  (d.source.type===entity ||  typeof d.source.type === 'undefined'))) ? "red":"#ccc")
    .style('opacity', d => {
    /*if (((d.source.id === "âIllegal" || d.source.id === "âillegalâ" ) && (d.target.type===entity ||  typeof d.target.type === 'undefined')) || ((d.target.id === "âIllegal" || d.target.id ==="âillegalâ") &&  (d.source.type===entity ||  typeof d.source.type === 'undefined'))) {
        return 1; // Opacità massima per i link selezionati
    } else {
        return 0; // Opacità ridotta per i link non selezionati
    }*/
    });
    
}

function highlightLinks(entity, linkSelection) {
    var i=data.links;
    console.log(data.links);
    linkSelection.style('stroke', d => d.type === entity ? 'red' : '#ccc');
    }
function resetOtherLinks(clickedEntity, linkSelection) {
    linkSelection.style('stroke', d => d.type === clickedEntity ? 'red' : '#ccc');
}
function graficoComplesso(nodeName1, filteredNodes1, dataBis, data2Bis, j1){
    var aa = filteredNodes1.filter(n => n.id===nodeName1);
    console.log("data.links=" + JSON.stringify(data.links));
      
    // Creare copie dei dati originali
    var originalLinks = JSON.parse(JSON.stringify(data.links));
    var originalNodes = JSON.parse(JSON.stringify(data2));
    var links4=[];
    var links3=[];
    var j=0;
    console.log(originalLinks);
    console.log(filteredNodes1);
    
    
    for (let node of filteredNodes1){
        console.log(node);
        links3 = originalLinks.filter(link => link.source===node.id || link.target===node.id);
        console.log(links3);
         // Add the link to the expanded links
         for(let link44 of links3 ){
            if(j<j1){
                j++;
                links4.push({
                    source: node.id,
                    target: link44.target === node.id ? link44.source : link44.target 
                    });
                // Identifica il nodo collegato (targetNode)
                let targetNodeId = link44.target === node.id ? link44.source : link44.target;
                let targetNode = originalNodes.find(n => n.id === targetNodeId);

                // Verifica se il targetNode non è già in filteredNodes1
                if (!filteredNodes1.some(n => n.id === targetNodeId)) {
                    filteredNodes1.push(targetNode); // Aggiungi targetNode a filteredNodes1
                }
            }
        }
    
    }

   
    console.log(links4);
    var links=links4;
    var nodes=filteredNodes1;
   
    var uniqueArr = [];
    for (var i = 0; i < nodes.length; i++) {
        uniqueArr.push(nodes[i]["id"]);
    }
    var array2 = {};
    uniqueArr.forEach(key => {
        array2[key] = 0;
    });
    for (var j = 0; j < originalLinks.length; j++) {
        let sourc = originalLinks[j].source;
        array2[sourc]++;
    }
    nodes.forEach(node => {
        node.weight = array2[node.id];
    });
    const div = d3.select("div.tooltip");
    const gethtml = (id, links) => {
        return `<div>node: ${id}</div> <div>links: ${links}</div>`;
    }
    
    
    // Regolazione del centro della forza di attrazione
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(50))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(1000 / 2, 900 / 2)); // Imposto il centro della forza di attrazione al centro del nuovo spazio di visualizzazione
d3.select(".aiuto").selectAll("*").remove();
// Modifica delle dimensioni del grafico
const svg = d3.select(".aiuto")
    .attr("viewBox", [-500, -800, 2000, 2000]);



    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const symbolScale = d3.scaleOrdinal()
        .domain(["person", "organization", "location", undefined, "vessel", "political_organization","company", "movement", "event"]) // Replace with your actual types
        .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle ,d3.symbolCross, d3.symbolStar,d3.symbolTriangle, d3.symbolWye, d3.symbolDiamond, d3.symbolDiamond]);
    // Aggiungi dei console.log per debug
    //console.log("Tipi di nodo:", nodes.map(d => d.type));
    //console.log("Simboli associati:", nodes.map(d => symbolScale(d.type)));
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(nodes)
        .join("path")
        .attr("d", d => d3.symbol().type(symbolScale(d.type)).size(Math.sqrt(d.weight) * 100+80)()) // Adjust size multiplier as needed
        .attr("fill", d => {
            if(d.id==nodeName1){
                return 'green';
            }else if (d.id==="âIllegal" || d.id === "âillegalâ"){
                return 'red';
            }
            else{
                return 'grey';
            }
        })
        .on('mouseover', function (event, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
            div.transition()
                .duration(50)
                .style("opacity", 1);
            div.html(gethtml(d.id, d.weight));
            const bbox = this.getBoundingClientRect();
            div.html(gethtml(d.id, d.weight))
                .style("left", `${bbox.x + window.scrollX + bbox.width / 2}px`)
                .style("top", `${bbox.y + window.scrollY - 58}px`);
        })
        .on('mouseout', function (event, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            div.transition()
                .duration('50')
                .style("opacity", 0);
        })
        .call(drag(simulation));

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

     // Creazione della legenda
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0, 0)'); // Posiziona la legenda

    const legendData = symbolScale.domain();

    legend.selectAll('path')
        .data(legendData)
        .enter()
        .append('path')
        .attr('d', d => d3.symbol().type(symbolScale(d)).size(200)()) // Adjust size as needed
        .attr('transform', (d, i) => `translate(0, ${i * 30})`);

    legend.selectAll('text')
        .data(legendData)
        .enter()
        .append('text')
        .attr('x', 30)
        .attr('y', (d, i) => i * 30 + 5)
        .text(d => d || "undefined")
        .style('font-size', '30px')
        .attr('alignment-baseline', 'middle');

    return svg.node();
}

function chart3(nodes, links, esamina) {
    console.log(links);
    // links = links.filter(link => link.source === esamina);
    //console.log(filteredLinks);
    var uniqueArr = [];
    for (var i = 0; i < nodes.length; i++) {
        uniqueArr.push(nodes[i]["id"]);
    }
    var array2 = {};
    uniqueArr.forEach(key => {
        array2[key] = 0;
    });
    for (var j = 0; j < links.length; j++) {
        let sourc = links[j].source;
        array2[sourc]++;
    }
    nodes.forEach(node => {
        node.weight = array2[node.id];
    });

    const div = d3.select("div.tooltip");
    const gethtml = (id, links) => {
        return `<div>node: ${id}</div> <div>links: ${links}</div>`;
    }

    




    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(400 / 2, 400 / 2));
    
   
       

    // Disegno il grafo
    d3.select(".aiuto").selectAll("*").remove();
    const svg = d3.select(".aiuto")
    .attr("viewBox", [0, 0, 400, 400]);

    /*d3.select(".aiuto").selectAll("*").remove();
    const svg = d3.select(".aiuto")
        .attr("viewBox", [0, 0, 400, 400]);*/
    
        

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const symbolScale = d3.scaleOrdinal()
        .domain(["person", "organization", "location", "undefined", "vessel", "political_organization","company", "movement", "event"]) // Replace with your actual types
        .range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle, d3.symbolCross, d3.symbolStar,d3.symbolAsterisk, d3.symbolWye, d3.symbolTimes, d3.symbolSquare2]);
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(nodes)
        .join("path")
        //.attr("d", d => d3.symbol().type(symbolScale(d.type)).size(Math.sqrt(d.weight) * 100)()) // Adjust size multiplier as needed
        .attr("d", d => d3.symbol().size(50)())
        .attr("fill", d => color(d.type))
        .on('mouseover', function (event, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
            div.transition()
                .duration(50)
                .style("opacity", 1);
            div.html(gethtml(d.id, d.weight));
            const bbox = this.getBoundingClientRect();
            div.html(gethtml(d.id, d.weight))
                .style("left", `${bbox.x + window.scrollX + bbox.width / 2}px`)
                .style("top", `${bbox.y + window.scrollY - 58}px`);
        })
        .on('mouseout', function (event, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            div.transition()
                .duration('50')
                .style("opacity", 0);
        })
        .call(drag(simulation));

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Creazione della legenda
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0, 0)'); // Posiziono la legenda

    const legendData = Array.from(new Set(nodes.map(d => d.type)));

legend.selectAll('circle')
    .data(legendData)
    .enter()
    .append('circle')
    .attr('cx', 5) // Coordinata x del centro del cerchio
    .attr('cy', (d, i) => i * 15 + 5) // Coordinata y del centro del cerchio e spaziatura verticale
    .attr('r', 3) // Raggio del cerchio
    .attr('fill', d => color(d)); // Colore del cerchio

legend.selectAll('text')
    .data(legendData)
    .enter()
    .append('text')
    .attr('x', 15) // Distanza orizzontale tra il cerchio e il testo
    .attr('y', (d, i) => i * 15 + 9) // Allineamento verticale del testo
    .style('font-size', '10px') // Dimensione del testo
    .text(d => d || "non specificato");


    return svg.node();
}




function chart(dataC) {
    const width = 1600;
    const height = 1600;
    const innerRadius = Math.min(width, height) * 0.3 - 20;
    const outerRadius = innerRadius + 20;
    const desiredOrder = ["Mar de la Vida OJSC", "Oceanfront Oasis Inc Carriers", 8327, 979893388, "Organizzation","Political organization", "Location", "Person"];
    //  dense matrix 

    // Creazione di 'names'
const names = desiredOrder.filter(name => dataC.some(d => d.source === name || d.target === name));


if (names.length === 0) {
  throw new Error("L'array 'names' è vuoto. Assicurati che 'desiredOrder' contenga i nomi presenti in 'data'.");
}

const index = new Map(names.map((name, i) => [name, i]));
const matrix = Array.from({ length: names.length }, () => new Array(names.length).fill(0));


for (const { source, target, value } of dataC) {
    console.log(source);
  if (!index.has(source) || !index.has(target)) {
    throw new Error(`Source o target non trovato in 'index': ${source}, ${target}`);
  }
  matrix[index.get(source)][index.get(target)] += value;
}

   
    const chord = d3.chordDirected()
        .padAngle(50 / innerRadius)//distanzia archi

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    const ribbon = d3.ribbonArrow()
        .radius(innerRadius - 0.5)
        .padAngle(1 / innerRadius);

    const colors = d3.schemeCategory10;

    const formatValue = x => `${x.toFixed(0)}B`;

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

    const chords = chord(matrix);

    svg.append("path")
        .attr("fill", "none")
        .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }));


    //colori personalizzati
    const customColors = ["#600000", "#b24800", "#d58400", "#f5e100", "#010351", "#9729a1", "#d4637f", "#97bfa1"];

   
    function getColor(index) {
        return customColors[index % customColors.length];
    }

    function getColor(index) {
        return customColors[index % customColors.length];
    }



svg.append("g")
    .attr("fill-opacity", 0.75)
  .selectAll("path")
  .data(chords)
  .join("path")
    .attr("d", ribbon)
    .attr("fill", d => {
        return getColor(d.target.index);
    })
    .style("mix-blend-mode", "multiply")
  .append("title")
    .text(d => `${names[d.source.index]} owes ${names[d.target.index]} ${formatValue(d.source.value)}`);
    const g = svg.append("g")
      .selectAll()
      .data(chords.groups)
      .join("g");

    g.append("path")
        .attr("d", arc)
        .attr("fill", d => {
        console.log("d.index", d.index); // Debug: Verifica d.target.index
        return getColor(d.index);
        })
        .attr("stroke", "#fff")
        .attr("id", d => `group-${d.index}`)
        .on("mouseover", function(event, d) {
            if(d.index != 4 && d.index!=5 && d.index!=6 && d.index!=7)
            d3.select(this).attr("fill", "black"); 
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", getColor(d.index));
        })
        .on("click", function(event, d) {
             nodeName = names[d.index];
      // Creare copie dei dati originali
      var originalLinks = JSON.parse(JSON.stringify(data.links));
      var originalNodes = JSON.parse(JSON.stringify(data2));

      var links3 = originalLinks.filter(link => link.source === nodeName || link.target === nodeName);
      console.log("links3=" + JSON.stringify(links3));
      console.log("links3 length=" + links3.length);
      
      // Filtrare i nodi presenti in links
       filteredNodes = originalNodes.filter(node =>
        links3.some(link => link.source === node.id || link.target === node.id)
      );
      console.log("filteredNodes=" + JSON.stringify(filteredNodes));

      // controllo sui dati
      if (links3.length > 0 && filteredNodes.length > 0) {
        chart3(filteredNodes, links3, nodeName);
      } else {
        console.error("Filtered data is empty. Check the nodeName and filtering logic.");
      }
        });

    g.append("text")
        .attr("dy", d => (d.endAngle + d.startAngle) / 2 > Math.PI ? 15 : -15) // Adjust vertical position based on the angle
        .attr("transform", d => `
            rotate(${((d.startAngle + d.endAngle) / 2) * 180 / Math.PI - 90})
            translate(${outerRadius + 10})
            ${((d.startAngle + d.endAngle) / 2) > Math.PI ? "rotate(180)" : ""}
        `)
        .attr("text-anchor", d => ((d.startAngle + d.endAngle) / 2) > Math.PI ? "end" : "start")
        .style("font-size", "35px")
        .text(d => names[d.index]);
    
    g.append("title")
        .text(d => `${names[d.index]}
  owes ${formatValue(d3.sum(matrix[d.index]))}
  is owed ${formatValue(d3.sum(matrix, row => row[d.index]))}`);
  
    return svg.node();
}


export default {
  name: 'barChart',
  components: {
    BRow,
    BFormInput,
    BCol,
    BBadge,
    BListGroupItem,
    BListGroup,
    BContainer,
    BDropdownItem,
    BDropdownDivider,
    BDropdown
  },
  data(){
    return {
      persons: [],
      timeInterval: 10,
      selectedValues:[],
      maxNodes: 250, // Valore di default per il range input
    };
  },
  mounted() {
    fetch("/static/data/MC1.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        this.persons = data;
        this.drawChart();
      })
      .catch((error) => 
        console.error("Unable to fetch data:", error)
      );
  },
  methods: {
    prove1 (item){
        this.selectedValues[0]=item;
        if(this.selectedValues.length==2){
            graficoComplesso2(nodeName, this.selectedValues[0], this.selectedValues[1])
        }
    },
    prove2 (item2){
        //passo copia di filteredNodes
        this.selectedValues[1]=item2;
        if(this.selectedValues.length==2){
            graficoComplesso2(nodeName, this.selectedValues[0], this.selectedValues[1])
        }
    },
    handleNodeRangeChange() {
        graficoComplesso(nodeName, filteredNodes, data, data2,this.maxNodes)
    },
    handleClick() {
      data = this.persons;
      data2 = data.nodes;
      console.log(nodeName);
      console.log(filteredNodes);
      var riempi=["Mar de la Vida OJSC","Oceanfront Oasis Inc Carriers", 8327, 979893388];
      for (var a of riempi){
        let targetNode2 = data2.find(n => n.id==a);
        filteredNodes.push(targetNode2);
       }
      graficoComplesso(nodeName, filteredNodes, data, data2,100);
      //prendere il node name e prendere la complessita desiderata dall'utente
      //oltre a questo devo selezionare tutti i nodi coinvolti e trovare nuovi eventuali link, alla fine stampare il grafico nuovo (volendo usando la nuova funzione chart3)
      
    },
    //forse drawchart è meglio metterla in un altro foglio js
    drawChart() {
        
       data = this.persons;
       data2 = data.nodes;
        let ii=data.links.filter(l => l.target===5007554);
      console.log(ii);
      if (!data || data.length === 0) {
        console.error('Dataset non valido o vuoto');
        return;
      }

      let arrC = [];
      for (var i = 0; i < data2.length; i++) {
        arrC[i] = data2[i]["type"] || "non specificato";
      }

      var uniqueArray = [...new Set(arrC)];
      let array2 = {};
      uniqueArray.forEach(key => {
        array2[key] = 0;
      });

      for (var i = 0; i < data2.length; i++) {
        let tipo = data2[i]["type"] || "non specificato";
        array2[tipo]++;
      }

      var array3 = Object.keys(array2).map(key => ({
        name: key,
        value: array2[key]
      }));

      const margin = { top: 10, right: 20, bottom: 40, left: 250 };
      const width = 800 - margin.left - margin.right;
      const height = 700 - margin.top - margin.bottom;

      const svg = d3.select(this.$refs.chart)
        .append('svg')
        //.attr('width', width + margin.left + margin.right)
        //.attr('height', height + margin.top + margin.bottom)
        .attr("viewBox", '0 0 1000 800')
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3.scaleLinear()
        .domain([0, d3.max(array3, d => +d.value)])
        .range([0, width+150]);
        

      const y = d3.scaleBand()
        .domain(array3.map(d => d.name))
        .range([0, height])
        .padding(0.3);

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));

      const bars = svg.selectAll('.bar')
        .data(array3);

      bars.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => y(d.name))
        .attr('width', 0)
        .attr('height', y.bandwidth())
        .transition()
        .duration(1000)
        .attr('width', d => x(+d.value));

      bars.transition()
        .duration(1000)
        .attr('width', d => x(+d.value));

      bars.exit().transition()
        .duration(1000)
        .attr('width', 0)
        .remove();
        var combinedData=drawnChart2(data2, data.links);
        console.log(combinedData);
        //document.body.append(chart(combinedData))
        this.renderChart(combinedData);
        //document.body.append(chart3(data2, data.links));
    },
    renderChart(data) {
      const chartContainer = d3.select(this.$refs.chartContainer);
      chartContainer.selectAll("*").remove(); // Rimuovi eventuali grafici precedenti
      
      const chartSvg = chart(data);
      chartContainer.node().appendChild(chartSvg);
    }
  }
};
</script>

<style scoped>
.rel{
    float:right;
}
.highlighted-link{
            stroke: red;
            stroke-width: 200px;
}
/* Stili per il bottone */
.b-button {
  margin-bottom: 20px;
color:grey;
}

.custom-container {
  float:left;
  margin-left:5%;
  padding-top:0;
  background-color: beige;
  width:45%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
::v-deep .bar:hover {
  fill: orange;
}
::v-deep .bar {
    fill:#72A9E6;
}

::v-deep .x-axis text,
::v-deep .y-axis text {
  fill: #343a40;
  font-family: Arial, sans-serif;
  font-size: 25px;
  
}

.custom-container2 {
  background-color: beige;
  float: right;
  width: 45%; /* Adatta la larghezza della colonna alla metà del contenitore */
}
.custom-container3 {
  background-color: beige;
  float: left;
  width: 100%; /* Adatta la larghezza della colonna alla metà del contenitore */
}
.custom-container6 {
  background-color: beige;
  width: 100%; /* Adatta la larghezza della colonna alla metà del contenitore */
}

svg {
  max-width: 100%; /* Assicura che il grafico all'interno della colonna si adatti alla larghezza massima della colonna */
  
}
div.tooltip {
  position: absolute;
  width:10%;
  text-align: center;
  padding: .5rem;
  background: #FFFFFF;
  color: #313639;
  border: 1px solid #313639;
  border-radius: 8px;
  pointer-events: none;
  font-size: 1.3rem;
}
.custom-container3{
    margin:5%;
}
svg.aiuto2{
    width:100%;
}

input{
    width:40%;}

.chartContainer3 {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.chartContainer6 {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.custom-container6{
    float:right;
}


.custom-container3 {
  display: flex;
  flex-direction: row; /* Dispone gli elementi in una riga */
  justify-content: space-between; /* Spazia gli elementi equamente */
  width: 100%; /* Assicura che il contenitore occupi l'intera larghezza */
}

.chartContainer6 {
  flex: 1; /* Consente agli elementi di ridimensionarsi equamente */
  margin: 10px; /* Aggiunge un po' di margine intorno agli elementi */
  display: flex; /* Necessario per far sì che il contenitore si comporti correttamente */
  justify-content: center; /* Centra il contenuto orizzontalmente */
  align-items: center; /* Centra il contenuto verticalmente */
}

svg {
  width: 100%; /* Assicura che l'SVG occupi l'intera larghezza del contenitore */
  height: 100%; /* Assicura che l'SVG occupi l'intera altezza del contenitore */
}

</style>
