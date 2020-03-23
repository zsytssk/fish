//@include "../../extendUtils/extendUtils.js"
var doc = app.activeDocument;

var shoal = {
    bounds: {
        width: parseInt(doc.width),
        height: parseInt(doc.height),
    },
};

var result = {};
var type_name = [];
var layers = getAllLayers(doc, true);
for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var fold_name = layer.parent.name;
    var fold_index = type_name.indexOf(fold_name);
    var layer_name = parseInt(layer.name);
    var fishType = layer_name ? layer_name : '';
    if (!fishType) {
        continue;
    }

    if (fold_index === -1) {
        fold_index = type_name.push(layer.parent.name) - 1;
    }
    if (!result[fold_index]) {
        result[fold_index] = [];
    }
    var layer_bounds = getLayerBound(layer);
    var pos = {
        x: layer_bounds.x + layer_bounds.width / 2,
        y: layer_bounds.y + layer_bounds.height / 2,
    };
    result[fold_index].push({
        pos: pos,
        fishType: fishType,
    });
}

var filePath = new File($.fileName).parent.parent + '/data/shoal2.source.json';
writeFile(filePath, {
    shoalId: 'R2',
    bounds: {
        width: parseInt(doc.width),
        height: parseInt(doc.height),
    },
    fish_map: result,
});
