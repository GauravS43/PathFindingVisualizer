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

function foundPath(prev, end, checked){
    let sequence = []
    let target = end
    while (target) {
        sequence.unshift(target)
        target = prev[target]
        console.log(prev[target])
    }

    for (let i = 0; i<sequence.length; i++){
        setTimeout(() => document.getElementById(sequence[i]).style.backgroundColor = "yellow", checked * 100)

    }
}

function dijkstra(end){ 
    var dist = {}
    var prev = {}
    let graphWithCoords = []
    for (let y = 0; y < 10; y++){
        for (let x = 0; x < 10; x++){
            let coords = x.toString().concat(",", y.toString())
            dist[coords] = Infinity
            prev[coords] = undefined
            graphWithCoords.push(coords)
        }
    }

    dist["0,2"] = 0
    let Viewed = []
    let checked = 0

    while (graphWithCoords.length > 0){
        let u = smallestDist(dist, graphWithCoords)
        checked++
        Viewed.push(u)
        if (u === end){
            foundPath(prev, end, checked)
            break
        }
        setTimeout(() => document.getElementById(u).style.backgroundColor = "red",  (100 - graphWithCoords.length) * 100)
    
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
    console.log("ran fully")
}

export {dijkstra}