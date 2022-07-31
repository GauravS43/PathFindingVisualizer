import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import { dijkstra } from "./algorithms"
//SHOULD RENAME COORDS INTO NODES

function SidePanel(){

    return (
        <div>
            <div className="panel_container">
                <button onClick={() => dijkstra('2,9')}>Run</button>
            </div>
        </div>
    )
}


function Grid(){
    let row = []

    for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
            row.push(<div className="block" key={[x, y]} id={[x, y]}></div>)
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



function App(){
    const [graph, setGraph] = React.useState([])
    
    React.useEffect(() => {
        setGraph([[0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0]])
    }, []);

    console.log(graph)
    
    return(
        <div>
            <SidePanel/>
            <Grid/>
        </div>
    )
}


ReactDOM.render(<App/>, document.getElementById("root"))