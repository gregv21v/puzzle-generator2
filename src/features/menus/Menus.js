import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../modal/Modal";
import { loadPieces, selectPieces } from "../pieces/piecesSlice";
import { saveToFile } from "../util/util"
import { MenuItem } from "./MenuItem";
import styles from "./Menus.module.css"

import { downloadSvg } from "svg-crowbar"

export function Menus({canvasRef}) {
    const pieces = useSelector(selectPieces);
    const [currentMenu, setCurrentMenu] = useState("");
    const [isModalShown, setIsModalShown] = useState(false);
    const [modalType, setModalType] = useState("")
    const [filename, setFilename] = useState("untitled");
    const [fileType, setFileType] = useState("");
    const [file, setFile] = useState(null);
    const inputFile = useRef(null);
    const menus = ["File", "Edit"]
    const dispatch = useDispatch();

    const [exportClicked, setExportClicked] = useState(false)


    useEffect(() => {
        if(exportClicked) {
            downloadSvg(canvasRef.current.cloneNode(true), filename);
            setExportClicked(false);
        }
    }, [exportClicked, filename, canvasRef])

    

    /**
     * openMenu()
     * @description opens a given menu
     * @param {string} name the name of the menu to open
     */
    function openMenu(name) {
        setCurrentMenu(name)
    }

    /**
     * filenameChange() 
     * @description updates the filename when the input box is changed
     * @param {event} event the change event
     */
    function filenameChange(event) {
        setFilename(event.target.value)
    }

    /**
     * exportFile() 
     * @description exports a file
     */
    function exportFile() {
        setIsModalShown(false);

        if(fileType === ".json")
            saveToFile(filename + fileType, pieces);
        else 
            setExportClicked(true);
    }


    /**
     * importFile()
     * @description imports a file
     */
    function importFile() {
        setIsModalShown(false)

        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            dispatch(loadPieces(JSON.parse(event.target.result)))
        })

        reader.readAsText(file)
    }




    /**
     * importFile()
     * @description imports a file
     */

    /**
     * renderMenu()
     * @description renders the opened menu
     * @returns the menu to be rendered
     */
    function renderMenu() {
        switch(currentMenu) {
            case "File":
                return (
                    <div style={{flexDirection: "column"}}>
                        <MenuItem onClickHandler={() => {
                            setIsModalShown(true)
                            setModalType("export")
                            setFileType(".svg")
                        }} name="Export as SVG"></MenuItem>
                        <MenuItem onClickHandler={() => {
                            setIsModalShown(true)
                            setModalType("export")
                            setFileType(".json")
                        }} name="Export as JSON"></MenuItem>
                        <MenuItem onClickHandler={() => {
                            setIsModalShown(true)
                            setModalType("import")
                        }} name="Import as JSON"></MenuItem>
                    </div>                  
                )
            case "Edit": 
                return (
                    <div style={{ paddingLeft: "20px", paddingRight: "20px", flexDirection: "column"}}>
                        Empty
                    </div>                  
                )
            default: break;
        }
    }


    function renderModal(type) {
        switch(type) {
            case "export":
                return (
                    <Modal show={isModalShown} handleClose={() => setIsModalShown(false)}>
                        <h1>Export as {fileType}</h1>
                        <p>Do not add the file extension to the end of the filename. That will be done automatically.</p>
                        Filename: <input onChange={(event) => filenameChange(event)} type="text" value={filename}></input>
                        <button onClick={exportFile}>Export</button>
                    </Modal>
                )
            case "import": 
                return (
                    <Modal show={isModalShown} handleClose={() => setIsModalShown(false)}>
                        <h1>Select a file of type .json to import</h1>
                        <input 
                            type="file" 
                            id="file" 
                            ref={inputFile} 
                            accept=".json" 
                            onChange={event => setFile(event.target.files[0])}
                        ></input>
                        <button onClick={importFile}>Import</button>
                    </Modal>
                )
            default: break;
        }
    }

    return (
        <div>
            <div className={styles.menus}>
                {
                    menus.map(element => {
                        return (
                            <div 
                                key={element} 
                                onMouseOver={() => openMenu(element)} 
                                className={styles.menu}>
                                {element}
                            </div>
                        )
                    })
                }
            </div>
            <div
                onMouseLeave={() => openMenu("")}
                style={{
                        position: "absolute",
                        background: "white",
                        top: "25px",
                        left: (menus.indexOf(currentMenu) * 65) + "px",
                        display: (currentMenu === "") ? "none" : "block"
                }}
            >
                {renderMenu()}
            </div>
            
            {renderModal(modalType)}
            
        </div>
    )
}