//@include "../extendUtils/extendUtils.js"
//@include "../extendUtils/json2.js"

var origUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

var doc = app.activeDocument;
var path_data = {};
var layers = getAllLayers(doc, true);
for (var k = 0; k < layers.length; k++) {
    var layerName = layers[k].name;
    var pathInfo = genPathInfo(doc, layers[k]);
    if (!pathInfo) {
        continue;
    }
    path_data[layerName] = pathInfo;
}

var filePath =
    new File($.fileName).parent.parent.parent.parent + '/src/data/path.ts';
var f = new File(filePath);
var path_str =
    'export const PATH : {[key: string]: number[][];}= ' +
    JSON.stringify(path_data) +
    ';';
writeFile(filePath, path_str);
