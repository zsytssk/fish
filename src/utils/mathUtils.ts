/** 向量转化为弧度 */
export function vectorToAngle(vector: SAT.Vector) {
    return Math.atan2(vector.y, vector.x);
}
/** 向量转化为角度 */
export function vectorToDegree(vector: SAT.Vector) {
    const angle = vectorToAngle(vector);
    const degree = angleToDegree(angle);
    return degree;
}
/** 角度转化为弧度 */
export function degreeToAngle(degrees) {
    return (degrees * Math.PI) / 180;
}
/** 弧度转化为角度 */
export function angleToDegree(angle) {
    return (angle * 180) / Math.PI;
}
/** 将时间秒转化为帧, 一秒 = 60帧 */
export function timeToFrame(time) {
    return Math.ceil(time * 60);
}
/** 将帧 -->秒, 一秒 = 60帧 */
export function frameToTime(frame) {
    return Math.ceil(frame / 60);
}
