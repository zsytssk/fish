#target photoshop
#include "./json2.js";

var origUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

var activeDoc = app.activeDocument;
var path_data = {};
for (var k = 0; k < activeDoc.layers.length; k++)  {
  activeDoc.activeLayer = activeDoc.layers[k];
  var activeLayer = activeDoc.layers[k];
  for (var i = 0; i < activeDoc.pathItems.length; i++) {
    var myPathItem = activeDoc.pathItems[i];
    for (var j = 0; j < myPathItem.subPathItems.length; j++) {
      var mySubPathItem = myPathItem.subPathItems[j];
      var sub_path_info = getSubPathInfo(mySubPathItem);
      path_data[activeLayer.name] = sub_path_info;
      alert(sub_path_info)
      // f.writeln('"' + activeLayer.name + '":');
      // f.writeln(JSON.stringify(sub_path_info));
      // f.writeln(',');
    }
  }
}
alert(path_data)

var filePath = (new File($.fileName)).parent.parent.parent + '/src/data/path.ts';
var f = new File(filePath);
f.encoding = 'UTF8';
f.open('w');
f.writeln('export const PATH = ');
f.writeln(JSON.stringify(path_data));
f.writeln(';');

f.close('w');
app.preferences.rulerUnits = origUnits;

function getSubPathInfo(sub_path_info) {
  var nrPoints = sub_path_info.pathPoints.length;
  var sub_path_arr = [];
  for (var k = 0; k < nrPoints; k++) {
    var sub_path_item = {};
    var myPoint = sub_path_info.pathPoints[k];
    sub_path_item.leftDirection = roundCoordinate(myPoint.leftDirection);
    sub_path_item.rightDirection = roundCoordinate(myPoint.rightDirection);
    sub_path_item.anchor = roundCoordinate(myPoint.anchor);

    sub_path_arr.push(sub_path_item);
  }
  return formatPath(sub_path_arr);
}

// 将path的数组对象 转换成二维数组形式
function formatPath(sub_path_arr) {
  var result_arr = [];
  for (var i = 0; i < sub_path_arr.length-1; i++) {
    var result_item = [];
    var cur_point = sub_path_arr[i];
    var next_point = sub_path_arr[i+1];

    result_item.push(cur_point.anchor.x, cur_point.anchor.y);
    if (cur_point.leftDirection.x != cur_point.anchor.x || cur_point.leftDirection.y != cur_point.anchor.y) {
      result_item.push(cur_point.leftDirection.x, cur_point.leftDirection.y);
    }

    if (next_point.rightDirection.x != next_point.anchor.x || next_point.rightDirection.y != next_point.anchor.y) {
      result_item.push(next_point.rightDirection.x, next_point.rightDirection.y);
    }
    result_item.push(next_point.anchor.x, next_point.anchor.y);
    result_arr.push(result_item);
  }
  return result_arr;
}

function roundCoordinate(coor_arr) {
  var result = {};
  for (var i = 0; i< coor_arr.length; i++) {
    if (i == 0) {
     result.x= Math.round(coor_arr[i]);
     continue;
    }
    result.y = Math.round(coor_arr[i]);
  }
  return result;
}