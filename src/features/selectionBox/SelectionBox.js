/**
 * SelectionBox - A box to select multiple pieces
 */



export function SelectionBox({startPoint, endPoint, hidden}) {

    /** 
     * getX()
     * @description gets the x value for the selection box
     */
    function getX() {
        return (startPoint[0] < endPoint[0]) ? startPoint[0] : endPoint[0];
    }

    /** 
     * getY()
     * @description gets the y value for the selection box
     */
    function getY() {
        return (startPoint[1] < endPoint[1]) ? startPoint[1] : endPoint[1];
    }
    
    
    return (
        <rect 
            x={getX()}
            y={getY()}
            width={Math.abs(endPoint[0]-startPoint[0])}
            height={Math.abs(endPoint[1]-startPoint[1])}
            stroke="green" 
            strokeWidth={(hidden) ? 0 : 1}
            fillOpacity="0" 
            fill="none"></rect>
    )
}