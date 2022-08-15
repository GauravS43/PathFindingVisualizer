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

function Neighbours(x, y, graph){
    let neighbours = [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]]
    neighbours = neighbours.map(coords => `${coords[0]},${coords[1]}`)
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
        let pos = sequence[i].split(',')
        setTimeout(() => document.getElementById(sequence[i]).style.backgroundColor = "yellow", 1)//checked * 100)
        tempNodeGraph[parseInt(pos[1])][parseInt(pos[0])] = 4
    }
}

function dijkstra(start, end, nodeGraph){ 
    var dist = {}
    var prev = {}
    let graphWithCoords = []
    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
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
        let pos = u.split(',')
        checked++
        Viewed.push(u)
        if (u === end){
            foundPath(prev, end, checked, tempNodeGraph)
            break
        }
        if (u !== first) {
            tempNodeGraph[pos[1]][parseInt(pos[0])] = 3
            setTimeout(() =>  document.getElementById(u).style.backgroundColor = "red", 1)//(400 - graphWithCoords.length) * 100)        
        }
    
        graphWithCoords.splice(graphWithCoords.indexOf(u), 1)
        let neighbours = Neighbours(parseInt(pos[0]), parseInt(pos[1]), graphWithCoords)
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

function clear(nodeGraph){
    let newNodeGraph = nodeGraph
    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (nodeGraph[y][x] > 2 || nodeGraph[y][x] < 0){
                newNodeGraph[y][x] = 0
            }
        }
    }
    return newNodeGraph
}

    //TODO need to change
    //-1 = wall
    //0 = nothing
    //1 = start
    //2 = end
    //3 = viewed
    //4 = path
function startingGraph(){
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


export {dijkstra, clear, find, startingGraph}