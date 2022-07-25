import React, {useEffect} from "react";

const Paths = ({features, path, clickHandler}) => {


    return features?.map((feature, i) => <path onClick={clickHandler(feature)} key={i}  d={path(feature)} />)
}

export  default React.memo(Paths)