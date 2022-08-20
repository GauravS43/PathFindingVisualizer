import React from "react"
import {NodeGraphContext, WeightGraphContext} from "./graphContext"


function Node({x, y, reservedState, setReservedState, mouseState, seeWeights}){
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph = React.useContext(NodeGraphContext)[1]
    const manipulateNodeGraph = React.useContext(NodeGraphContext)[2]
    const weightGraph = React.useContext(WeightGraphContext)[0]

    let weight = weightGraph[y][x]
    let state = nodeGraph[y][x]
    let symbol = ["", "", "A", "B", "", ""][state + 1]
    let color = ["#96ADE9", "white", "#19D719", "#F02D7D", "#7E05FF", "#FBFF00", "", ""][state + 1]

    function handleEnter(){
        if (mouseState && (nodeGraph[y][x] < 1 | nodeGraph[y][x] > 2)){
            manipulateNodeGraph(prevState => {prevState[y][x] = reservedState; return prevState})
        }
    }

    function handleLeave(){
        if (reservedState !== nodeGraph[y][x]){
            return
        }

        if (mouseState && reservedState > 0){
            updateNodeGraph(prevState => {prevState[y][x] = 0; return prevState})
        }
    }

    function handleDown(){
        if (state === 1 || state === 2 ){
            setReservedState(state)
        }
        else if (state === -1){
            manipulateNodeGraph(prevState => {prevState[y][x] = 0 ; return prevState})
        }
        else{
            manipulateNodeGraph(prevState => {prevState[y][x] = reservedState; return prevState})
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
            <h2 className="weight">{seeWeights && [0,3,4,5,6].includes(state) ? weight : ""}</h2>
        </div>
    )
}

export function Grid({findPath, seeWeights}){
    const [reservedState, setReservedState] = React.useState(-1)
    const [mouseState, setMouseState] = React.useState(false)
    let row = []

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