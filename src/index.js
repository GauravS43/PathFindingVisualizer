import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import {clear, quick_dijkstra_aStar, dijkstra_aStar, startingNodeGraph, startingWeightGraph} from "./algorithms"

import {NodeGraphContext, WeightGraphContext} from "./graphContext"
import {SidePanel, AdvancedPanel} from "./panels"
import {Grid} from "./grid"

//TODO
//Add more algorithms 
//Change Animations and timing for graph being filled in
//Add mazes and maze algorithms
//Add additional goals
//Add more interactivity after pathfound

//REVIEW UPDATE AND ANIMATENODEGRAPH (Could be simplfied)


function App(){
    const [nodeGraph, setNodeGraph] = React.useState(startingNodeGraph())
    const [weightGraph, setWeightGraph] = React.useState(startingWeightGraph())
    
    const [seeWeights, setSeeWeights] = React.useState(false)
    const [pathFound, setPathFound] = React.useState(false)
    const [animating, setAnimating] = React.useState(false)

    const [changed, setChanged] = React.useState(0)

    const [funcIndex, setFuncIndex] = React.useState(0)
    const funcArr = [() => dijkstra_aStar(nodeGraph, weightGraph, setPathFound, setAnimating, false),
                     () => dijkstra_aStar(nodeGraph, weightGraph, setPathFound, setAnimating, true)]

    const quickFuncArr = [() => quick_dijkstra_aStar(nodeGraph, weightGraph, false),
                          () => quick_dijkstra_aStar(nodeGraph, weightGraph, true)]                 


    function animateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    function updateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
        if (pathFound){
            setNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
            setTimeout(() => setNodeGraph(quickFuncArr[funcIndex], 0.1))
            setTimeout(() => setChanged(prevState => prevState + 1), 0.1)
        }
    }

    function updateWeightGraph(newGraph){
        setWeightGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    return(
        <div className="wrapper">
            <NodeGraphContext.Provider value={[nodeGraph, animateNodeGraph, updateNodeGraph]}>
                <WeightGraphContext.Provider value={[weightGraph, updateWeightGraph]}>
                    <p className="debug">{changed}</p>
                    <Grid seeWeights={seeWeights}/>
                    <SidePanel funcIndex={funcIndex} setFuncIndex={setFuncIndex} funcArr={funcArr} animating={animating} pathFound={pathFound} setPathFound={setPathFound}/>
                    <AdvancedPanel animating={animating} seeWeights={seeWeights} setSeeWeights={setSeeWeights}/>
                </WeightGraphContext.Provider>
            </NodeGraphContext.Provider>
        </div>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))