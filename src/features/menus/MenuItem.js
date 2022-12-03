import { useState } from "react"

/**
 * MenuItem - the main component of a dropdown menu
 */
export function MenuItem({name, onClickHandler}) {
    const [isHighlighted, setIsHightlighted] = useState(false)

    /**
     * mouseEnter()
     * @description highlights the menu item when the mouse enters
     */
    function mouseEnter() {
        setIsHightlighted(true);
    }

    /**
     * mouseEnter()
     * @description unhighlights the menu item when the mouse leaves
     */
    function mouseLeave() {
        setIsHightlighted(false);
    }


    return (
        <div
            style={{
                paddingRight: "20px",
                paddingLeft: "20px",
                background: (isHighlighted) ? "darkgrey" : "grey"
            }} 
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            onClick={onClickHandler}
        >
            {name}
        </div>
    )


}