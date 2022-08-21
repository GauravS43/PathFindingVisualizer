import React from "react"

const NodeGraphContext = React.createContext()
const WeightGraphContext = React.createContext()

//NODE STATUS:
//-1 = wall
//0 = nothing
//1 = start
//2 = end
//3 = viewed
//4 = path
//5 = animated viewed
//6 = animated path

//TODO
//Add error messages if start or end node doesn't exist or if path is impossible
//Add more algorithms 
//Change Animations and timing for graph being filled in
//Add mazes and maze algorithms
//Add additional goals

export {NodeGraphContext, WeightGraphContext}