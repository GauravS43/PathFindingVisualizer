import React from "react"

const NodeGraphContext = React.createContext()
const WeightGraphContext = React.createContext()

//NODE STATUS:
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
//Add error messages if start or end node doesn't exist or if path is impossible
//Add mazes and maze algorithms
//ERRORs when adding walls to depth first and greedy

export {NodeGraphContext, WeightGraphContext}