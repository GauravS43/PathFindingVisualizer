import {find, smallestDist, findNeighbours, heuristic} from "./algorithms"

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
        let node = smallestDist(dist, nodeArr)
        let [x, y] = node.split(',')
        if (node === end){
            let sequence = []
            let target = end
            while (target) {
                sequence.unshift(target)
                target = prev[target]
            }
        
            for (let i = 1; i < sequence.length - 1; i++){
                let [cX, cY] = sequence[i].split(',')
                cost += weightGraph[parseInt(cY)][parseInt(cX)]
                animateOrder[0].push(sequence[i])
                animateOrder[1].push(stateArr[1])
                tempNodeGraph[parseInt(cY)][parseInt(cX)] = stateArr[1]
            }
            break
        }
        if (node !== start) {
            animateOrder[0].push(node)
            animateOrder[1].push(stateArr[0])
            tempNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
        }
    
        nodeArr.splice(nodeArr.indexOf(node), 1)
        let neighbours = findNeighbours(parseInt(x), parseInt(y), nodeArr)
        for (let i = 0; i < neighbours.length; i++){
            let neighbour = neighbours[i]
            let [nX, nY] = neighbour.split(',')
            let tempDist = dist[node] +  weightGraph[parseInt(nY)][parseInt(nX)]
            if (useHeuristic){
                tempDist += heuristic(neighbour, end)
            }
            if (tempDist < dist[neighbour] && dist[node] !== Infinity){
                dist[neighbour] = tempDist
                prev[neighbour] = node
            }
        }
    }

    return [tempNodeGraph, animateOrder, cost]
}

function depthFirst(nodeGraph, weightGraph, stateArr){
    let visited = {}
    let prev = {}
    let nodeArr = []
    let stack = []
    let tempNodeGraph = nodeGraph
    let cost = 0

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (nodeGraph[y][x] !== -1) {
                let coords = `${x},${y}`
                visited[coords] = false
                prev[coords] = undefined
                nodeArr.push(coords)
            }
        }
    }

    let start = find(nodeGraph, 1)
    let end = find(nodeGraph, 2)
    stack.push(start)

    let animateOrder = [[], []]
    let previousNode = undefined

    while (stack.length !== 0){
        let node = stack.pop() 
        let [x, y] = node.split(',')
        prev[node] = previousNode

        if (node === end){
            let sequence = []
            let target = end
            while (target) {
                sequence.unshift(target)
                target = prev[target]
            }
            
            for (let i = 1; i < sequence.length - 1; i++){
                let [cX, cY] = sequence[i].split(',')
                cost += weightGraph[parseInt(cY)][parseInt(cX)]
                animateOrder[0].push(sequence[i])
                animateOrder[1].push(stateArr[1])
                tempNodeGraph[parseInt(cY)][parseInt(cX)] = stateArr[1]
            }
            break
        }

        if (!visited[node]){
            visited[node] = true

            if (node !== start){
                tempNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
                animateOrder[0].push(node)
                animateOrder[1].push(stateArr[0])
            }

            let neighbours = findNeighbours(parseInt(x), parseInt(y), nodeArr)
            for (const neighbour of neighbours){
                if (!visited[neighbour]) stack.push(neighbour)
            }
            previousNode = node
        }
    }

    return [tempNodeGraph, animateOrder, cost]
}

function breadthFirst(nodeGraph, weightGraph, stateArr){
    let visited = {}
    let prev = {}
    let nodeArr = []
    let stack = []
    let tempNodeGraph = nodeGraph
    let cost = 0

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (nodeGraph[y][x] !== -1) {
                let coords = `${x},${y}`
                visited[coords] = false
                prev[coords] = undefined
                nodeArr.push(coords)
            }
        }
    }

    let start = find(nodeGraph, 1)
    let end = find(nodeGraph, 2)
    stack.push(start)

    let animateOrder = [[], []]

    while (stack.length !== 0){
        let node = stack.shift() 
        let [x, y] = node.split(',')

        for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
            if (visited[neighbour]) prev[node] = neighbour
            if (neighbour === start) prev[node] = neighbour
        }

        if (node === end){
            let sequence = []
            let target = end
            while (target) {
                sequence.unshift(target)
                target = prev[target]
            }
            
            for (let i = 1; i < sequence.length - 1; i++){
                let [cX, cY] = sequence[i].split(',')
                cost += weightGraph[parseInt(cY)][parseInt(cX)]
                animateOrder[0].push(sequence[i])
                animateOrder[1].push(stateArr[1])
                tempNodeGraph[parseInt(cY)][parseInt(cX)] = stateArr[1]
            }
            break
        }

        if (!visited[node]){
            visited[node] = true

            if (node !== start){
                tempNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
                animateOrder[0].push(node)
                animateOrder[1].push(stateArr[0])
            }

            let neighbours = findNeighbours(parseInt(x), parseInt(y), nodeArr)
            for (const neighbour of neighbours){
                if (!visited[neighbour]) stack.push(neighbour)
            }
        }
    }

    return [tempNodeGraph, animateOrder, cost]
}

function greedyBestFirst(nodeGraph, weightGraph, stateArr){
    let queue = []
    let start = find(nodeGraph, 1)
    let end = find(nodeGraph, 2)
    let tempNodeGraph = nodeGraph

    let nodeArr = []
    let visited = {}
    let prev = {}
    let animateOrder = [[], []]
    let cost = 0

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (nodeGraph[y][x] !== -1) {
                let coords = `${x},${y}`
                prev[coords] = undefined
                visited[coords] = false
                nodeArr.push(coords)
            }
        }
    }

    let previousNode = undefined
    queue.push(start)
    while(queue){
        let node = closest(queue, end)
        visited[node] = true
        prev[node] = previousNode
        let [x, y] = node.split(',')
        queue.splice(queue.indexOf(node), 1)

        if (node === end) {
            let sequence = []
            let target = end
            while (target) {
                sequence.unshift(target)
                target = prev[target]
            }
            console.log(sequence)
            for (let i = 1; i < sequence.length - 1; i++){
                let [cX, cY] = sequence[i].split(',')
                cost += weightGraph[parseInt(cY)][parseInt(cX)]
                animateOrder[0].push(sequence[i])
                animateOrder[1].push(stateArr[1])
                tempNodeGraph[parseInt(cY)][parseInt(cX)] = stateArr[1]
            }
            return [tempNodeGraph, animateOrder, cost]
        }

        if (node !== start){
            tempNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
            animateOrder[0].push(node)
            animateOrder[1].push(stateArr[0])
        } 

        let neighbours = findNeighbours(parseInt(x), parseInt(y), nodeArr)
        previousNode = node
        for (const neighbour of neighbours){
            if (!visited[neighbour]){
                queue.push(neighbour)
            }
        }
    }
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

export {updated_dijkstra_aStar, depthFirst, breadthFirst, updateScreen, greedyBestFirst}