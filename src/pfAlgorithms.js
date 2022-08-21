import {find, smallestDist, Neighbours, heuristic} from "./algorithms"

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

function updated_dijkstra_aStar(nodeGraph, weightGraph, stateArr, useHeuristic){
    const start = find(nodeGraph, 1)
    const end = find(nodeGraph, 2)
    var dist = {}
    var prev = {}
    let nodeArr = []
    let animateOrder = [[],[]]
    let cost = 0

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
            let sequence = []
            let target = end
            while (target) {
                sequence.unshift(target)
                target = prev[target]
            }
        
            for (let i = 1; i < sequence.length - 1; i++){
                let pos = sequence[i].split(',')
                cost += weightGraph[parseInt(pos[1])][parseInt(pos[0])]
                animateOrder[0].push(sequence[i])
                animateOrder[1].push(stateArr[1])
                tempNodeGraph[parseInt(pos[1])][parseInt(pos[0])] = stateArr[1]
            }
            break
        }
        if (currentNode !== start) {
            animateOrder[0].push(currentNode)
            animateOrder[1].push(stateArr[0])
            tempNodeGraph[coords[1]][parseInt(coords[0])] = stateArr[0]
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

    return [tempNodeGraph, animateOrder, cost]
}

function depthFirst(nodeGraph){
    let visited = {}
    let nodeArr = []
    let stack = []
    let tempNodeGraph = nodeGraph

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (nodeGraph[y][x] !== -1) {
                let coords = `${x},${y}`
                visited[coords] = false
                nodeArr.push(coords)
            }
        }
    }

    stack.push(find(nodeGraph, 1))
    let end = find(nodeGraph, 2)

    let animateOrder = [[], []]

    while (stack.length !== 0){
        let currentNode = stack.shift() //stack.shift() and stack.pop() create different searches
        let currentCoords = currentNode.split(',')

        if (currentNode === end){
            console.log("found")
            break
        }

        if (!visited[currentNode]){
            visited[currentNode] = true
            tempNodeGraph[currentCoords[1]][parseInt(currentCoords[0])] = 5
            animateOrder[0].push(currentNode)
            animateOrder[1].push(5)

            let neighbours = Neighbours(parseInt(currentCoords[0]), parseInt(currentCoords[1]), nodeArr)
            for (const neighbour of neighbours){
                if (!visited[neighbour]) stack.push(neighbour)
            }
        }
    }

    return [tempNodeGraph, animateOrder]
}

export {updated_dijkstra_aStar, depthFirst, updateScreen}