
var masterCompass = {};

masterCompass.init = function () {
    masterCompass.dataset = masterCompass.dataset === undefined ? {
        "1":[0],
        "2":[0],
        "3":[0],
        "4":[0],
        "5":[0],
    } : masterCompass.dataset;
    masterCompass.color = d3.scale.category20();
    
    masterCompass.size = screen.width >= screen.height ? 
            screen.height * window.devicePixelRatio : 
            screen.width * window.devicePixelRatio;
    masterCompass.cwidth = masterCompass.size/6 - masterCompass.size/10;
    masterCompass.middleCircle = masterCompass.size/10;
    masterCompass.border = 1;

    masterCompass.arc = d3.svg.arc();

    masterCompass.pie = d3.layout.pie()
        .sort(null);

    masterCompass.svg = d3.select("body").append("svg")
        .attr("width", masterCompass.size)
        .attr("height", masterCompass.size)
        .append("g")
        .attr("transform", "translate(" + masterCompass.size / 2 + "," + masterCompass.size / 2 + ")");

    masterCompass.gs = masterCompass.svg.selectAll("g").data(d3.values(masterCompass.dataset)).enter().append("g");
    masterCompass.path = masterCompass.gs.selectAll("path")
        .data(function(d) { return masterCompass.pie(d); })
        .enter().append("path")
        .attr("fill", function(d, i) { return masterCompass.color(i); })
        .attr("d", function(d, i, j) {
            if(d.value===0)
                return masterCompass.arc.startAngle(0)
                    .endAngle(deg2rad(360))
                    .innerRadius(masterCompass.middleCircle+masterCompass.border+masterCompass.cwidth*(5-j))
                    .outerRadius(masterCompass.middleCircle+masterCompass.cwidth*(5-j+1))(d);
            else
                return masterCompass.arc.startAngle(deg2rad(d.value+(1/(j+1))))
                    .endAngle(deg2rad(d.value+(1/(j+1))+359))
                    .innerRadius(masterCompass.middleCircle+masterCompass.border+masterCompass.cwidth*(5-j))
                    .outerRadius(masterCompass.middleCircle+masterCompass.cwidth*(5-j+1))(d); 
            });
}

masterCompass.update = function(val) {
    // Updating the data 
    for (i=5;i>1;i--) {
        masterCompass.dataset[i] = masterCompass.dataset[i-1];
    }
    // val cannot be 0 because 0 is a data-less ring
    if (val===0)
        masterCompass.dataset["1"] = [360];
    else
        masterCompass.dataset["1"] = [val];
    
    // Redraw the compass with the new data
    masterCompass.svg.selectAll("g").data(d3.values(masterCompass.dataset));
    masterCompass.gs.selectAll("path")
        .data(function(d) { return masterCompass.pie(d); })
        .attr("d", function(d, i, j) { 
            if(d.value===0)
                return masterCompass.arc.startAngle(0)
                    .endAngle(deg2rad(360))
                    .innerRadius(masterCompass.middleCircle+masterCompass.border+masterCompass.cwidth*(5-j))
                    .outerRadius(masterCompass.middleCircle+masterCompass.cwidth*(5-j+1))(d);
            else
                return masterCompass.arc.startAngle(deg2rad(d.value+(1/(j+1))))
                    .endAngle(deg2rad(d.value+(1/(j+1))+359))
                    .innerRadius(masterCompass.middleCircle+masterCompass.border+masterCompass.cwidth*(5-j))
                    .outerRadius(masterCompass.middleCircle+masterCompass.cwidth*(5-j+1))(d); 
            });
}

function deg2rad(deg) {
    return deg * Math.PI / 180;
}
