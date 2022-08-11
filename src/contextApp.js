/*

import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import { dijkstra, refresh } from "./algorithms"
//SHOULD RENAME COORDS INTO NODES

function SidePanel({nodeGraph, setNodeGraph, setChanged}){
    function restart(){
        setNodeGraph(refresh(nodeGraph))
        setChanged(prevState => prevState + 1)
    }

    function visualize(){
        let tempGraph = dijkstra('0,0', '9,9', nodeGraph)
        setNodeGraph(tempGraph)
        setChanged(prevState => prevState + 1)
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

function Node({x, y, state}){
    let color = ""

    switch(state) {
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

    return(
        <div 
            className="block" 
            //onClick={handleClick} 
            key={[x, y]} 
            id={[x, y]}
            style={{backgroundColor: color}}
        > {state}</div>
    )
}


function Grid({nodeGraph}){
    let row = []

    for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
            row.push(<Node key={[x,y]} x={x} y={y} state={nodeGraph[y][x]}/>)
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

    const [changed, setChanged] = React.useState(1)
    console.log(changed) //can delete later

    return(
        <div>
            {(nodeGraph.length > 0) && <Grid nodeGraph={nodeGraph}/>}
            {(nodeGraph.length > 0) && <SidePanel nodeGraph={nodeGraph} setNodeGraph={setNodeGraph} setChanged={setChanged}/>}
        </div>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))

*/