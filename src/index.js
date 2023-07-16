import React from "react"
import ReactDOM from "react-dom"
import './index.css'
//algorithm imports
import { clear, startingNodeGraph, startingWeightGraph } from "./algorithms/generalAlgo"
import { breadthFirst, depthFirst, greedyBestFirst, dijkstra_aStar, bidirectional_dijkstra_aStar, updateScreen } from "./algorithms/pathFinding"
import { auxDivide } from "./algorithms/mazeGeneration"
//react context and component imports
import { NodeGraphContext, WeightGraphContext } from "./graphContext"
import { SidePanel, AdvancedPanel } from "./components/panels"
import { Grid } from "./components/grid"
import { Modal } from "./components/modal"

function App() {
    const [nodeGraph, setNodeGraph] = React.useState(startingNodeGraph())
    const [weightGraph, setWeightGraph] = React.useState(startingWeightGraph())

    const [seeWeights, setSeeWeights] = React.useState(false)
    const [pathFound, setPathFound] = React.useState(false)
    const [animating, setAnimating] = React.useState(false)
    const [animateSpeed, setAnimateSpeed] = React.useState(16)

    const [cost, setCost] = React.useState(0)
    const [changed, setChanged] = React.useState(0)
    const [errorMSG, setErrorMSG] = React.useState("")
    const errorStyle = { display: errorMSG ? "block" : "none" }

    const [funcIndex, setFuncIndex] = React.useState(0)
    //first half of array needs auxiliary function to display change on render
    //later half of array automatically displays change on render
    const funcArr = [() => dijkstra_aStar(nodeGraph, weightGraph, [5, 6], false),
    () => dijkstra_aStar(nodeGraph, weightGraph, [5, 6], true),
    () => bidirectional_dijkstra_aStar(nodeGraph, weightGraph, [5, 6], false),
    () => bidirectional_dijkstra_aStar(nodeGraph, weightGraph, [5, 6], true),
    () => depthFirst(nodeGraph, weightGraph, [5, 6]),
    () => breadthFirst(nodeGraph, weightGraph, [5, 6]),
    () => greedyBestFirst(nodeGraph, weightGraph, [5, 6]),

    () => dijkstra_aStar(nodeGraph, weightGraph, [3, 4], false),
    () => dijkstra_aStar(nodeGraph, weightGraph, [3, 4], true),
    () => bidirectional_dijkstra_aStar(nodeGraph, weightGraph, [3, 4], false),
    () => bidirectional_dijkstra_aStar(nodeGraph, weightGraph, [3, 4], true),
    () => depthFirst(nodeGraph, weightGraph, [3, 4]),
    () => breadthFirst(nodeGraph, weightGraph, [3, 4]),
    () => greedyBestFirst(nodeGraph, weightGraph, [3, 4])
    ]

    const [mazeIndex, setMazeIndex] = React.useState(0)
    const mazeArr = [() => auxDivide(nodeGraph, [1, 1]),
    () => auxDivide(nodeGraph, [1, 2]),
    () => auxDivide(nodeGraph, [2, 1]),
    ]

    function updateWeightGraph(newGraph) {
        setWeightGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    function handleError(newCost) {
        //if path not found, returned cost is -1 
        if (newCost !== -1) {
            setErrorMSG("")
            setCost(newCost)
        } else {
            setErrorMSG("No Path Found")
            setCost(0)
        }
    }

    //called when doing an action that has no effect on pathfinding (i.e clearing the path)
    function updateNodeGraph(newGraph) {
        setNodeGraph(newGraph)
        setChanged(prevState => prevState + 1)
    }

    //called when doing an action that may result in the path being updated (i.e adding a wall)
    function manipulateNodeGraph(newGraph) {
        updateNodeGraph(newGraph)
        if (pathFound) {
            setNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
            //timeout necessary to ensure nodegraph doesn't have old path
            setTimeout(() => findPath(false), 1)
        }
    }

    function findPath(animate = true) {
        let [newGraph, order, newCost] = funcArr[(animate ? funcIndex : funcIndex + 7)]()
        if (animate) updateScreen(order, setPathFound, setAnimating, animateSpeed)
        handleError(newCost)
        updateNodeGraph(newGraph)
    }

    function generateMaze() {
        if (!animating) {
            setCost(0)
            updateNodeGraph(clear(nodeGraph, [-1, 3, 4, 5, 6, 7]))
            setPathFound(false)
            //timeout necessary to ensure nodegraph is clear
            setTimeout(
                function () {
                    let mazeResults = mazeArr[mazeIndex]()
                    //blank function as parameter to not change pathfound
                    updateScreen(mazeResults[1], () => { }, setAnimating, animateSpeed)
                    updateNodeGraph(mazeResults[0])
                }, 1
            )
        }
    }

    return (
        <div className="wrapper">
            <NodeGraphContext.Provider value={[nodeGraph, updateNodeGraph, manipulateNodeGraph]}>
                <WeightGraphContext.Provider value={[weightGraph, updateWeightGraph]}>
                    <p className="debug">{changed}<br></br>{animateSpeed}</p>
                    <h3 className="cost">Total Cost: {cost}</h3>
                    <h3 className="error_msg" style={errorStyle}>{errorMSG}</h3>

                    <Grid seeWeights={seeWeights} />

                    <SidePanel
                        setCost={setCost}
                        findPath={findPath}
                        funcIndex={funcIndex}
                        setFuncIndex={setFuncIndex}
                        pathFound={pathFound}
                        setPathFound={setPathFound}
                        animating={animating}
                        setAnimateSpeed={setAnimateSpeed}
                    />
                    <AdvancedPanel
                        setCost={setCost}
                        generateMaze={generateMaze}
                        animating={animating}
                        seeWeights={seeWeights}
                        setSeeWeights={setSeeWeights}
                        setPathFound={setPathFound}
                        mazeIndex={mazeIndex}
                        setMazeIndex={setMazeIndex}
                    />
                    <Modal />
                </WeightGraphContext.Provider>
            </NodeGraphContext.Provider>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))