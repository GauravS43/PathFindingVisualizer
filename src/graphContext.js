import React from "react"

const NodeGraphContext = React.createContext()
const WeightGraphContext = React.createContext()

//NODE GRAPH LEGEND:
//-1 = wall
// 0 = nothing
// 1 = start
// 2 = end
// 3 = viewed
// 4 = path
// 5 = animated viewed
// 6 = animated path
// 7 = animated wall

//TODO
//ADD MORE MAZE GENERATING ALGORITHMS
//ADD MORE PATH FINDING ALGORITHMS

export {NodeGraphContext, WeightGraphContext}