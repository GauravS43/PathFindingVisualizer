import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import { dijkstra, clear, find, startingNodeGraph, startingWeightGraph, randomizeWeights} from "./algorithms"
//TODO
//Assign Symbols and create legend
//Create DropDown button and add more algorithms 
//Add Advanced Settings
//Implement Weights
//Change Animations and timing for graph being filled in

const NodeGraphContext = React.createContext()
const UpdateGraphContext = React.createContext()

function SidePanel({weightGraph, updateWeightGraph}){
    const nodeGraph = React.useContext(NodeGraphContext)
    const updateNodeGraph = React.useContext(UpdateGraphContext)
    const [visible, setVisible] = React.useState(true)

    function clearGrid(){
        updateNodeGraph(clear(nodeGraph))
    }

    function restart(){
        updateNodeGraph(startingNodeGraph())
        updateWeightGraph(startingWeightGraph())
    }

    function visualize(){
        let tempGraph = dijkstra(find(nodeGraph, 1), find(nodeGraph, 2), nodeGraph, weightGraph)
        updateNodeGraph(tempGraph)
    }

    const style = {
        transform: visible ? "translateY(0)" : "translateY(82%)",
        backgroundColor: "#F02D7D",
        top: "5%",
        left: "2%"
    }

    function movePanel(){
        setVisible(prevState => !prevState)
    }

    return (
        <div>
            <div className="panel_container" style={style}>
                <div className="arrows">
                    <button id="up" onClick={movePanel}> 
                        {String.fromCharCode((visible ? "9660" : "9650"))}
                    </button>
                </div>
                <button onClick={visualize}>Run</button>
                <h2>Current Algorithm: Dijkstra</h2>
                <button onClick={clearGrid}>Clear Grid</button>
                <button onClick={restart}>Restart</button>
                <button>Algorithms &#8964;</button>
            </div>
        </div>
    )
}

function SettingsPanel({updateWeightGraph, seeWeights, setSeeWeights}){
    const [visible, setVisible] = React.useState(false)

    const style = {
        transform: visible ? "translateY(0)" : "translateY(88%)",
        backgroundColor: "#19D719",
        top: "5%",
        left: "78%"
    }

    function movePanel(){
        setVisible(prevState => !prevState)
    }

    function viewWeights(){
        setSeeWeights(prevState => !prevState)
    }

    function randomizeW(){
        updateWeightGraph(randomizeWeights())
    }

    return (
        <div>
            <div className="panel_container" style={style}>
                <div className="arrows">
                    <button id="up" onClick={movePanel}> 
                        {String.fromCharCode((visible ? "9660" : "9650"))}
                    </button>
                </div>
                <h1>Settings</h1>
                <button onClick={viewWeights}>
                    {seeWeights ? "Hide Weights" : "View Weights"}
                </button>
                <button onClick={randomizeW}>Randomize Weights</button>
            </div>
        </div>
    )
}



function Node({x, y, reservedState, setReservedState, mouseState, weight, seeWeights}){
    const nodeGraph = React.useContext(NodeGraphContext)
    const updateNodeGraph = React.useContext(UpdateGraphContext)
    let state = nodeGraph[y][x]
    let colors = ["black", "white", "purple", "green", ""]
    //let symbols = [0, 0, 0, 9873, 0]
    let color = colors[state + 1]

    function handleEnter(){
        if (mouseState && nodeGraph[y][x] < 1){
            updateNodeGraph(prevState => {prevState[y][x] = reservedState; return prevState})
        }
    }

    function handleLeave(){
        if (mouseState && reservedState > 0){
            updateNodeGraph(prevState => {prevState[y][x] = 0; return prevState})
        }
    }

    function handleDown(){
        if (state !== 0 ){
            setReservedState(state)
            updateNodeGraph(prevState => {prevState[y][x] = 0; return prevState})
        }
        else{
            updateNodeGraph(prevState => {prevState[y][x] = -1; return prevState})
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
            {seeWeights ? weight : ""}
        </div>
    )
}


function Grid({weightGraph, seeWeights}){
    let row = []
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
                    weight={weightGraph[y][x]}
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
                    <SettingsPanel updateWeightGraph={updateWeightGraph} seeWeights={seeWeights} setSeeWeights={setSeeWeights}/>
                </UpdateGraphContext.Provider>
            </NodeGraphContext.Provider>
        </div>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))