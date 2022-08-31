import React from "react"
import { NodeGraphContext, WeightGraphContext } from "../graphContext"


function Node({x, y, reservedState, setReservedState, enteredState, setEnteredState, mouseDown, seeWeights}){
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const manipulateNodeGraph = React.useContext(NodeGraphContext)[2]
    const weightGraph = React.useContext(WeightGraphContext)[0]

    let weight = weightGraph[y][x]
    let state = nodeGraph[y][x]
    let symbol = ([1, 2].includes(state) ? ["A", "B"][state - 1] : "")
    //other states are given colour through an auxiliary function 
    let color = (state < 5 ? ["#96ADE9", "#FFFFFF", "#19D719", "#F02D7D", "#7E05FF", "#FBFF00"][state + 1] : "")

    function handleEnter(){
        if (mouseDown && ![1, 2].includes(state)){
            //preserves state when exiting
            if ([-1, 7].includes(state)) setEnteredState(-1)
            manipulateNodeGraph(prevState => {prevState[y][x] = reservedState; return prevState})
        }
    }

    function handleLeave(){
        //preserves both start and end nodes after dragging one over the other
        if (reservedState !== state) return

        if (mouseDown && reservedState > 0){
            manipulateNodeGraph(prevState => {prevState[y][x] = enteredState; return prevState})
            setEnteredState(0)
        }
    }

    function handleDown(){
        if ([1, 2].includes(state)) 
            {setReservedState(state)}
        else if ([-1, 7].includes(state))
            {manipulateNodeGraph(prevState => {prevState[y][x] = 0; return prevState})}
        else
            {manipulateNodeGraph(prevState => {prevState[y][x] = reservedState; return prevState})}
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

export function Grid({seeWeights}){
    //stores state that will be set when mouseDown
    const [reservedState, setReservedState] = React.useState(-1)
    //stores old state that reservedState overwrites
    const [enteredState, setEnteredState] = React.useState(0)
    const [mouseDown, setMouseDown] = React.useState(false)

    document.body.onmousedown = function() { 
        setMouseDown(true)
    }

    document.body.onmouseup = function() {
        setMouseDown(false)
        setReservedState(-1)
    }

    let row = []

    for (let y = 0; y < 22; y++){
        for (let x = 0; x < 41; x++){
            row.push(
                <Node 
                    key={[x,y]}
                    x={x} y={y} 
                    reservedState={reservedState} 
                    setReservedState={setReservedState} 
                    enteredState={enteredState}
                    setEnteredState={setEnteredState}
                    mouseDown={mouseDown} 
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