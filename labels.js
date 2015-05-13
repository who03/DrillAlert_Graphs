

/*
config example

config = {
        id: 0,
        name: "TestParam",
        value: 50.5,
        nameList: ["testVal1", "testVal2", "testVal3"],
        valueList: [100, 200, 300]
}
*/
var masterLabel = {};

function nameValueString(name, value) {
        return '<div style="width: 350px;">' + name + ': ' + value + '</div>';
}

masterLabel.init = function initLabel(config) {

        var id = config.id;
        masterLabel[id] = {};
        masterLabel[id].name = config.name;
        masterLabel[id].value = config.value;
        masterLabel[id].nameList = config.nameList;
        masterLabel[id].valueList = config.valueList;

        body = d3.select('body')

        svg = body.append('svg')
                .attr('height', 200)
                .attr('width', 200);
        masterLabel[id].g = svg.append('g').attr("transform" ,"scale(0)");
        masterLabel[id].rect = masterLabel[id].g.append('rect')
                .attr('width', 150)
                .attr('height', 100)
                .attr('x', 40)
                .attr('y', 100)
                .style('fill', 'none')
                .attr('stroke', 'black')
        masterLabel[id].body = masterLabel[id].g.append('foreignObject')
                .attr('x', 50)
                .attr('y', 130)
                .attr('width', 150)
                .attr('height', 100)
                .append("xhtml:body");
        masterLabel[id].text = masterLabel[id].body
                .html(nameValueString(config.name, config.value))

        masterLabel[id].g.transition().duration(500).attr("transform" ,"scale(1)");
}

masterLabel.addDiv = function(id) {
    var config = masterLabel[id];        
    masterLabel[id].body.append('div')
        .html(nameValueString(config.name, config.value));
}

masterLabel.update = function(val, id) {
    var config = masterLabel[id];
    masterLabel[id].text.html(nameValueString(config.name, val));
}
