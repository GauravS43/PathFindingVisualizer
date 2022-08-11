/*function setNodeState(nodeGraph, nodeX, nodeY, state){
    let newNodeGraph = nodeGraph
    newNodeGraph[nodeY][nodeX] = state
    return newNodeGraph
}*/

function start(nodeGraph){
    for (let y = 0; y < 10; y++){
        if (nodeGraph[y].includes(1)){
            for (let x = 0; x < 10; x++){
                if (nodeGraph[y][x] === 1){
                    return `${x},${y}`
                }
            }
        }
    }
}

function end(nodeGraph){
    for (let y = 0; y < 10; y++){
        if (nodeGraph[y].includes(2)){
            for (let x = 0; x < 10; x++){
                if (nodeGraph[y][x] === 2){
                    return `${x},${y}`
                }
            }
        }
    }
}


function Neighbours(x, y, graph){
    let neighbours = [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]]
    neighbours = neighbours.map(coords => coords[0].toString().concat(",", coords[1].toString()))
    let results = []
    for (let i = 0; i < 4; i++){
        if (graph.includes(neighbours[i])){
            results.push(neighbours[i])
        } 
    }
    return results
}

function smallestDist(dist, graph){
    let smallest = graph[0]
    for (let i=0; i< graph.length; i++){
        if (dist[graph[i]] < dist[smallest]){
            smallest = graph[i]
        }
    }
    return smallest
}

function foundPath(prev, end, checked, tempNodeGraph){
    let sequence = []
    let target = end
    while (target) {
        sequence.unshift(target)
        target = prev[target]
    }

    for (let i = 1; i < sequence.length - 1; i++){
        setTimeout(() => document.getElementById(sequence[i]).style.backgroundColor = "yellow", checked * 100)
        tempNodeGraph[parseInt(sequence[i][2])][parseInt(sequence[i][0])] = 4
    }
}

function dijkstra(start, end, nodeGraph){ 
    var dist = {}
    var prev = {}
    let graphWithCoords = []
    for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
            if (nodeGraph[y][x] !== -1) {
                let coords = `${x},${y}`
                dist[coords] = Infinity
                prev[coords] = undefined
                graphWithCoords.push(coords)
            }
        }
    }

    let tempNodeGraph = nodeGraph

    dist[start] = 0
    let Viewed = []
    let checked = 0
    let first = smallestDist(dist, graphWithCoords)

    while (graphWithCoords.length > 0){
        let u = smallestDist(dist, graphWithCoords)
        checked++
        Viewed.push(u)
        if (u === end){
            foundPath(prev, end, checked, tempNodeGraph)
            break
        }
        if (u !== first) {
            tempNodeGraph[parseInt(u[2])][parseInt(u[0])] = 3
            setTimeout(() =>  document.getElementById(u).style.backgroundColor = "red",  (100 - graphWithCoords.length) * 100)        
        }
    
        graphWithCoords.splice(graphWithCoords.indexOf(u), 1)
        let neighbours = Neighbours(parseInt(u[0]), parseInt(u[2]), graphWithCoords)
        for (let i = 0; i < neighbours.length; i++){
            let neighbour = neighbours[i]
            let tempDist = dist[u] +  1 //calcDist(u, neighbour)
            if (tempDist < dist[neighbour] && dist[u] !== Infinity){
                dist[neighbour] = tempDist
                prev[neighbour] = u
            }
        }
    }
    return tempNodeGraph
}

function refresh(nodeGraph){
    let newNodeGraph = nodeGraph
    for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
            if (nodeGraph[y][x] > 2){
                newNodeGraph[y][x] = 0
            }
        }
    }
    return newNodeGraph
}

export {dijkstra, refresh, start, end}