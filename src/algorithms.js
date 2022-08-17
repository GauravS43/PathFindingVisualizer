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

function Neighbours(x, y, nodeArr){
    let neighbours = [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]]
    neighbours = neighbours.map(coords => `${coords[0]},${coords[1]}`)
    let results = []
    for (let i = 0; i < 4; i++){
        if (nodeArr.includes(neighbours[i])){
            results.push(neighbours[i])
        } 
    }
    return results
}

function smallestDist(dist, nodeArr){
    let smallest = nodeArr[0]
    for (let i=0; i< nodeArr.length; i++){
        if (dist[nodeArr[i]] < dist[smallest]){
            smallest = nodeArr[i]
        }
    }
    return smallest
}

function foundPath(prev, end, tempNodeGraph, updatePathFound, updateSearching){
    let sequence = []
    let target = end
    while (target) {
        sequence.unshift(target)
        target = prev[target]
    }

    for (let i = 1; i < sequence.length - 1; i++){
        let pos = sequence[i].split(',')
        document.getElementById(sequence[i]).style.backgroundColor = "#FBFF00"
        tempNodeGraph[parseInt(pos[1])][parseInt(pos[0])] = 4
    }

    updatePathFound(true)
    updateSearching()
}

function heuristic(node, target){
    let nodeCoords = node.split(',')
    let targetCoords = target.split(',')
    return Math.abs(nodeCoords[0] - targetCoords[0]) + Math.abs(nodeCoords[1] - targetCoords[1])
}


function dijkstra_aStar(start, end, nodeGraph, weightGraph, updatePathFound, updateSearching, useHeuristic){ 
    updateSearching()
    var dist = {}
    var prev = {}
    let nodeArr = []
    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (nodeGraph[y][x] !== -1) {
                let coords = `${x},${y}`
                dist[coords] = Infinity
                prev[coords] = undefined
                nodeArr.push(coords)
            }
        }
    }

    let tempNodeGraph = nodeGraph
    dist[start] = 0

    while (nodeArr.length > 0){
        let currentNode = smallestDist(dist, nodeArr)
        let coords = currentNode.split(',')
        if (currentNode === end){
            setTimeout(() => foundPath(prev, end, tempNodeGraph, updatePathFound, updateSearching), (902 - nodeArr.length) * 8)        
            break
        }
        if (currentNode !== start) {
            tempNodeGraph[coords[1]][parseInt(coords[0])] = 3
            setTimeout(() => document.getElementById(currentNode).style.backgroundColor = "#7E05FF", (902 - nodeArr.length) * 8)        
        }
    
        nodeArr.splice(nodeArr.indexOf(currentNode), 1)
        let neighbours = Neighbours(parseInt(coords[0]), parseInt(coords[1]), nodeArr)
        for (let i = 0; i < neighbours.length; i++){
            let neighbour = neighbours[i]
            let nCoords = neighbour.split(',')
            let tempDist = dist[currentNode] +  weightGraph[nCoords[1]][nCoords[0]]
            if (useHeuristic){
                tempDist += heuristic(neighbour, end)
            }
            if (tempDist < dist[neighbour] && dist[currentNode] !== Infinity){
                dist[neighbour] = tempDist
                prev[neighbour] = currentNode
            }
        }
    }
    return tempNodeGraph
}

function clear(nodeGraph, statuses){
    let newNodeGraph = nodeGraph
    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (statuses.includes(nodeGraph[y][x])){
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

export {dijkstra_aStar, clear, find, startingNodeGraph, startingWeightGraph, randomizeWeights}