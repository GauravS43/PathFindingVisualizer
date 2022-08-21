import React from "react"
import {clear, find, startingNodeGraph, startingWeightGraph, randomizeWeights} from "./algorithms"
import {NodeGraphContext, WeightGraphContext} from "./graphContext"

function ClearButtons({animating, pathFound, setPathFound}){
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph= React.useContext(NodeGraphContext)[1]
    const manipulateNodeGraph = React.useContext(NodeGraphContext)[2]
    const updateWeightGraph = React.useContext(WeightGraphContext)[1]

    function clearWalls(){
        if (find(nodeGraph, -1) && !animating){
            manipulateNodeGraph(clear(nodeGraph, [-1]))
        }
    }

    function clearPaths(){
        if (pathFound){
            setPathFound(false)
            updateNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
        }
    }

    function restart(){
        if (!animating){
            setPathFound(false)
            updateNodeGraph(startingNodeGraph())
            updateWeightGraph(startingWeightGraph())
        }
    }

    return(
        <div>
            <button className={find(nodeGraph, -1) ? "" : "clear_button"} onClick={clearWalls}>
                Clear Walls
            </button>
            <button className={pathFound ? "" : "clear_button"} onClick={clearPaths}>
                Clear Path
            </button>
            <button className={animating ? "clear_button" : ""} onClick={restart}>
                Restart
            </button>
        </div>
    )
}

function AlgorithmsDropDown({setFuncIndex}){
    const [algorithmsClicked, setAlgorithmsClicked] = React.useState(false)

    function changeAlgorithm(ind){
        setFuncIndex(ind)
        setAlgorithmsClicked(false)
    }

    return(
        <div className="dropdown">
            <button onClick={() => setAlgorithmsClicked(prevState => !prevState)}>
                Algorithms &#8964;
            </button>
            <div className="dropdown_content" style={{display: algorithmsClicked ? "" : "none"}}> 
                <h3 onClick={() => changeAlgorithm(0)}>Dijkstra</h3>
                <h3 onClick={() => changeAlgorithm(1)}>A Star</h3>

            </div>
        </div>
    )
}


function SidePanel({findPath, funcIndex, setFuncIndex, animating, pathFound, setPathFound}){
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph= React.useContext(NodeGraphContext)[1]

    const [visiblePanel, setVisiblePanel] = React.useState(true)
    const funcNameArr = ["Dijkstra", "A Star"]

    function findP(){
        updateNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
        setTimeout(() => findPath(true), 1)
    }

    return (
        <div className="panel_container" style={{transform: visiblePanel ? "translateY(0)" : "translateY(100%)"}}>
            <div className="arrows">
                <button onClick={() => setVisiblePanel(prevState => !prevState)}> 
                    {String.fromCharCode((visiblePanel ? "9660" : "9650"))}
                </button>
            </div>
            <button className="first_button" onClick={findP}>Run</button>
            <h2>Current Algorithm: {funcNameArr[funcIndex]}</h2>
            <AlgorithmsDropDown setFuncIndex={setFuncIndex}/>
            <ClearButtons animating={animating} pathFound={pathFound} setPathFound={setPathFound}/>
        </div>
    )
}

function AdvancedPanel({animating, seeWeights, setSeeWeights}){
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph = React.useContext(NodeGraphContext)[1]
    const updateWeightGraph = React.useContext(WeightGraphContext)[1]
    const [visiblePanel, setVisiblePanel] = React.useState(false)

    const style = {
        transform: visiblePanel ? "translateY(0)" : "translateY(108%)",
        backgroundColor: "#2851F6",
        left: "78%"
    }

    function randomizeW(){
        if (!animating){
            updateWeightGraph(randomizeWeights())
            updateNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
        }
    }

    return (
        <div className="panel_container" style={style}>
            <div className="arrows">
                <button id="up" onClick={() => setVisiblePanel(prevState => !prevState)}> 
                    {String.fromCharCode((visiblePanel ? "9660" : "9650"))}
                </button>
            </div>

            <h1>Advanced</h1>
            <button onClick={() => setSeeWeights(prevState => !prevState)}>
                {seeWeights ? "Hide Weights" : "View Weights"}
            </button>
            <button className={animating ? "clear_button" : ""} onClick={randomizeW}>
                Randomize Weights
            </button>

        </div>
    )
}

export {SidePanel, AdvancedPanel}