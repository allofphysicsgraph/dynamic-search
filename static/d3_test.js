
var width = 600;
var height = 400;
var border = 1;
var bordercolor='black';
var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("http://localhost:5000/graph_components").then(function(graph) {
    
var label = {
    'nodes': [],
    'links': []
};
console.log(graph);

});