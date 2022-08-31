import { find, findNeighbours } from "./generalAlgo"

//auxiliary function used to change background color for statuses 5,6,7
function updateScreen(order, setPathFound, setAnimating, delay){
    setAnimating(true)
    let color = ["#7E05FF", "#FBFF00", "#96ADE9"]

    for (let i = 0; i < order[0].length; i++){
        setTimeout(() => document.getElementById(order[0][i]).style.backgroundColor = color[order[1][i] - 5], i * delay)
    }
    
    setTimeout(
        function(){
            setPathFound(true)
            setAnimating(false)
        }, (order[0].length - 1) * delay
    )
}

/*---------------- AUXILIARY FUNCTIONS ----------------*/

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
function initializeStructures(nodeGraph, numOfDicts, dictValues){
    let nodeArr = []
    let dictArr = []

    for (let i = 0; i < numOfDicts; i++){
        dictArr[i] = {}
    }

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            if (nodeGraph[y][x] !== -1 && nodeGraph[y][x] !== 7) {
                let coords = `${x},${y}`
                nodeArr.push(coords)
                for (let i = 0; i < numOfDicts; i++){
                    dictArr[i][coords] = dictValues[i]
                }
            }
        }
    }

    return [nodeArr, dictArr]
}

function foundPath(weightGraph, prev, end, includeEnd = false){
    let sequence = []
    let target = end
    let cost = 0
    let foundOrder = []

    while (target) {
        sequence.unshift(target)
        target = prev[target]
    }

    let limit = includeEnd ? sequence.length : sequence.length - 1

    for (let i = 1; i < limit; i++){
        let [x, y] = sequence[i].split(',')
        cost += weightGraph[parseInt(y)][parseInt(x)]
        foundOrder.push(sequence[i])
    }

    return [cost, foundOrder]
}

/*---------------- PATH FINDING ALGORITHMS ----------------*/

function dijkstra_aStar(nodeGraph, weightGraph, stateArr, useHeuristic){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [nodeArr, [dist, prev]] = initializeStructures(nodeGraph, 2, [Infinity, undefined])
    let newNodeGraph = nodeGraph
    dist[start] = 0

    while (nodeArr.length > 0){
        let node = smallestDist(dist, nodeArr)
        //All possible paths traversed
        if (dist[node] === Infinity) break

        let [x, y] = node.split(',')

        if (node !== start) {
            animateOrder[0].push(node)
            animateOrder[1].push(stateArr[0])
            newNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
        }
    
        nodeArr.splice(nodeArr.indexOf(node), 1)

        for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
            if (neighbour === end){
                prev[neighbour] = node
                let [cost, foundOrder] = foundPath(weightGraph, prev, end)
                for (let i = 0; i < foundOrder.length; i++){
                    let [pX, pY] = foundOrder[i].split(',')
                    animateOrder[0].push(foundOrder[i])
                    animateOrder[1].push(stateArr[1])
                    newNodeGraph[parseInt(pY)][parseInt(pX)] = stateArr[1]
                }
                return [newNodeGraph, animateOrder, cost]
            }

            let [nX, nY] = neighbour.split(',')
            let tempDist = dist[node] + weightGraph[parseInt(nY)][parseInt(nX)]
            //A Star algorithm includes heuristic, dijkstra does not
            if (useHeuristic) tempDist += heuristic(neighbour, end)

            if (tempDist < dist[neighbour] && dist[node] !== Infinity){
                dist[neighbour] = tempDist
                prev[neighbour] = node
            }
        }
    }
    //only called if path not found
    return [newNodeGraph, animateOrder, -1]
}

function bidirectional_dijkstra_aStar(nodeGraph, weightGraph, stateArr, useHeuristic){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [startingNodeArr, [distFromStart, distFromEnd, prev]] = initializeStructures(nodeGraph, 3, [Infinity, Infinity, undefined])
    let newNodeGraph = nodeGraph
    let endingNodeArr = [...startingNodeArr]

    distFromStart[start] = 0
    distFromEnd[end] = 0
   
    //2 distArrs and nodeArrs for seperate searches
    let distArr = [distFromStart, distFromEnd]
    let nodeArrs = [startingNodeArr, endingNodeArr]
    let arrInd = 0

    while (startingNodeArr.length > 0){
        let node = smallestDist(distArr[arrInd], nodeArrs[arrInd])
        //All possible paths traversed
        if (distArr[arrInd][node] === Infinity) break
        let [x, y] = node.split(',')

        if (node !== start && node !== end) {
            animateOrder[0].push(node)
            animateOrder[1].push(stateArr[0])
            newNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
        }

        nodeArrs[arrInd].splice(nodeArrs[arrInd].indexOf(node), 1)

        for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArrs[arrInd])){
            //found connection between searches
            if (startingNodeArr.includes(neighbour) !== endingNodeArr.includes(neighbour)){
                for (const n of findNeighbours(parseInt(x), parseInt(y), nodeArrs[(arrInd === 0) ? 1 : 0])){
                    if (!nodeArrs[arrInd].includes(n)){
                        //backtracks from current node
                        let [cost, foundOrder] = foundPath(weightGraph, prev, node, true)
                        //backtracks from the visited neighbour
                        let [addCost, addOrder] = foundPath(weightGraph, prev, n, true)
                        
                        let order = [...foundOrder, ...addOrder]
                        cost += addCost 

                        //makes changes using both backtracks
                        for (let i = 0; i < order.length; i++){
                            let [pX, pY] = order[i].split(',')
                            animateOrder[0].push(order[i])
                            animateOrder[1].push(stateArr[1])
                            newNodeGraph[parseInt(pY)][parseInt(pX)] = stateArr[1]
                        }
                        return [newNodeGraph, animateOrder, cost]
                    }
                }
            }

            let [nX, nY] = neighbour.split(',')
            let tempDist = distArr[arrInd][node] + weightGraph[parseInt(nY)][parseInt(nX)]
            //A Star algorithm includes heuristic, dijkstra does not
            if (useHeuristic) tempDist += heuristic(neighbour, (arrInd === 0) ? end : start)

            if (tempDist < distArr[arrInd][neighbour] && distArr[arrInd][node] !== Infinity){
                distArr[arrInd][neighbour] = tempDist
                prev[neighbour] = node
            }
        }
        arrInd = (arrInd === 0) ? 1 : 0
    }
    //only called if path not found
    return [newNodeGraph, animateOrder, -1]
}

function depthFirst(nodeGraph, weightGraph, stateArr){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [nodeArr, [visited]] = initializeStructures(nodeGraph, 1, [false])
    let newNodeGraph = nodeGraph
    
    let queue = [start]

    while (queue.length !== 0){
        //.shift() would make breadthFirst
        let node = queue.pop() 
        let [x, y] = node.split(',')

        if (node === end){
            let l = animateOrder[0].length
            let cost = 0
            for (let i = 0; i < l; i++){
                let [pX, pY] = animateOrder[0][i].split(',')
                animateOrder[0].push(animateOrder[0][i])
                animateOrder[1].push(stateArr[1])
                newNodeGraph[parseInt(pY)][parseInt(pX)] = stateArr[1]
                cost += weightGraph[parseInt(pY)][parseInt(pX)]
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
    //only called if path not found
    return [newNodeGraph, animateOrder, -1]
}

function breadthFirst(nodeGraph, weightGraph, stateArr){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [nodeArr, [visited, prev]] = initializeStructures(nodeGraph, 2, [false, undefined])
    let newNodeGraph = nodeGraph
    let queue = [start]

    while (queue.length !== 0){
        //.pop() would make depthFirst
        let node = queue.shift() 
        let [x, y] = node.split(',')

        for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
            if (visited[neighbour]) prev[node] = neighbour
        }

        if (node === end){
            let [cost, foundOrder] = foundPath(weightGraph, prev, end)
            for (let i = 0; i < foundOrder.length; i++){
                let [pX, pY] = foundOrder[i].split(',')
                animateOrder[0].push(foundOrder[i])
                animateOrder[1].push(stateArr[1])
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
    //only called if path not found
    return [newNodeGraph, animateOrder, -1]
}

function greedyBestFirst(nodeGraph, weightGraph, stateArr){
    let [start, end, animateOrder] = initializeVariables(nodeGraph) 
    let [nodeArr, [visited, prev]] = initializeStructures(nodeGraph, 2, [false, undefined])
    let newNodeGraph = nodeGraph
    let queue = [start]

    while(queue){
        let node = closest(queue, end)
        visited[node] = true
        let [x, y] = node.split(',')
        queue.splice(queue.indexOf(node), 1)

        if (node === end) {
            let [cost, foundOrder] = foundPath(weightGraph, prev, end)
            for (let i = 0; i < foundOrder.length; i++){
                let [pX, pY] = foundOrder[i].split(',')
                animateOrder[0].push(foundOrder[i])
                animateOrder[1].push(stateArr[1])
                newNodeGraph[parseInt(pY)][parseInt(pX)] = stateArr[1]
            }
            return [newNodeGraph, animateOrder, cost]
        }

        if (node !== start){
            newNodeGraph[parseInt(y)][parseInt(x)] = stateArr[0]
            animateOrder[0].push(node)
            animateOrder[1].push(stateArr[0])
        } 

        for (const neighbour of findNeighbours(parseInt(x), parseInt(y), nodeArr)){
            if (!visited[neighbour]) {
                queue.push(neighbour)
                prev[neighbour] = node
            }
        }
    }
    //only called if path not found
    return [newNodeGraph, animateOrder, -1]
}

export {dijkstra_aStar,
        bidirectional_dijkstra_aStar,
        depthFirst, 
        breadthFirst,
        greedyBestFirst,
        updateScreen,
    }