/**
 * ConstraintsPanel - a panel to modify the constraints of the selected piece
 */

import { useDispatch } from "react-redux"
import { setPieceConstraintValue, setSideConstraintsValue } from "../pieces/piecesSlice"


export function ConstraintsPanel({piece}) {
    const dispatch = useDispatch()

    /**
     * updateSides() 
     * @description updates the sides of the piece 
     * 
     */
    function updateSides() {
        let radius = piece.constraints.radius.value
        if(piece.constraints.sideLength && piece.constraints.sideLength.computed) { // if using side length
            let theta = 360 / piece.sides.length // the angle to subdivide with
            radius = piece.constraints.sideLength.value / (2 * Math.tan((theta/2) * (Math.PI / 180)))
        } 

    
        for (let index = 0; index < piece.sides.length; index++) {
            const side = piece.sides[index];

            let angle1 = (index) * (360 / piece.sides.length)
            let angle2 = (index+1) * (360 / piece.sides.length)

            dispatch(setSideConstraintsValue({
                pieceId: piece.id,
                sideId: side.id,
                constraintId: "startPoint",
                newValue:  {
                    x: piece.x + radius * Math.sin(angle1 * (Math.PI / 180)),
                    y: piece.y + radius * Math.cos(angle1 * (Math.PI / 180))
                }
            }))

            dispatch(setSideConstraintsValue({
                pieceId: piece.id,
                sideId: side.id,
                constraintId: "endPoint",
                newValue: {
                    x: piece.x + radius * Math.sin(angle2 * (Math.PI / 180)),
                    y: piece.y + radius * Math.cos(angle2 * (Math.PI / 180))
                }
            }))

            dispatch(setSideConstraintsValue({
                pieceId: piece.id,
                sideId: side.id,
                constraintId: "length",
                newValue: piece.constraints.sideLength.value
            }))
        }

    }


    /**
     * onChangeRadius()
     * @description triggered when the radius changes
     * @param {Event} event the event 
     */
    function onChangeRadius(event) {
        
        // update the sides of the piece 
        for (const side of piece.sides) {
            dispatch(setSideConstraintsValue({
                pieceId: piece.id,
                sideId: side.id,
                constraintId: side
            }))
        }
    }


    /**
     * onChangeSideLength()
     * @description triggered when the side length changes
     * @param {Event} event the event 
     */
    function onChangeSideLength(event) {

        dispatch(setPieceConstraintValue({
            pieceId: piece.id,
            constraintId: "sideLength",
            newValue: parseFloat(event.target.value)
        }))
        
        // update the sides of the piece 
        for (const side of piece.sides) {
            dispatch(setSideConstraintsValue({
                pieceId: piece.id,
                sideId: side.id,
                constraintId: "length",
                newValue: parseFloat(event.target.value)
            }))
        }

        updateSides();
    }

    /**
     * onChangeRotation()
     * @description triggered when the rotation changes
     * @param {Event} event the event 
     */
     function onChangeRotation(event) {
        /*dispatch(setPieceConstraints({
            pieceId: piece.id,
            constraints: {
                rotation: parseInt(event.target.value)
            }
        }))*/
    }

    /**
     * onChangeDrawMethod()
     * @description triggered when you switch from drawing by radius vs drawing by side length
     * @param {Event} event the event 
     */
    function onChangeDrawMethod(event) {
        console.log("Draw Method Changed");

        
        /*if(piece.useSideLength)
            dispatch(pieceUseRadius(piece.id)) 
        else 
            dispatch(pieceUseSideLength(piece.id)) */  
    }



    return (
        <div>
            <form 
                style={{
                    textAlign: "left"
                }}
            >
                <label htmlFor="radius">
                    <input 
                        type="radio" 
                        checked={!piece.useSideLength} 
                        value={"Use Radius"}
                        onChange={onChangeDrawMethod} 
                        name="useSideLength"/>
                    Radius (px): 
                    <input type="number" onChange={onChangeRadius} value={piece.constraints.radius.value}/>
                </label> <br/>

                <label htmlFor="sideLength">
                    <input 
                        type="radio" 
                        checked={piece.useSideLength} 
                        value={"Use Side Length"} 
                        onChange={onChangeDrawMethod}
                        name="useSideLength"
                    />
                    Side Length (px): 
                    <input type="number" onChange={onChangeSideLength} value={piece.constraints.sideLength.value}/>
                </label> <br/>
            </form>
            
            <label htmlFor="rotation">
                Rotation (degrees): 
                <input type="number" onChange={onChangeRotation} value={piece.constraints.rotation}/>
            </label> <br/>
        </div>
    )
}