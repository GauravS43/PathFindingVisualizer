import React from "react"

function Modal() {
    let [tutState, setTutState] = React.useState(0)
    let modalDisplay = { display: (tutState > 4) ? "none" : "block" }

    function updateTutState(change) {
        setTutState(tutState + change)
    }


    return (
        <div className="modal_wrapper">
            <div className="modal_container" style={modalDisplay}>
                <div className="inner_modal">
                    {tutState === 0 && <h2 className="modal_title">Welcome!</h2>}
                    {tutState === 1 && <h2 className="modal_title">Find Optimal Paths!</h2>}
                    {tutState === 2 && <h2 className="modal_title">Change Algorithm and Add Walls!</h2>}
                    {tutState === 3 && <h2 className="modal_title">Generate Mazes!</h2>}
                    {tutState === 4 && <h2 className="modal_title">Manipulate Weights!</h2>}
                    <div className="desc">
                        {tutState === 0 &&
                            <>
                                <img src={"https://media0.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif?cid=ecf05e47n1h2lso9z28vsgsfqregqfu6kg9l1c5mdgo05s3g&ep=v1_gifs_search&rid=giphy.gif&ct=g"} alt={"welcome gif"} />
                                <h3>
                                    Welcome to MacGDC's pathfinding visualizer, an independently crafted project using React for a workshop on Enemy AI and pathfinding in games.
                                    If this is your first time, press next and check out this tutorial.
                                </h3>
                            </>
                        }
                        {tutState === 1 &&
                            <>
                                <img src={"https://github.com/GauravS43/PathFindingVisualizer/raw/master/gifs/PF_run.gif"} alt={"tut1 gif"} />
                                <h3>
                                    To discover the optimal path, simply click the "Run" button located in the menu on the left.
                                    Once a path is calculated, you can dynamically observe the algorithm's behavior in real-time by dragging the nodes associated with the start or destination.
                                </h3>
                            </>
                        }
                        {tutState === 2 &&
                            <>
                                <img src={"https://github.com/GauravS43/PathFindingVisualizer/raw/master/gifs/PF_wall.gif"} alt={"tut2 gif"} />
                                <h3>
                                    Press the "Algorithms" button to get a selection of available pathfinding algorithms.
                                    Once a path is calculated, you can introduce walls to observe the real-time impact on the algorithm's behavior.
                                </h3>

                            </>
                        }
                        {tutState === 3 &&
                            <>
                                <img src={"https://github.com/GauravS43/PathFindingVisualizer/raw/master/gifs/PF_maze.gif"} alt={"tut3 gif"} />
                                <h3>
                                    By clicking the arrow icon, you can access or hide the menus.
                                    You can select a maze generation algorithm to generate a maze in the advanced menu.
                                </h3>
                            </>
                        }
                        {tutState === 4 &&
                            <>
                                <img src={"https://github.com/GauravS43/PathFindingVisualizer/raw/master/gifs/PF_weights.gif"} alt={"tut4 gif"} />
                                <h3>
                                    In the advanced menu, you can also view and modify the weights assigned to each node, to observe the impact of weights.
                                    It is important to note that while some algorithms consider weights, others may not incorporate them into their calculations.
                                </h3>
                            </>
                        }
                    </div>
                    <div className="modal_buttons">
                        {tutState === 0 && <button onClick={() => updateTutState(5)}>Skip</button>}
                        {tutState > 0 && <button onClick={() => updateTutState(-1)}>Back</button>}
                        <button onClick={() => updateTutState(1)}>{(tutState < 4) ? "Next" : "Finish"}</button>
                    </div>
                </div>
            </div >
        </div>
    )
}


/*
 <section style={{ display: "none" }}>
                    {/*slide 2
                    "Select an algorithm and press run to calculate"
                    {/*slide 3
                    "add walls and change weights"
                    {/*slide 4
                    "generate mazes"
                    {/*slide 5
                    "You can move the start or destination in real time"
                    {/*slide 6
                    "If things get messy you can clear the walls or paths"
                </section> */

export { Modal }