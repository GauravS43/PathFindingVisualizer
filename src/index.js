import React from "react"
import ReactDOM from "react-dom"
import './index.css'

import {clear, startingNodeGraph, startingWeightGraph} from "./algorithms"
import {updated_dijkstra_aStar, updateScreen} from "./pfAlgorithms"

import {NodeGraphContext, WeightGraphContext} from "./graphContext"
import {SidePanel, AdvancedPanel} from "./panels"
import {Grid} from "./grid"

function App(){
    const [nodeGraph, setNodeGraph] = React.useState(startingNodeGraph())
    const [weightGraph, setWeightGraph] = React.useState(startingWeightGraph())
    
    const [seeWeights, setSeeWeights] = React.useState(true)
    const [pathFound, setPathFound] = React.useState(false)
    const [animating, setAnimating] = React.useState(false)

    const [changed, setChanged] = React.useState(0)
    //const [cost, setCost] = React.useState(0)

    const [funcIndex, setFuncIndex] = React.useState(0)
    const funcArr = [() => updated_dijkstra_aStar(nodeGraph, weightGraph, false),
                     () => updated_dijkstra_aStar(nodeGraph, weightGraph, true)
                    ]             
                         
    function updateWeightGraph(newGraph){
        setWeightGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    function updateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    function manipulateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
        if (pathFound){
            setNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
            let newGraph = []
            setTimeout(function() {newGraph = updated_dijkstra_aStar(nodeGraph, weightGraph, [3,4], false)}, 1)
            setTimeout(() => setNodeGraph(newGraph[0]), 1)
            setTimeout(() => setChanged(prevState => prevState + 1), 1)
        }
    }

    function findPath(animate){
        let stateArr = animate ? [5, 6] : [3, 4]
        let [newGraph, order] = updated_dijkstra_aStar(nodeGraph, weightGraph, stateArr, false)
        if (animate) updateScreen(animate, order, setPathFound, setAnimating)
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    return(
        <div className="wrapper">
            <NodeGraphContext.Provider value={[nodeGraph, updateNodeGraph, manipulateNodeGraph]}>
                <WeightGraphContext.Provider value={[weightGraph, updateWeightGraph]}>
                    <p className="debug">{changed}</p>
                    <h3 className="cost" onClick={() => console.log(nodeGraph)}>Total Cost: {/*cost*/}</h3>

                    <Grid findPath={findPath} seeWeights={seeWeights}/>
                    <SidePanel findPath= {findPath} funcIndex={funcIndex} setFuncIndex={setFuncIndex} funcArr={funcArr} animating={animating} pathFound={pathFound} setPathFound={setPathFound}/>
                    <AdvancedPanel animating={animating} seeWeights={seeWeights} setSeeWeights={setSeeWeights}/>
                </WeightGraphContext.Provider>
            </NodeGraphContext.Provider>
        </div>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))