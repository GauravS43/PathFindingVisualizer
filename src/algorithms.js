function startingNodeGraph(){
    let nGraph = []
    for (let y = 0; y < 22; y++){
        let row = []
        for (let x = 0; x < 41; x++){
            row.push(0)
        }
        nGraph.push(row)
    }
    nGraph[5][20] = 1
    nGraph[16][20] = 2
    return nGraph
}

function startingWeightGraph(){
    let wGraph = []
    for (let y = 0; y < 22; y++){
        let row = []
        for (let x = 0; x < 41; x++){
            row.push(1)
        }
        wGraph.push(row)
    }
    return wGraph
}

function randomizeWeights(){
    let wGraph = []
    for (let y = 0; y < 22; y++){
        let row = []
        for (let x = 0; x < 41; x++){
            row.push(Math.ceil(Math.random() * 9))
        }
        wGraph.push(row)
    }
    return wGraph
}

function find(nodeGraph, target){
    for (let y = 0; y < nodeGraph.length; y++){
        if (nodeGraph[y].includes(target)){
            for (let x = 0; x < nodeGraph[y].length; x++){
                if (nodeGraph[y][x] === target){
                    return `${x},${y}`
                }
            }
        }
    }
}

function clear(nodeGraph, statusArr){
    let newNodeGraph = nodeGraph
    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (statusArr.includes(nodeGraph[y][x])){
                newNodeGraph[y][x] = 0
            }
        }
    }
    return newNodeGraph
}

export {startingNodeGraph,
        startingWeightGraph,
        randomizeWeights,
        find,
        clear
    }