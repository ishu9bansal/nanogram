var resolution;
var svg;
var width;
var height;
const n = 20;
const rectangle = 2;
var grid;
var col_counts;
var row_counts;
var mode = 1;
var offset;
var data;

function shuffle(array){
	var i = array.length;
	var t, r;
	while(0!=i){
		r = Math.floor(Math.random()*i--);
		t = array[i];
		array[i] = array[r];
		array[r] = t;
	}
	return array;
}

function populateData(){
	data = [];
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			data.push({
				i: i,
				j: j
			});
		}
	}
}

function reset(){
	shuffle(data);
	grid = [];
	col_counts = [];
	row_counts = [];
	for(var i=0; i<n; i++){
		var temp = [];
		for(var j=0; j<n; j++){
			temp.push(Math.floor(2*Math.random()));
		}
		grid.push(temp);
	}
	for(var i=0; i<n; i++){
		var temp = [];
		var c = grid[i][0];
		for(var j=1; j<n; j++){
			if(grid[i][j]){
				c++;
			}
			else if(grid[i][j-1]){
				temp.push(c);
				c = 0;
			}
		}
		if(c)	temp.push(c);
		row_counts.push(temp);
	}
	for(var j=0; j<n; j++){
		var temp = [];
		var c = grid[0][j];
		for(var i=1; i<n; i++){
			if(grid[i][j]){
				c++;
			}
			else if(grid[i-1][j]){
				temp.push(c);
				c = 0;
			}
		}
		if(c)	temp.push(c);
		col_counts.push(temp);
	}
}

function render(){
	svg.selectAll(".square")
	.transition().duration(250)
    .attr("x", d => resolution*(offset+d.j))
    .attr("y", d => resolution*(offset+d.i))
    .on("start", function() {
        d3.select(this)
        .on("mouseover", null)
        .on("mouseout", null)
        .on("click", null);
    })
    .on("end", function() {
        d3.select(this)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick);
    });
}

function handleMouseOver(d,i){
	var period = 100;
	d3.select(this)
	.transition().duration(period)
	.style("fill", mode?"white":"black");

	d3.selectAll("#r"+d.i+",#c"+d.j)
	.transition().duration(period)
	.style("opacity", 0.5);
}

function handleMouseOut(d,i){
	var period = 100;
	d3.select(this)
	.transition().duration(period)
	.style("fill", "grey");

	d3.selectAll("#r"+d.i+",#c"+d.j)
	.transition().duration(period)
	.style("opacity", 1);
}

function handleClick(d,i){
	d3.select(this)
    .on("mouseover", null)
    .on("mouseout", null)
    .on("click", null)
    .transition().duration(200)
	.style("fill", grid[d.i][d.j]==mode?(grid[d.i][d.j]?"black":"white"):"red")
	.transition().duration(500)
	.style("fill", grid[d.i][d.j]?"white":"black");
}


function init(){
	var dim = n+2*rectangle+1;
	offset = rectangle + 1;
	width = window.innerWidth;
	height = window.innerHeight;
	resolution = Math.floor(Math.min(width/dim,height/dim));
	svg = d3.select("svg").attr("width", resolution*dim).attr("height", resolution*dim);

	populateData();

	svg.selectAll(".square").data(data)
	.enter().append("rect")
	.attr("class","square")
	.attr("width", resolution)
	.attr("height", resolution)
	.attr("x", function(d) {
		return resolution*(offset+Math.floor(Math.random()*n));
	})
	.attr("y", function(d) {
		return resolution*(offset+Math.floor(Math.random()*n));
	})
	.style("stroke", "black")
	.style("fill","grey");

	reset();

	svg.selectAll(".row")
	.data(row_counts)
	.enter().append("rect")
	.attr("class","row")
	.attr("id",function(d,i) {
		return "r"+i;
	})
	.attr("width", resolution*rectangle)
	.attr("height", resolution)
	.attr("x", 0)
	.attr("y", function(d,i) {
		return resolution*(offset+i);
	})
	.style("fill","grey")
	.style("stroke", "black");

	svg.selectAll(".col")
	.data(row_counts)
	.enter().append("rect")
	.attr("class","col")
	.attr("id",function(d,i) {
		return "c"+i;
	})
	.attr("width", resolution)
	.attr("height", resolution*rectangle)
	.attr("x", function(d,i) {
		return resolution*(offset+i);
	})
	.attr("y", 0)
	.style("fill","grey")
	.style("stroke", "black");

	mode = 1;
	render();
	window.onkeypress = handleKeyPress;
}

init();

function handleKeyPress(e){
	if(e.key==" ")	mode = 1-mode;
}
