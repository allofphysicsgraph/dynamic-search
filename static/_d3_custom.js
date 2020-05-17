
var default_url='http://localhost:5000/graph_components';


function unfocus() {
    node.style("opacity", 1);
    link.style("opacity", 1);
}


function init(){
    var width = 800;
    var height = 800;
    var border = 1;
    var bordercolor='black';
    var color = d3.scaleOrdinal(d3.schemeCategory10); 

    var svg = d3.select("#viz").attr("width", width).attr("height", height);
    var container = svg.append("g");
        svg.call(
            d3.zoom()
                .scaleExtent([.1, 4])
                .on("zoom", function() { container.attr("transform", d3.event.transform); })
        );

    var borderPath = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", height)
        .attr("width", width)
        .style("stroke", bordercolor)
        .style("fill", "none")
        .style("stroke-width", border);
    return container;

}

function draw_graph(url){
    var color = d3.scaleOrdinal(d3.schemeCategory10); 
    var container = init();
    
    var search_string = document.getElementById('search_string').value;
        if (search_string.length > 0){
            url = 'http://localhost:5000/ajax-' + search_string;
        }
        else    {
            url = default_url;
        }
    
        var p = d3.json(url).then(function(graph){
                return graph;
            });
       
    var p_resolve = Promise.resolve(p);
    p_resolve.then(function(graph){
            var label = {
            'nodes': [],
            'links': []
        };

    var link = container.append("g").attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke", "#aaa")
        .attr("stroke-width", "1px"); 
        
    var node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.group); })
        node.on("mouseover", focus).on("mouseout", unfocus);

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");
    
    graph.nodes.forEach(function(d, i) {
        label.nodes.push({node: d});
        label.nodes.push({node: d});
        label.links.push({
            source: i * 2,
            target: i * 2 + 1
        })
    });
  

    /*var labelLayout = d3.forceSimulation(label.nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink(label.links).distance(0).strength(2));

    var graphLayout = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-3000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(50).strength(1))
        .on("tick", ticked);*/

    var adjlist = [];
    graph.links.forEach(function(d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    }); 

    function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
   }

/*
    node.call(
        d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );*/


    //tooltip
    //http://plnkr.co/edit/JpVkqaZ1AmFdBbOMwMup?p=preview&preview
    node.on("mouseover", function(){return tooltip.style("visibility", "visible");})
	.on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        /*

    function ticked() {
        node.call(updateNode);
        link.call(updateLink);
        labelLayout.alphaTarget(0.3).restart();
    }

    function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
    }

    function focus(d) {
        var index = d3.select(d3.event.target).datum().index;
        node.style("opacity", function(o) {
            return neigh(index, o.index) ? 1 : 0.1;
        });
       
        link.style("opacity", function(o) {
            return o.source.index == index || o.target.index == index ? 1 : 0.1;
        });
    }

    

    function updateLink(link) {
        link.attr("x1", function(d) { return fixna(d.source.x); })
            .attr("y1", function(d) { return fixna(d.source.y); })
            .attr("x2", function(d) { return fixna(d.target.x); })
            .attr("y2", function(d) { return fixna(d.target.y); });
    }

    function updateNode(node) {
        node.attr("transform", function(d) {
            return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) graphLayout.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };*/
});
}





