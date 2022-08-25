import { find, findNeighbours } from "./algorithms"

/*
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
        if (counter > 1000) break
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
}*/

function getRandom(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function divide(nodeArr, animateOrder, xRange, yRange, passArr){
    //includes two walls
    let width = 1 + (xRange[1] - xRange[0])
    let height = 1 + (yRange[1] - yRange[0])

    if (height < 5 || width < 5) return

    let vertical = (width > height)

    if (vertical){
        let x = getRandom(xRange[0] + 2, xRange[1] - 2)
        let randPass = getRandom(yRange[0] + 1, yRange[1] - 1)

        for (let y = yRange[0] + 1; y < yRange[1]; y++){
            if (passArr.includes(`${x},${y}`)) continue
            if (y !== randPass) animateOrder.push([x, y])
        }

        for (const n of findNeighbours(x, randPass, nodeArr)){
            passArr.push(n)
        }

        divide(nodeArr, animateOrder, [xRange[0], x], yRange, passArr)
        divide(nodeArr, animateOrder, [x, xRange[1]], yRange, passArr)
    } else {
        let y = getRandom(yRange[0] + 2, yRange[1] - 2)
        let randPass = getRandom(xRange[0] + 1, xRange[1] - 1)

        for (let x = xRange[0] + 1; x < xRange[1]; x++){
            if (passArr.includes(`${x},${y}`)) continue
            if (x !== randPass) animateOrder.push([x, y])
        }

        for (const n of findNeighbours(randPass, y, nodeArr)){
            passArr.push(n)
        }

        divide(nodeArr, animateOrder, xRange, [yRange[0], y], passArr)
        divide(nodeArr, animateOrder, xRange, [y, yRange[1]], passArr)
    }
}



function auxDivide(nodeGraph){
    let animateOrder = []
    let newNodeGraph = nodeGraph
    let nodeArr = []
    let passArr = []

    for (let y = 0; y < nodeGraph.length; y++){
        for (let x = 0; x < nodeGraph[y].length; x++){
            let coords = `${x},${y}`
            nodeArr.push(coords)
        }
    }

    for (let x= 0; x < 41; x++){
        animateOrder.push([x, 0])
        animateOrder.push([x, 21])
    }
    for (let y= 1; y < 21; y++){
        animateOrder.push([0, y])
        animateOrder.push([40, y])
    }
    let node = find(nodeGraph, 1)
    for (let i = 0; i < 2; i++){
        passArr.push(node)
        let [x, y] = node.split(',')
        for (const n of findNeighbours(x, y, nodeArr)){
            passArr.push(n)
        }
        node = find(nodeGraph, 2)
    }

    divide(nodeArr, animateOrder, [0, 40], [0, 21], passArr)

    for (let i = 0; i < animateOrder.length; i++){
        let node = animateOrder[i]
        newNodeGraph[node[1]][node[0]] = -1
        //setTimeout(() => document.getElementById(`${node[0]},${node[1]}`).style.backgroundColor = "red", 1000 + i*80)
    }
    
    return newNodeGraph
}

export {auxDivide}