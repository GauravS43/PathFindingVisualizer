/*

import React from "react"
import ReactDOM from "react-dom"
import './index.css'

//use grid css

import {dijkstra} from './algorithms' 

export {dijkstra}

function Coord(props){
    const [clicked, setClicked] = React.useState(false)

    let coords = props.Xcoord.toString().concat(",", props.Ycoord) 

    function handleClick(){
        console.log([props.Xcoord,props.Ycoord])
    }

    function handleEnter(){
        setClicked(prevState => true)
    }

    return(
        <div onMouseEnter={props.mouseState ? handleEnter : handleClick} onClick={handleEnter} className="block" id={coords}></div>
    )
}
//    returned(
//    <div onMouseEnter={props.mouseState ? handleEnter : handleClick} onClick={handleEnter} className= {clicked ? "block clicked" : "block"}></div>
//    )

function Row(props){
    let row = []

    for (let i = 0; i < 65; i++){
        let coords = i.toString().concat(",", props.Ycoord) 
        row.push(<Coord key={coords} Ycoord = {props.Ycoord} Xcoord = {i} mouseState={props.mouseState}/>)
    }
    return(
        <div className="flex">
            {row}
        </div>
    )
}

function Column(props){
    let column = []
    for (let i = 0; i < 35; i++){
        column.push(<Row key={i} Ycoord={i} mouseState={props.mouseState}/>)
    }

    return(
        <div>
            {column}
        </div>
    )
}

function SidePanel(){
    return (
        <div>
            <div className="container">
                <button onClick={dijkstra()}>Run</button>
            </div>
        </div>
    )
}


function App(){
    const [mouseState, setMouseState] = React.useState(false)
    document.body.onmousedown = function() { 
        console.log("MOUSE DOWN");
        setMouseState(true)
    }

    document.body.onmouseup = function() {
        console.log("MOUSE UP");
        setMouseState(false)
    }

    return(
        <div>
            <SidePanel/>
            <Column mouseState={mouseState}/>
        </div>
    )
}

*/