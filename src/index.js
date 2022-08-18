import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import {startingNodeGraph, startingWeightGraph} from "./algorithms"

import {NodeGraphContext, WeightGraphContext} from "./graphContext"
import {SidePanel, AdvancedPanel} from "./panels"
import {Grid} from "./grid"

//TODO
//Add more algorithms 
//Change Animations and timing for graph being filled in
//Add mazes and maze algorithms
//Add additional goals
//Add more interactivity after pathfound

function App(){
    const [nodeGraph, setNodeGraph] = React.useState(startingNodeGraph())
    const [weightGraph, setWeightGraph] = React.useState(startingWeightGraph())
    
    const [seeWeights, setSeeWeights] = React.useState(false)
    const [pathFound, setPathFound] = React.useState(false)
    const [animating, setAnimating] = React.useState(false)

    const [changed, setChanged] = React.useState(0)


    function updateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    function updateWeightGraph(newGraph){
        setWeightGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    return(
        <div className="wrapper">
            <NodeGraphContext.Provider value={[nodeGraph, updateNodeGraph]}>
                <WeightGraphContext.Provider value={[weightGraph, updateWeightGraph]}>
                    <p className="debug">{changed}</p>
                    <Grid seeWeights={seeWeights}/>
                    <SidePanel animating={animating} setAnimating={setAnimating} pathFound={pathFound} setPathFound={setPathFound}/>
                    <AdvancedPanel animating={animating} seeWeights={seeWeights} setSeeWeights={setSeeWeights}/>
                </WeightGraphContext.Provider>
            </NodeGraphContext.Provider>
        </div>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))