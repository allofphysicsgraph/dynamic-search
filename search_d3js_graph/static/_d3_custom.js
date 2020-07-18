
var width = 800;
var height = 800;

function unfocus() {
    node.style("opacity", 1);
    link.style("opacity", 1);
}


function init(){
    
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
    var default_url='http://localhost:5000/graph_components';
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

    d3.selectAll("line").remove();
    d3.selectAll("circle").remove();


    //var size = Object.keys(graph.links).length;
    //console.log(size);
    if (typeof(graph.links) != "undefined") {
        var link = container.append("g").attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("stroke", "#aaa")
            .attr("stroke-width", "1px"); 
    }

    console.log(graph.nodes);
    
    var node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 9)
        .attr("fill", function(d) { return color(d.group); })
        node.on("mouseover", focus).on("mouseout", unfocus);

    function fixna(x) {
            if (isFinite(x)) return x;
            return 0;
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
    function ticked() {
            node.call(updateNode);
            link.call(updateLink);
            labelLayout.alphaTarget(0.3).restart();
        }
    var graphLayout = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-3000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(50).strength(1))
        .on("tick", ticked);
    


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
  

    var labelLayout = d3.forceSimulation(label.nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink(label.links).distance(0).strength(2));

    
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
            d.fy = null;}

            node.call(
                d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
    /*
    var adjlist = [];
    graph.links.forEach(function(d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    }); 

    function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
   }


  
    );*/


    //tooltip
    //http://plnkr.co/edit/JpVkqaZ1AmFdBbOMwMup?p=preview&preview
    node.on("mouseover", function(){return tooltip.style("visibility", "visible");})
	.on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        /*

    

    

    function focus(d) {
        var index = d3.select(d3.event.target).datum().index;
        node.style("opacity", function(o) {
            return neigh(index, o.index) ? 1 : 0.1;
        });
       
        link.style("opacity", function(o) {
            return o.source.index == index || o.target.index == index ? 1 : 0.1;
        });
    }

    

    

  
    };*/
});
}



var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
        radius = Math.min(width,height)/2;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// from http://stackoverflow.com/a/4652513/16363
function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}



labels.forEach(function(d){
  var angle = d.val,
      fudgeX = (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2)  ? -20 : 5,
      fudgeY = (angle > 0 && angle < Math.PI)  ? -25 : 0,
          x = radius *  Math.cos(angle),
                y = radius *  Math.sin(angle);
  
  var posX = (width/2 + x),
      posY = (height/2 - y);
  
  svg.append("g")
      .attr("class", "tick")
      .attr("transform", "translate(" + (posX + fudgeX) + "," + (posY + fudgeY)  + ")")
      .append("text")  	
      .text(
        function(){         
           return d.label;
      }      
      );
  
  svg.append("path")
      .attr("d", "M" + width/2 + "," + height/2 + "L" + (width/2 + x) + "," + (height/2 - y))
  .style("stroke","steelblue")
  .style("stroke-width","2px");
});



setTimeout(() => {

MathJax.Hub.Config({
tex2jax: {
  inlineMath: [ ['$','$'], ["\\(","\\)"] ],
  processEscapes: true
}
});

MathJax.Hub.Register.StartupHook("End", function() {
setTimeout(() => {
      svg.selectAll('.tick').each(function(){
      var self = d3.select(this),
          g = self.select('text>span>svg');
      g.remove();
      self.append(function(){
        return g.node();
      });
    });
  }, 1);
});

MathJax.Hub.Queue(["Typeset", MathJax.Hub, svg.node()]);

}, 1);