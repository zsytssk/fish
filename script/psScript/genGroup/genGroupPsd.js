//@include "../extendUtils/extendUtils.js"
var doc = app.activeDocument;

/** 提取鱼组psd的脚本 */

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
        result[fold_index] = {
            fish: [],
        };
    }
    var fish_data = genFishData(layer);
    if (fish_data) {
        result[fold_index].fish.push(fish_data);
    } else if (layer.name == 'pos') {
        var posInfo = genPosData(layer);
        if (posInfo) {
            result[fold_index].pos = posInfo;
        }
    } else {
        var shape = genShapeData(layer);
        if (shape) {
            result[fold_index].shape = shape;
        }
    }
}
var filePath = new File($.fileName).parent + '/group.origin.json';
writeFile(filePath, result);

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

function genPosData(layer) {
    var layer_name = layer.name;
    if (layer_name != 'pos') {
        return;
    }
    var layer_bounds = getLayerBound(layer);
    var pos = {
        x: layer_bounds.x + layer_bounds.width / 2,
        y: layer_bounds.y + layer_bounds.height / 2,
    };
    return pos;
}

function genShapeData(layer) {
    var layer_name = layer.name;
    if (layer_name != 'shape') {
        return;
    }
    var layer_bounds = getLayerBound(layer);
    var shape = layer_bounds;
    return shape;
}
