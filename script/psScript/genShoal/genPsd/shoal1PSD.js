//@include "../../extendUtils/extendUtils.js"
var doc = app.activeDocument;

var shoal = {};

var fish = [];
var layers = getAllLayers(doc, true);
for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var layer_name = parseInt(layer.name);
    var fishType = layer_name ? layer_name : '';
    if (!fishType) {
        continue;
    }
    var bound = getLayerBound(layer);
    var x = bound.x + bound.width / 2;
    var y = bound.y + bound.height / 2;
    fish.push({
        pos: {
            x: x,
            y: y,
        },
        typeId: fishType,
    });
}

var filePath = new File($.fileName).parent.parent + '/data/shoal1.source.json';
writeFile(filePath, {
    shoalId: 'R1',
    bounds: {
        width: parseInt(doc.width),
        height: parseInt(doc.height),
    },
    fish: fish,
});
