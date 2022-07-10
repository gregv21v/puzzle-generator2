/**
 * SelectionBox - A box to select multiple pieces
 */



export function SelectionBox({startPoint, endPoint, hidden}) {
    
    
    return (
        <rect 
            x={startPoint[0]}
            y={startPoint[1]}
            width={Math.abs(endPoint[0]-startPoint[0])}
            height={Math.abs(endPoint[1]-startPoint[1])}
            stroke="green" 
            strokeWidth={(hidden) ? 0 : 1}
            fillOpacity="0" 
            fill="none"></rect>
    )
}