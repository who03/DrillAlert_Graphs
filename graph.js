/**
 * master is an object that contains all the graphing logic to create and update plots.
 * master has 2 main functions--init and tick--which creates and updates a plot respectively.
 */
master = {};

/**
 * master.init takes in a config object --> master.init(config)
 *  where config contains the information needed to create a plot
 * 
 * config example: 
 * config = {yMax : 40, 
 *           xMax : 10, 
 *           data : [1, 2, 3, 4, 5, 6, 7, 6, 5], 
 *           width : 500, 
 *           height : 300, 
 *           id : 0}
*/
master.init = function (config) {

    id = config.id;

    master[id] = {};

    yMax = config.yMax;
    xMax = config.xMax;

    master[id].xAxisMin = 0; 
    master[id].xAxisMax = yMax;
    data = config.data;
    // n = domain max for y axis
    master[id].n = yMax;
    master[id].random = d3.random.normal(xMax/2, .2);
    d3.range(master[id].n);

    master[id].data = data;
    master[id].idata = config.idata;

    if (master[id].data === undefined || master[id].idata === undefined) {
        alert('Both data and idata must be defined');
    }

    // if (data === undefined) {
    //     master[id].data = d3.range(master[id].n).map(master[id].random);
    // }

    master[id].margin = {top: 20, right: 20, bottom: 20, left: 40};
    
    master[id].width = config.width === undefined ? 500 : config.width;
    master[id].height = config.height === undefined ? 300 : config.height;

    master[id].x = d3.scale.linear()
    .domain([master[id].n - 1, 0])
    .range([0, master[id].width]);

    master[id].y = d3.scale.linear()
    .domain([xMax, 0])
    .range([master[id].height, 0]);

    master[id].line = d3.svg.line()
    .x(function(d, i) { return master[id].x(master[id].idata[i]); })
    .y(function(d, i) { return master[id].y(d); });

    // Creating the svg for the plots
    master[id].svg = d3.select("body").append("svg").attr("id", id)
    .attr("width", master[id].height + master[id].margin.left + master[id].margin.right)
    .attr("height", master[id].width + master[id].margin.top + master[id].margin.bottom)
    .append("g")
    .attr("transform", "translate(" + master[id].margin.left + "," + master[id].width + "), rotate(-90)");

    // Creating the clipPath
    master[id].svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", master[id].width)
    .attr("height", master[id].height);

    // Creating the x axis and making it pretty
    master[id].svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(-25,0)")
    .call(d3.svg.axis().scale(master[id].x).orient("top"))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "1.2em")
    .attr("transform", rotate90);

    // Creating the y axis and making it pretty
    master[id].svg.append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(master[id].y).orient("right"))
    .attr("transform", "translate("+ (master[id].width-25) +")")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.4em")
    .attr("dy", "-1.0em")
    .attr("transform", rotate90);

    // Adding the data specified in the config
    master[id].path = master[id].svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .datum(master[id].data)
    .attr("class", "line")
    .attr("d", master[id].line)
    .attr("transform", "translate(-25,0)");

}

/**
 * master.tick takes in a data point and an id referring to a created plot --> master.tick(data, id)
 */
master.tick = function (val, time, pid) {
    //master[pid].tick(val);
    
    // push a new data point onto the back
    // data.push(random());
    master[pid].data.push(val);
    master[pid].idata.push(time);
    // redraw the line, and slide it to the left
    master[pid].path
    .attr("d", master[pid].line);
    // .attr("transform", null)
    // .transition()
    // .duration(250)
    // .ease("linear")
    // .attr("transform", "translate(" + master[pid].x(-0.1) + ", 0)");
    // .each("end", tick);

    // pop the old data point off the front
    if (time >= master[pid].n) {
                // redraw the line, and slide it to the left
                master[pid].path
                .attr("d", master[id].line)
                .attr("transform", null)
                .transition()
                .duration(250)
                .ease("linear")
                //.attr("transform", "translate(" + master[pid].x(-0.1) + ", 0)");
                // .each("end", tick);
                master[pid].xAxisMin += time - master[pid].n;
                master[pid].xAxisMax += time - master[pid].n;
                
                //redraws xAxis to increase
                master[pid].svg.selectAll("g.x.axis")
                .call(d3.svg.axis().scale(
                  d3.scale.linear()
                  .domain([master[pid].xAxisMax - 1, master[pid].xAxisMin])
                  .range([0, master[pid].width]))
                .orient("top"))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "1.2em")
                .attr("transform", rotate90);

        master[pid].data.shift();
        master[pid].idata.shift();
    }
}

/**
 *  Helper function used to help rotate certain elements 90 degrees
 */
function rotate90(d) {
    return "rotate(90)";
}
