import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import { dijkstra_aStar, clear, find, startingNodeGraph, startingWeightGraph, randomizeWeights} from "./algorithms"
//TODO
//Add more algorithms 
//Change Animations and timing for graph being filled in
//Add mazes and maze algorithms
//Add additional goals
//Add more interactivity after pathfound

const NodeGraphContext = React.createContext()
const UpdateGraphContext = React.createContext()

//BREAK THIS DOWN INTO COMPONENTS
function SidePanel({weightGraph, updateWeightGraph}){
    const nodeGraph = React.useContext(NodeGraphContext)
    const updateNodeGraph = React.useContext(UpdateGraphContext)

    const [visiblePanel, setVisiblePanel] = React.useState(true)
    const [algorithmsClicked, setAlgorithmsClicked] = React.useState(false)
    const [funcIndex, setFuncIndex] = React.useState(0)
   
    const funcNameArr = ["Dijkstra", "A Star"]
    const funcArr = [() => dijkstra_aStar(find(nodeGraph, 1), find(nodeGraph, 2), nodeGraph, weightGraph, updatePathFound, updateSearching, false),
                     () => dijkstra_aStar(find(nodeGraph, 1), find(nodeGraph, 2), nodeGraph, weightGraph, updatePathFound, updateSearching, true)]

    const panelStyle = {
        transform: visiblePanel ? "translateY(0)" : "translateY(82%)",
        backgroundColor: "#FA5A00",
        top: "5%",
        left: "2%"
    }

    const dropDownStyle = {
        display: algorithmsClicked ? "" : "none"
    }

    function changeAlgorithm(ref){
        setFuncIndex(ref)
        setAlgorithmsClicked(false)
    }

    const clearWallClass = find(nodeGraph, -1) ? "" : "clearButton"
    function clearWalls(){
        if (find(nodeGraph, -1)){
            updateNodeGraph(clear(nodeGraph, [-1]))
        }
    }

    const [pathFound, setPathFound] = React.useState(false)
    function updatePathFound(state){
        setPathFound(state)
    }

    const clearPathClass = pathFound ? "" : "clearButton"
    function clearPaths(){
        if (pathFound){
            updateNodeGraph(clear(nodeGraph, [3, 4]))
            updatePathFound(false)
        }
    }

    const [searching, setSearching] = React.useState(false)
    function updateSearching(){
        setSearching(prevState => !prevState)
    }

    const restartClass = searching ? "clearButton" : ""
    function restart(){
        if (!searching){
            updateNodeGraph(startingNodeGraph())
            updateWeightGraph(startingWeightGraph())
            updatePathFound(false)
        }
    }

    return (
        <div className="panel_container" style={panelStyle}>
            <div className="arrows">
                <button onClick={() => setVisiblePanel(prevState => !prevState)}> 
                    {String.fromCharCode((visiblePanel ? "9660" : "9650"))}
                </button>
            </div>

            <button onClick={() => updateNodeGraph(funcArr[funcIndex])}>Run</button>
            <h2>Current Algorithm: {funcNameArr[funcIndex]}</h2>

            <button className={clearWallClass} onClick={clearWalls}>
                Clear Walls
            </button>
            <button className={clearPathClass} onClick={clearPaths}>
                Clear Path
            </button>
            <button className={restartClass} onClick={restart}>
                Restart
            </button>
            
            <div className="dropdown">
                <button onClick={() => setAlgorithmsClicked(prevState => !prevState)}>
                    Algorithms &#8964;
                </button>
                <div className="dropdown_content" style={dropDownStyle}> 
                    <h3 onClick={() => changeAlgorithm(0)}>Dijkstra</h3>
                    <h3 onClick={() => changeAlgorithm(1)}>A Star</h3>
                </div>
            </div>
        </div>
    )
}

function AdvancedPanel({updateWeightGraph, seeWeights, setSeeWeights}){
    const [visiblePanel, setVisiblePanel] = React.useState(false)

    const style = {
        transform: visiblePanel ? "translateY(0)" : "translateY(88%)",
        backgroundColor: "#2851F6",
        top: "5%",
        left: "78%"
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
            <button onClick={() => updateWeightGraph(randomizeWeights())}>
                Randomize Weights
            </button>
        </div>
    )
}

function Node({x, y, reservedState, setReservedState, mouseState, weightGraph, seeWeights}){
    const nodeGraph = React.useContext(NodeGraphContext)
    const updateNodeGraph = React.useContext(UpdateGraphContext)

    let weight = weightGraph[y][x]
    let state = nodeGraph[y][x]
    let symbol = ["", "", "A", "B", "", ""][state + 1]
    let color = ["#96ADE9", "white", "#19D719", "#F02D7D", "", ""][state + 1]

    function handleEnter(){
        if (mouseState && (nodeGraph[y][x] < 1 | nodeGraph[y][x] > 2)){
            updateNodeGraph(prevState => {prevState[y][x] = reservedState; return prevState})
        }
    }

    function handleLeave(){
        if (mouseState && reservedState > 0){
            updateNodeGraph(prevState => {prevState[y][x] = 0; return prevState})
        }
    }

    function handleDown(){
        if (state === 1 || state === 2 ){
            setReservedState(state)
        }
        else if (state === -1){
            updateNodeGraph(prevState => {prevState[y][x] = 0 ; return prevState})
        }
        else{
            updateNodeGraph(prevState => {prevState[y][x] = reservedState; return prevState})
        }
    }

    return(
        <div 
            className="block" 
            onMouseEnter= {handleEnter}
            onMouseLeave= {handleLeave}
            onMouseDown={handleDown}
            key={[x, y]} 
            id={[x, y]}
            style={{backgroundColor: color}}
        >
            <h2 className="symbol">{symbol}</h2>
            {seeWeights ? weight : ""}
        </div>
    )
}


function Grid({weightGraph, seeWeights}){
    let row = []
    //reservedState might need to be reworked
    const [reservedState, setReservedState] = React.useState(-1)
    const [mouseState, setMouseState] = React.useState(false)
    
    document.body.onmousedown = function() { 
        setMouseState(true)
    }

    document.body.onmouseup = function() {
        setMouseState(false)
        setReservedState(-1)
    }

    for (let y = 0; y < 22; y++){
        for (let x = 0; x < 41; x++){
            row.push(
                <Node 
                    key={[x,y]}
                    x={x} y={y} 
                    reservedState={reservedState} 
                    setReservedState={setReservedState} 
                    mouseState={mouseState} 
                    weightGraph={weightGraph}
                    seeWeights={seeWeights}
                />
            )
        }
    }

    return(
        <div className="grid_container">
            <div className="grid">
                {row}
            </div>
        </div>
    )
}



function App(){
    const [nodeGraph, setNodeGraph] = React.useState(startingNodeGraph())
    const [weightGraph, setWeightGraph] = React.useState(startingWeightGraph())
    const [seeWeights, setSeeWeights] = React.useState(false)
    const [changed, setChanged] = React.useState(0)

    function updateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
        console.log(`changed: ${changed}`) //delete later
    }

    function updateWeightGraph(newGraph){
        setWeightGraph(newGraph)
        setChanged(prevState => prevState + 1)
        console.log(`changed: ${changed}`) //delete later
    }

    return(
        <div className="wrapper">
            <NodeGraphContext.Provider value={nodeGraph}>
                <UpdateGraphContext.Provider value={updateNodeGraph}>
                    <Grid weightGraph = {weightGraph} seeWeights={seeWeights}/>
                    <SidePanel weightGraph = {weightGraph} updateWeightGraph={updateWeightGraph}/>
                    <AdvancedPanel updateWeightGraph={updateWeightGraph} seeWeights={seeWeights} setSeeWeights={setSeeWeights}/>
                </UpdateGraphContext.Provider>
            </NodeGraphContext.Provider>
        </div>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))