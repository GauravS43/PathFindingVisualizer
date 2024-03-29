import React from "react"
import { clear, find, startingNodeGraph, startingWeightGraph, randomizeWeights } from "../algorithms/generalAlgo"
import { NodeGraphContext, WeightGraphContext } from "../graphContext"

function ClearButtons({ setCost, animating, pathFound, setPathFound }) {
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph = React.useContext(NodeGraphContext)[1]
    const manipulateNodeGraph = React.useContext(NodeGraphContext)[2]
    const updateWeightGraph = React.useContext(WeightGraphContext)[1]

    //variables inherited from parent determine if buttons works
    function clearWalls() {
        if (!animating && (find(nodeGraph, -1) || find(nodeGraph, 7))) {
            manipulateNodeGraph(clear(nodeGraph, [-1, 7]))
        }
    }

    function clearPaths() {
        if (pathFound && !animating) {
            setCost(0)
            setPathFound(false)
            updateNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
        }
    }

    function restart() {
        if (!animating) {
            setCost(0)
            setPathFound(false)
            updateNodeGraph(startingNodeGraph())
            updateWeightGraph(startingWeightGraph())
        }
    }

    return (
        <div>
            {/* "clear_button" class darkens button and shows no functionality */}
            <button className={(!animating && (find(nodeGraph, -1) || find(nodeGraph, 7))) ? "" : "clear_button"} onClick={clearWalls}>
                Clear Walls
            </button>
            <button className={pathFound && !animating ? "" : "clear_button"} onClick={clearPaths}>
                Clear Path
            </button>
            <button className={animating ? "clear_button" : ""} onClick={restart}>
                Restart
            </button>
        </div>
    )
}

function AlgorithmsDropDown({ setFuncIndex }) {
    const [algorithmsClicked, setAlgorithmsClicked] = React.useState(false)

    //funcIndex corresponds to a pf function in funcArr in parent
    function changeAlgorithm(ind) {
        setFuncIndex(ind)
        setAlgorithmsClicked(false)
    }

    return (
        <div className="dropdown">
            <button onClick={() => setAlgorithmsClicked(prevState => !prevState)}>
                Algorithms &#8964;
            </button>
            <div className="dropdown_content" style={{ display: algorithmsClicked ? "" : "none" }}>
                <h3 onClick={() => changeAlgorithm(0)}>Dijkstra</h3>
                <h3 onClick={() => changeAlgorithm(1)}>A Star</h3>
                <h3 onClick={() => changeAlgorithm(2)}>Bidirectional Dijkstra</h3>
                <h3 onClick={() => changeAlgorithm(3)}>Bidirectional A Star</h3>
                <h3 onClick={() => changeAlgorithm(4)}>Depth First</h3>
                <h3 onClick={() => changeAlgorithm(5)}>Breadth First</h3>
                <h3 onClick={() => changeAlgorithm(6)}>Greedy Best First</h3>
            </div>
        </div>
    )
}

function SidePanel({ setCost, findPath, funcIndex, setFuncIndex, pathFound, setPathFound, animating, setAnimateSpeed }) {
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph = React.useContext(NodeGraphContext)[1]

    const [visiblePanel, setVisiblePanel] = React.useState(true)
    const funcNameArr = ["Dijkstra",
        "A Star",
        "Bidirectional Dijkstra",
        "Bidirectional A Star",
        "Depth First",
        "Breadth First",
        "Greedy Best First"
    ]

    function findP() {
        //clears all paths so algorithm runs with only walls
        if (!animating) {
            updateNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
            setTimeout(() => findPath(), 1)
        }
    }

    function updateSpeed() {
        let speed = document.getElementById("speedSlider").value
        setAnimateSpeed(speed)
    }

    return (
        <div className={"panel_container " + (visiblePanel ? "bas_panel_up" : "bas_panel_down")}>
            <div className="arrows">
                <button onClick={() => setVisiblePanel(prevState => !prevState)}>
                    {/* arrow symbols */}
                    {String.fromCharCode((visiblePanel ? "9660" : "9650"))}
                </button>
            </div>
            <button className={animating ? "first_button clear_button" : "first_button"} onClick={findP}>Run</button>
            <h2>Algorithm: {funcNameArr[funcIndex]}</h2>
            <AlgorithmsDropDown setFuncIndex={setFuncIndex} />
            <ClearButtons setCost={setCost} animating={animating} pathFound={pathFound} setPathFound={setPathFound} />
            <div className="flex">
                <h2>Speed:</h2>
                <div className="slider_container">
                    <input type="range" className="slider" min="2" max="16" id="speedSlider" onChange={updateSpeed}></input>
                </div>
            </div>
        </div>
    )
}

function MazeDropDown({ setMazeIndex }) {
    const [algorithmsClicked, setAlgorithmsClicked] = React.useState(false)

    function changeAlgorithm(ind) {
        setMazeIndex(ind)
        setAlgorithmsClicked(false)
    }

    const contentStyle = {
        display: algorithmsClicked ? "" : "none",
        backgroundColor: "#a9b9fb",
    }

    return (
        <div className="dropdown">
            <button onClick={() => setAlgorithmsClicked(prevState => !prevState)}>
                Algorithms &#8964;
            </button>
            <div className="dropdown_content" style={contentStyle}>
                <h3 onClick={() => changeAlgorithm(0)}>Recursive Division (R.D)</h3>
                <h3 onClick={() => changeAlgorithm(1)}>R.D Horizontal Bias</h3>
                <h3 onClick={() => changeAlgorithm(2)}>R.D Vertical Bias</h3>
            </div>
        </div>
    )
}

function AdvancedPanel({ setCost, generateMaze, animating, seeWeights, setSeeWeights, setPathFound, mazeIndex, setMazeIndex }) {
    const nodeGraph = React.useContext(NodeGraphContext)[0]
    const updateNodeGraph = React.useContext(NodeGraphContext)[1]
    const updateWeightGraph = React.useContext(WeightGraphContext)[1]
    const [visiblePanel, setVisiblePanel] = React.useState(false)
    const mazeNameArr = ["Recursive Division", "R.D Horizontal Bias", "R.D Vertical Bias"]

    //nodeGraph is cleared after weights change because old path may not be optimal
    function randomizeW() {
        if (!animating) {
            setCost(0)
            setPathFound(false)
            updateWeightGraph(randomizeWeights())
            updateNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
        }
    }

    function defaultW() {
        if (!animating) {
            setCost(0)
            setPathFound(false)
            updateWeightGraph(startingWeightGraph())
            updateNodeGraph(clear(nodeGraph, [3, 4, 5, 6]))
        }
    }

    return (
        <div className={"panel_container " + (visiblePanel ? "adv_panel_up" : "adv_panel_down")} >
            <div className="arrows">
                <button id="up" onClick={() => setVisiblePanel(prevState => !prevState)}>
                    {/* arrow symbols */}
                    {String.fromCharCode((visiblePanel ? "9660" : "9650"))}
                </button>
            </div>

            <h1>Advanced</h1>

            <button onClick={() => setSeeWeights(prevState => !prevState)}>
                {seeWeights ? "Hide Weights" : "View Weights"}
            </button>

            <button style={{ marginBottom: "1%" }} className={animating ? "clear_button" : ""} onClick={generateMaze}>
                Generate Maze
            </button>
            <h2>Algorithm: {mazeNameArr[mazeIndex]}</h2>
            <MazeDropDown setMazeIndex={setMazeIndex} />

            <button className={animating ? "clear_button" : ""} onClick={randomizeW}>
                Random Weights
            </button>
            <button className={animating ? "clear_button" : ""} onClick={defaultW}>
                Default Weights
            </button>
        </div>
    )
}

export { SidePanel, AdvancedPanel }