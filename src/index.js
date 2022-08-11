import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import { dijkstra, refresh, start, end } from "./algorithms"
//SHOULD RENAME COORDS INTO NODES

const NodeGraphContext = React.createContext()
const UpdateGraphContext = React.createContext()

function SidePanel(){
    const nodeGraph = React.useContext(NodeGraphContext)
    const updateNodeGraph = React.useContext(UpdateGraphContext)

    function restart(){
        updateNodeGraph(refresh(nodeGraph))
    }

    function visualize(){
        let tempGraph = dijkstra(start(nodeGraph), end(nodeGraph), nodeGraph)
        updateNodeGraph(tempGraph)
    }

    return (
        <div>
            <div className="panel_container">
                <button onClick={restart}>Refresh</button>
                <button onClick={visualize}>Run</button>
            </div>
        </div>
    )
}

function Node({x, y, reservedState, setReservedState}){
    const nodeGraph = React.useContext(NodeGraphContext)
    const updateNodeGraph = React.useContext(UpdateGraphContext)
    let state = nodeGraph[y][x]
    let color = ''
    
    switch(state) {
        case -1: //wall
            color = "black"
            break
        case 0: //blank
            color = "white"
            break
        case 1: //Start
            color = "purple"
            break
        case 2: //End
            color = "green"
            break   
        default:
            color = ""
            break
    }

    function handleClick(){
        let tempGraph = nodeGraph
        if (state === 1 || state === 2){
            setReservedState(state)
            tempGraph[y][x] = 0
            updateNodeGraph(tempGraph)
        }
        else if (state === 0){
            tempGraph[y][x] = reservedState
            updateNodeGraph(tempGraph)
            setReservedState(-1)
        }
        else if (state === -1){
            tempGraph[y][x] = 0
            updateNodeGraph(tempGraph)
        }
    }

    return(
        <div 
            className="block" 
            onClick= {handleClick}
            key={[x, y]} 
            id={[x, y]}
            style={{backgroundColor: color}}
        > {state}</div>
    )
}


function Grid(){
    let row = []
    const [reservedState, setReservedState] = React.useState(-1)


    for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
            row.push(<Node key={[x,y]} x={x} y={y} reservedState={reservedState} setReservedState={setReservedState}/>)
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
    //-1 = wall
    //0 = nothing
    //1 = start
    //2 = end
    //3 = viewed
    //4 = path
    const [nodeGraph, setNodeGraph] = React.useState(([[1,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,0],
                                                       [0,0,0,0,0,0,0,0,0,2]]))

    const [changed, setChanged] = React.useState(0)

    function updateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
        console.log(`changed: ${changed}`) //delete later
    }

    return(
        <NodeGraphContext.Provider value={nodeGraph}>
            <UpdateGraphContext.Provider value={updateNodeGraph}>
                <Grid/>
                <SidePanel/>
            </UpdateGraphContext.Provider>
        </NodeGraphContext.Provider>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))