/**
 * Line - a line
 */
export default class Line {
    /**
     * constructor()
     * @description constructs the vector object
     */
    constructor(startPoint, endPoint) {
        this._startPoint = startPoint;
        this._endPoint = endPoint
    }

    /**
     * getPerpendicular() 
     * @description get the vector perpendicular to this line
     * @returns a vector perpendicular to this line
     */
    getPerpendicularVector() {
        // vector
        let vector = {
            x: this._endPoint.x - this._startPoint.x,
            y: this._endPoint.y - this._startPoint.y 
        }

        let vectorLength = Math.sqrt( vector.x * vector.x + vector.y * vector.y);
        // normalized vector
        var normalizedVector = {
            x: vector.x / vectorLength,
            y: vector.y / vectorLength
        }

        return {
            x: -normalizedVector.y,
            y: normalizedVector.x
        }
    }

}