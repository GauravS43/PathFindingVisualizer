import React from "react"
import { dijkstra_aStar, clear, find, startingNodeGraph, startingWeightGraph, randomizeWeights} from "./algorithms"
import {NodeGraphContext, WeightGraphContext} from "./graphContext"

function ClearButtons({animating, pathFound, setPathFound}){
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph = React.useContext(NodeGraphContext)[1]
    const updateWeightGraph = React.useContext(WeightGraphContext)[1]

    function clearWalls(){
        if (find(nodeGraph, -1) && !animating){
            updateNodeGraph(clear(nodeGraph, [-1]))
        }
    }

    function clearPaths(){
        if (pathFound){
            updateNodeGraph(clear(nodeGraph, [3, 4]))
            setPathFound(false)
        }
    }

    function restart(){
        if (!animating){
            updateNodeGraph(startingNodeGraph())
            updateWeightGraph(startingWeightGraph())
            setPathFound(false)
        }
    }

    return(
        <>
            <button className={find(nodeGraph, -1) ? "" : "clearButton"} onClick={clearWalls}>
                Clear Walls
            </button>
            <button className={pathFound ? "" : "clearButton"} onClick={clearPaths}>
                Clear Path
            </button>
            <button className={animating ? "clearButton" : ""} onClick={restart}>
                Restart
            </button>
        </>
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


function SidePanel({animating, setAnimating, pathFound, setPathFound}){
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph = React.useContext(NodeGraphContext)[1]
    const weightGraph = React.useContext(WeightGraphContext)[0]

    const [visiblePanel, setVisiblePanel] = React.useState(true)

    const [funcIndex, setFuncIndex] = React.useState(0)
    const funcNameArr = ["Dijkstra", "A Star"]
    const funcArr = [() => dijkstra_aStar(nodeGraph, weightGraph, setPathFound, setAnimating, false),
                     () => dijkstra_aStar(nodeGraph, weightGraph, setPathFound, setAnimating, true)]


    function findPath(){
        updateNodeGraph(clear(nodeGraph, [3, 4]))
        setTimeout(() => updateNodeGraph(funcArr[funcIndex]), 5)
    }

    return (
        <div className="panel_container" style={{transform: visiblePanel ? "translateY(0)" : "translateY(82%)"}}>
            <div className="arrows">
                <button onClick={() => setVisiblePanel(prevState => !prevState)}> 
                    {String.fromCharCode((visiblePanel ? "9660" : "9650"))}
                </button>
            </div>
            <button onClick={findPath}>Run</button>
            <h2>Current Algorithm: {funcNameArr[funcIndex]}</h2>
            <ClearButtons animating={animating} pathFound={pathFound} setPathFound={setPathFound}/>
            <AlgorithmsDropDown setFuncIndex={setFuncIndex}/>
        </div>
    )
}

function AdvancedPanel({animating, seeWeights, setSeeWeights}){
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph = React.useContext(NodeGraphContext)[1]
    const updateWeightGraph = React.useContext(WeightGraphContext)[1]
    const [visiblePanel, setVisiblePanel] = React.useState(false)

    const style = {
        transform: visiblePanel ? "translateY(0)" : "translateY(88%)",
        backgroundColor: "#2851F6",
        top: "5%",
        left: "78%"
    }

    function randomizeW(){
        if (!animating){
            updateNodeGraph(clear(nodeGraph, [3, 4]))
            updateWeightGraph(randomizeWeights())
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
            <button className={animating ? "clearButton" : ""} onClick={randomizeW}>
                Randomize Weights
            </button>
        </div>
    )
}

export {SidePanel, AdvancedPanel}