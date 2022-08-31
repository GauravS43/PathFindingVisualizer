import { find, findNeighbours } from "./generalAlgo"

//auxiliary function used in recursive divison
function getRandom(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/*---------------- MAZE GENERATION ALGORITHMS ----------------*/
function randomDFS(nodeGraph){
    let queue = ["0,0"]
    let nodeArr = []
    let visited = {}
    let newNodeGraph = nodeGraph

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            let coords = `${x},${y}`
            visited[coords] = false
            nodeArr.push(coords)
        }
    }
    let counter = 0
    while (queue){
        counter++
        if (counter > 2000) break
        let node = queue.shift()
        let [x, y] = node.split(',')

        newNodeGraph[parseInt(y)][parseInt(x)] = -1


        let neighbours = findNeighbours(parseInt(x), parseInt(y), nodeArr)
        let nextNodes = []

        for (const n of neighbours){
            if (!visited[n]) nextNodes.push(n)
        }
        if (nextNodes) queue.push(nextNodes[Math.floor(Math.random() * nextNodes.length)])
    }

    return newNodeGraph
}

function divide(nodeArr, animateOrder, xRange, yRange, passArr, bias){
    //includes walls on left and right
    //more bias[0] = more vertical divides, more bias[1] is the opposite
    let width = 1 + (xRange[1] - xRange[0])
    let height = 1 + (yRange[1] - yRange[0])

    if (height < 5 || width < 5) return

    let vertical = (bias[0] * width > bias[1] * height)

    if (vertical){
        let x = getRandom(xRange[0] + 2, xRange[1] - 2)
        let randPass = getRandom(yRange[0] + 1, yRange[1] - 1)

        for (let y = yRange[0] + 1; y < yRange[1]; y++){
            //skips if wall is next to a pass
            if (passArr.includes(`${x},${y}`)) continue 
            if (y !== randPass) animateOrder.push([x, y])
        }

        for (const n of findNeighbours(x, randPass, nodeArr)){
            passArr.push(n)
        }

        divide(nodeArr, animateOrder, [xRange[0], x], yRange, passArr, bias)
        divide(nodeArr, animateOrder, [x, xRange[1]], yRange, passArr, bias)
    } else {
        let y = getRandom(yRange[0] + 2, yRange[1] - 2)
        let randPass = getRandom(xRange[0] + 1, xRange[1] - 1)

        for (let x = xRange[0] + 1; x < xRange[1]; x++){
            //skips if wall is next to a pass
            if (passArr.includes(`${x},${y}`)) continue
            if (x !== randPass) animateOrder.push([x, y])
        }

        for (const n of findNeighbours(randPass, y, nodeArr)){
            passArr.push(n)
        }

        divide(nodeArr, animateOrder, xRange, [yRange[0], y], passArr, bias)
        divide(nodeArr, animateOrder, xRange, [y, yRange[1]], passArr, bias)
    }
}

function auxDivide(nodeGraph, bias){
    let animateOrder = [[], []]
    let newNodeGraph = nodeGraph
    let nodeArr = []
    let passArr = []

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            let coords = `${x},${y}`
            nodeArr.push(coords)
        }
    }

    //makes border walls
    for (let x= 0; x < 41; x++){
        animateOrder[0].push([x, 0])
        animateOrder[0].push([x, 21])
    }
    for (let y= 1; y < 21; y++){
        animateOrder[0].push([0, y])
        animateOrder[0].push([40, y])
    }

    //prevents walls from surrounding start and end nodes
    let node = find(nodeGraph, 1)
    for (let i = 0; i < 2; i++){
        passArr.push(node)
        let [x, y] = node.split(',')
        for (const n of findNeighbours(x, y, nodeArr)){
            passArr.push(n)
        }
        node = find(nodeGraph, 2)
    }

    divide(nodeArr, animateOrder[0], [0, 40], [0, 21], passArr, bias)

    for (let i = 0; i < animateOrder[0].length; i++){
        let node = animateOrder[0][i]
        animateOrder[1].push(7)
        newNodeGraph[node[1]][node[0]] = 7
    }
    
    return [newNodeGraph, animateOrder]
}

export {auxDivide,
        randomDFS}