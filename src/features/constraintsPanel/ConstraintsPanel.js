/**
 * ConstraintsPanel - a panel to modify the constraints of the selected piece
 */

import { useDispatch } from "react-redux"
import { pieceUseRadius, pieceUseSideLength, setPieceConstraints } from "../pieces/piecesSlice"


export function ConstraintsPanel({piece}) {
    const dispatch = useDispatch()

    /**
     * onChangeRadius()
     * @description triggered when the radius changes
     * @param {Event} event the event 
     */
    function onChangeRadius(event) {
        
        dispatch(setPieceConstraints({
            pieceId: piece.id,
            constraints: {
                radius: parseInt(event.target.value)
            }
        }))

        dispatch(pieceUseRadius(piece.id))

        console.log(piece)

        console.log("On Change Radius")
    }

    /**
     * onChangeSideLength()
     * @description triggered when the side length changes
     * @param {Event} event the event 
     */
    function onChangeSideLength(event) {
        
        dispatch(setPieceConstraints({
            pieceId: piece.id,
            constraints: {
                sideLength: parseInt(event.target.value)
            }
        }))

        dispatch(pieceUseSideLength(piece.id))

        console.log(piece)

        console.log("On Change Side Length")
    }

    /**
     * onChangeRotation()
     * @description triggered when the rotation changes
     * @param {Event} event the event 
     */
     function onChangeRotation(event) {
        dispatch(setPieceConstraints({
            pieceId: piece.id,
            constraints: {
                rotation: parseInt(event.target.value)
            }
        }))
    }

    /**
     * onChangeDrawMethod()
     * @description triggered when you switch from drawing by radius vs drawing by side length
     * @param {Event} event the event 
     */
    function onChangeDrawMethod(event) {
        console.log("Draw Method Changed");

        
        if(piece.useSideLength)
            dispatch(pieceUseRadius(piece.id)) 
        else 
            dispatch(pieceUseSideLength(piece.id))   
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
                    <input type="number" onChange={onChangeRadius} value={piece.constraints.radius}/>
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
                    <input type="number" onChange={onChangeSideLength} value={piece.constraints.sideLength}/>
                </label> <br/>
            </form>
            
            <label htmlFor="rotation">
                Rotation (degrees): 
                <input type="number" onChange={onChangeRotation} value={piece.constraints.rotation}/>
            </label> <br/>
        </div>
    )
}