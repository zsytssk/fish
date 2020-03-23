//@include "../../extendUtils/extendUtils.js"
var doc = app.activeDocument;

var shoal = {
    bounds: {
        width: parseInt(doc.width),
        height: parseInt(doc.height),
    },
};

var result = {};
var path_data = {};
var type_name = [];
var layers = getAllLayers(doc, true);
for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var fold_name = layer.parent.name;
    var fold_index = type_name.indexOf(fold_name);

    if (fold_index === -1) {
        fold_index = type_name.push(layer.parent.name) - 1;
    }
    if (!result[fold_index]) {
        result[fold_index] = [];
    }
    var fish_data = genFishData(layer);
    // alert(pathInfo);
    if (fish_data) {
        fish_data = genFishData(layer);
        result[fold_index].push(fish_data);
    } else {
        var pathInfo = genPathInfo(doc, layer);
        if (pathInfo) {
            // alert(fold_index);
            // alert(JSON.stringify(pathInfo));
            path_data[fold_index] = pathInfo;
        }
    }
}
alert(path_data);
var filePath = new File($.fileName).parent.parent + '/data/shoal2.source.json';
writeFile(filePath, {
    shoalId: 'R2',
    bounds: {
        width: parseInt(doc.width),
        height: parseInt(doc.height),
    },
    path: path_data,
    fish_map: result,
});

function genFishData(layer) {
    var layer_name = parseInt(layer.name);
    var fishType = layer_name ? layer_name : '';
    if (!fishType) {
        return;
    }
    var layer_bounds = getLayerBound(layer);
    var pos = {
        x: layer_bounds.x + layer_bounds.width / 2,
        y: layer_bounds.y + layer_bounds.height / 2,
    };
    return {
        pos: pos,
        fishType: fishType,
    };
}
