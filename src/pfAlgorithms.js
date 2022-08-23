import {find} from "./algorithms"

function updateScreen(animate, order, setPathFound, setAnimating){
    setAnimating(true)
    let color = ["#7E05FF", "#FBFF00"]

    for (let i = 0; i < order[0].length; i++){
        let delay = animate ? i : 0
        setTimeout(() => document.getElementById(order[0][i]).style.backgroundColor = color[order[1][i] - 5], delay * 8)
    }
    
    if (animate){
        setTimeout(() => setPathFound(true), (order[0].length - 1) * 8)
        setTimeout(() => setAnimating(false), (order[0].length - 1) * 8)
    } else {
        setPathFound(true)
        setAnimating(false)
    }
}

/*---------------- AUXILIARY FUNCTIONS ----------------*/

function findNeighbours(x, y, nodeArr){
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
    for (let i=1; i< nodeArr.length; i++){
        if (dist[nodeArr[i]] < dist[smallest]){
            smallest = nodeArr[i]
        }
    }
    return smallest
}

function heuristic(node, target){
    let nodeCoords = node.split(',')
    let targetCoords = target.split(',')
    return Math.abs(nodeCoords[0] - targetCoords[0]) + Math.abs(nodeCoords[1] - targetCoords[1])
}

function closest(queue, target){
    let closest = queue[0]
    for (let i = 1; i < queue.length; i++){
        if (heuristic(closest, target) > heuristic(queue[i], target)){
            closest = queue[i]
        }
    }
    return closest
}

//initalizes commonly used variables and structures in multiple functions
function initializeVariables(nodeGraph){
    return [find(nodeGraph, 1), find(nodeGraph, 2), [[], []]]
}
function initializeStructures(nodeGraph, dictValues){
    let nodeArr = []
    let dict1 = {}
    let dict2 = {}
    let [value1, value2] = dictValues

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (nodeGraph[y][x] !== -1) {
                let coords = `${x},${y}`
                dict1[coords] = value1
                dict2[coords] = value2
                nodeArr.push(coords)
            }
        }
    }

    return [nodeArr, dict1, dict2]
}

//TODO: REWORK
function foundPath(weightGraph, prev, stateArr, end){
    let sequence = []
    let target = end
    let cost = 0
    let foundOrder = [[], []]

    while (target) {
        sequence.unshift(target)
        target = prev[target]
    }

    for (let i = 1; i < sequence.length - 1; i++){
        let [x, y] = sequence[i].split(',')
        cost += weightGraph[parseInt(y)][parseInt(x)]
        foundOrder[0].push(sequence[i])
        foundOrder[1].push(stateArr[1])
    }

    return [cost, foundOrder]
}

/*---------------- PATH FINDING ALGORITHMS ----------------*/

function updated_dijkstra_aStar(nodeGraph, weightGraph, stateArr, useHeuristic){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [nodeArr, dist, prev] = initializeStructures(nodeGraph, [Infinity, undefined])
    let newNodeGraph = nodeGraph
    dist[start] = 0

    while (nodeArr.length > 0){
        let node = smallestDist(dist, nodeArr)
        let [x, y] = node.split(',')

        if (node === end){
            let [cost, foundOrder] = foundPath(weightGraph, prev, stateArr, end)
            for (let i = 0; i < foundOrder[0].length; i++){
                let [pX, pY] = foundOrder[0][i].split(',')
                animateOrder[0].push(foundOrder[0][i])
                animateOrder[1].push(foundOrder[1][i])
                newNodeGraph[parseInt(pY)][parseInt(pX)] = stateArr[1]
            }
            return [newNodeGraph, animateOrder, cost]
        }

        if (node !== start) {
            animateOrder[0].push(node)
            animateOrder[1].push(stateArr[0])
            newNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
        }
    
        nodeArr.splice(nodeArr.indexOf(node), 1)

        for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
            let [nX, nY] = neighbour.split(',')
            let tempDist = dist[node] + weightGraph[parseInt(nY)][parseInt(nX)]
            if (useHeuristic) tempDist += heuristic(neighbour, end)

            if (tempDist < dist[neighbour] && dist[node] !== Infinity){
                dist[neighbour] = tempDist
                prev[neighbour] = node
            }
        }
    }
}

function depthFirst(nodeGraph, weightGraph, stateArr){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [nodeArr, visited, prev] = initializeStructures(nodeGraph, [false, undefined])
    let newNodeGraph = nodeGraph
    
    let queue = [start]
    let previousNode = undefined

    while (queue.length !== 0){
        let node = queue.pop() 
        let [x, y] = node.split(',')
        prev[node] = previousNode

        if (node === end){
            let [cost, foundOrder] = foundPath(weightGraph, prev, stateArr, end)
            for (let i = 0; i < foundOrder[0].length; i++){
                let [pX, pY] = foundOrder[0][i].split(',')
                animateOrder[0].push(foundOrder[0][i])
                animateOrder[1].push(foundOrder[1][i])
                newNodeGraph[parseInt(pY)][parseInt(pX)] = stateArr[1]
            }
            return [newNodeGraph, animateOrder, cost]
        }

        if (!visited[node]){
            visited[node] = true

            if (node !== start){
                newNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
                animateOrder[0].push(node)
                animateOrder[1].push(stateArr[0])
            }

            previousNode = node
            for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
                if (!visited[neighbour]) queue.push(neighbour)
            }
        }
    }
}

function breadthFirst(nodeGraph, weightGraph, stateArr){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [nodeArr, visited, prev] = initializeStructures(nodeGraph, [false, undefined])
    let newNodeGraph = nodeGraph
    let queue = [start]

    while (queue.length !== 0){
        let node = queue.shift() 
        let [x, y] = node.split(',')

        for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
            if (visited[neighbour]) prev[node] = neighbour
            if (neighbour === start) prev[node] = neighbour
        }

        if (node === end){
            let [cost, foundOrder] = foundPath(weightGraph, prev, stateArr, end)
            for (let i = 0; i < foundOrder[0].length; i++){
                let [pX, pY] = foundOrder[0][i].split(',')
                animateOrder[0].push(foundOrder[0][i])
                animateOrder[1].push(foundOrder[1][i])
                newNodeGraph[parseInt(pY)][parseInt(pX)] = stateArr[1]
            }
            return [newNodeGraph, animateOrder, cost]
        }

        if (!visited[node]){
            visited[node] = true

            if (node !== start){
                newNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
                animateOrder[0].push(node)
                animateOrder[1].push(stateArr[0])
            }

            for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
                if (!visited[neighbour]) queue.push(neighbour)
            }
        }
    }
}

function greedyBestFirst(nodeGraph, weightGraph, stateArr){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [nodeArr, visited, prev] = initializeStructures(nodeGraph, [false, undefined])
    let newNodeGraph = nodeGraph
    let queue = [start]
    let previousNode = undefined

    while(queue){
        let node = closest(queue, end)
        visited[node] = true
        prev[node] = previousNode
        let [x, y] = node.split(',')
        queue.splice(queue.indexOf(node), 1)

        if (node === end) {
            let [cost, foundOrder] = foundPath(weightGraph, prev, stateArr, end)
            for (let i = 0; i < foundOrder[0].length; i++){
                let [pX, pY] = foundOrder[0][i].split(',')
                animateOrder[0].push(foundOrder[0][i])
                animateOrder[1].push(foundOrder[1][i])
                newNodeGraph[parseInt(pY)][parseInt(pX)] = stateArr[1]
            }
            return [newNodeGraph, animateOrder, cost]
        }

        if (node !== start){
            newNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
            animateOrder[0].push(node)
            animateOrder[1].push(stateArr[0])
        } 

        previousNode = node
        for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
            if (!visited[neighbour]) queue.push(neighbour)
        }
    }
}

export {updated_dijkstra_aStar, depthFirst, breadthFirst, updateScreen, greedyBestFirst}