var test = require('unit.js');

var testConfig = {yMax : 40, xMax : 10, data : [1, 2, 3, 4, 5, 6, 7, 6, 5], idata: [0, 1, 2, 3, 4, 5, 6, 7, 8], width : 500, height : 300, id : 0};

function createPlotTest(config) {
    master.init(config);
    
    test.object(master)
        .hasProperty('id')
        .hasProperty('line')
        .hasProperty('path');
    test.assert.equal(master.id, config.id);
    test.assert.equal(master.xMax, config.xMax);
    test.assert.equal(master.yMax, config.yMax);
}

function updatePlotTest(x, y, id) {
    master.tick(x, y, id);
    
    test.assert.equal(master.data[master.data.length - 1], x);
    test.assert.equal(master.idata[master.idata.length - 1], y);
}
