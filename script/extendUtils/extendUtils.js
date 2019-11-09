//@include "./json2.js"

/** 获得没有子类的图层 */
function getAllLayers(doc, is_visible) {
    var result = [];
    for (var k = 0; k < doc.layers.length; k++) {
        var activeLayer = doc.layers[k];
        if (is_visible) {
            if (!activeLayer.visible) {
                continue;
            }
        }
        if (!activeLayer.layers || !activeLayer.layers.length) {
            result.push(activeLayer);
        } else {
            result = result.concat(getAllLayers(activeLayer, is_visible));
        }
    }
    return result;
}

function writeFile(path, content) {
    var f = new File(path);
    f.encoding = 'UTF8';
    f.open('w');

    f.writeln(JSON.stringify(content));
    f.close('w');
}

function getLayerBound(layer) {
    var bounds = layer.bounds;
    var x1 = parseInt(bounds[0]);
    var y1 = parseInt(bounds[1]);
    var x2 = parseInt(bounds[2]);
    var y2 = parseInt(bounds[3]);

    return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
    };
}
