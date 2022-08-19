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
//5 = animatingViewed
//6 = animatingPath

export {NodeGraphContext, WeightGraphContext}