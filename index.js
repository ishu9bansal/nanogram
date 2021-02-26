var resolution;
var svg;
var width;
var height;
const n = 5;
const rectangle = 2;
var grid;
var col_counts;
var row_counts;
var mode = true;
var offset;
var data;
var period = 100;
var fill_fraction = 0.7;

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
			temp.push(Math.random()<fill_fraction);
		}
		grid.push(temp);
	}
	for(var i=0; i<n; i++){
		var temp = [];
		var c = grid[i][0]?1:0;
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
		var c = grid[0][j]?1:0;
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

    svg.selectAll(".row").select("text")
    .text(d => d.join(' '));
    svg.selectAll(".col").select("text")
    .text(d => d.join('\n'));
}

function guideControl(i,j,o){
	d3.selectAll("#r"+i+",#c"+j)
	.transition().duration(period)
	.style("opacity", o);
}

function guidHighlight(i,j){
	guideControl(i,j,0);
}

function guidLowlight(i,j){
	guideControl(i,j,0.5);
}

function handleMouseOver(d,i){
	d3.select(this)
	.transition().duration(period)
	.style("fill", mode?"white":"black");

	guidHighlight(d.i,d.j);
}

function handleMouseOut(d,i){
	d3.select(this)
	.transition().duration(period)
	.style("fill", "grey");

	guidLowlight(d.i,d.j);
}

function handleClick(d,i){
	d3.select(this)
    .on("mouseover", null)
    .on("mouseout", null)
    .on("click", null)
	.style("fill", grid[d.i][d.j]!=mode?"red":"grey")
	.transition().delay(period).duration(200)
	.style("fill", grid[d.i][d.j]?"white":"black");

	guidLowlight(d.i,d.j);
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

	rs = svg.selectAll(".row")
	.data(row_counts)
	.enter().append("g")
	.attr("class","row")
	.attr("transform", (d,i) => "translate(0,"+resolution*(offset+i)+")");
	rs.append("rect")
	.attr("id", (d,i) => "r"+i)
	.attr("width", resolution*rectangle)
	.attr("height", resolution)
	.attr("rx",resolution/3)
	.style("opacity", 0.5)
	.style("fill","grey")
	.style("stroke", "black");
	rs.append("text")
	.attr("id", (d,i) => "tr"+i)
	.attr("y", resolution/2)
	.attr("x", resolution*rectangle/2)
	.attr("dominant-baseline", "middle")
	.attr("text-anchor", "middle")
	.attr("fill", "black")
	.text("r");

	cs = svg.selectAll(".col")
	.data(col_counts)
	.enter().append("g")
	.attr("class","col")
	.attr("transform", (d,i) => "translate("+resolution*(offset+i)+",0)");
	cs.append("rect")
	.attr("id", (d,i) => "c"+i)
	.attr("height", resolution*rectangle)
	.attr("width", resolution)
	.attr("rx",resolution/3)
	.style("opacity", 0.5)
	.style("fill","grey")
	.style("stroke", "black");
	cs.append("text")
	.attr("id", (d,i) => "tc"+i)
	.attr("x", resolution/2)
	.attr("y", resolution*rectangle/2)
	.attr("dominant-baseline", "middle")
	.attr("text-anchor", "middle")
	.style("white-space", "pre-line")
	.attr("fill", "black")
	.text("c");

	mode = true;
	render();
	window.onkeypress = handleKeyPress;
}

init();

function handleKeyPress(e){
	if(e.key==" ")	mode = !mode;
}
