//@include "../../extendUtils/extendUtils.js"
var activeDoc = app.activeDocument;

var shoal = {
    bounds: {
        width: parseInt(activeDoc.width),
        height: parseInt(activeDoc.height),
    },
};

var fish = [];
var layers = getAllLayers(activeDoc, true);
var filePath = new File($.fileName).parent.parent + '/data/shoal1.source.json';
for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    if (layer.name === 'ttt') {
        alert(layer.visible);
    }
    var layer_name = parseInt(layer.name);
    var fishType = layer_name ? layer_name : '';
    if (!fishType) {
        continue;
    }
    var bound = getLayerBound(layer);
    var x = bound.x + bound.width / 2;
    var y = bound.y + bound.height / 2;
    fish.push({
        startPos: {
            x: x,
            y: y,
        },
        typeId: fishType,
    });
}

shoal.fish = fish;
writeFile(filePath, shoal);
