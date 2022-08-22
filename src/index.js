import React from "react"
import ReactDOM from "react-dom"
import './index.css'

import {clear, find, startingNodeGraph, startingWeightGraph} from "./algorithms"
import {breadthFirst, depthFirst, greedyBestFirst, updated_dijkstra_aStar, updateScreen} from "./pfAlgorithms"

import {NodeGraphContext, WeightGraphContext} from "./graphContext"
import {SidePanel, AdvancedPanel} from "./panels"
import {Grid} from "./grid"

function App()
{
    const [nodeGraph, setNodeGraph] = React.useState(startingNodeGraph())
    const [weightGraph, setWeightGraph] = React.useState(startingWeightGraph())
    
    const [seeWeights, setSeeWeights] = React.useState(false)
    const [pathFound, setPathFound] = React.useState(false)
    const [animating, setAnimating] = React.useState(false)

    const [changed, setChanged] = React.useState(0)
    const [cost, setCost] = React.useState(0)

    const [funcIndex, setFuncIndex] = React.useState(0)
    const funcArr = [() => updated_dijkstra_aStar(nodeGraph, weightGraph, [5,6], false),
                     () => updated_dijkstra_aStar(nodeGraph, weightGraph, [5,6], true),
                     () => depthFirst(nodeGraph, weightGraph, [5,6]),
                     () => breadthFirst(nodeGraph, weightGraph, [5,6]),

                     () => updated_dijkstra_aStar(nodeGraph, weightGraph, [3,4], false),
                     () => updated_dijkstra_aStar(nodeGraph, weightGraph, [3,4], true),
                     () => depthFirst(nodeGraph, weightGraph, [3,4]),
                     () => breadthFirst(nodeGraph, weightGraph, [3,4]),]
                         
    function updateWeightGraph(newGraph){
        setWeightGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    function updateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        if (!find(newGraph, 4)) setCost(0)
        setChanged(prevState => prevState + 1)
    }

    function manipulateNodeGraph(newGraph){
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
        if (pathFound){
            setNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
            let pfResults = []
            setTimeout(function() {pfResults = funcArr[funcIndex + 4]()}, 1)
            setTimeout(() => setNodeGraph(pfResults[0]), 1)
            setTimeout(() => setCost(pfResults[2]), 1)
            setTimeout(() => setChanged(prevState => prevState + 1), 1)
        }
    }

    function findPath(animate){
        let [newGraph, order, newCost] =  funcArr[funcIndex]()
        updateScreen(animate, order, setPathFound, setAnimating)
        setNodeGraph(newGraph)
        setCost(newCost)
        setChanged(prevState => prevState + 1)
    }

    function GBS(){
        let [newGraph, order, newCost] =  greedyBestFirst(nodeGraph, weightGraph, [5, 6])
        updateScreen(true, order, setPathFound, setAnimating)
        setNodeGraph(newGraph)
        setCost(newCost)
        setChanged(prevState => prevState + 1)
    }

    return(
        <div className="wrapper">
            <NodeGraphContext.Provider value={[nodeGraph, updateNodeGraph, manipulateNodeGraph]}>
                <WeightGraphContext.Provider value={[weightGraph, updateWeightGraph]}>
                    <p className="debug">{changed}</p>
                    <button onClick={GBS}>TEST</button>
                    <h3 className="cost" onClick={() => console.log(nodeGraph)}>Total Cost: {cost}</h3>

                    <Grid findPath={findPath} seeWeights={seeWeights}/>
                    <SidePanel findPath= {findPath} funcIndex={funcIndex} setFuncIndex={setFuncIndex} animating={animating} pathFound={pathFound} setPathFound={setPathFound}/>
                    <AdvancedPanel animating={animating} seeWeights={seeWeights} setSeeWeights={setSeeWeights} setPathFound={setPathFound}/>
                </WeightGraphContext.Provider>
            </NodeGraphContext.Provider>
        </div>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))