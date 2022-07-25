import {useState, useEffect, useRef, useMemo, useLayoutEffect, useCallback} from "react";
import styles from './TheWorld.module.css'
import * as d3 from 'd3'
import * as topojson from "topojson-client";
import useResizeObserver from "../hooks/useResizeObserver.js";
import {useMachine} from "@xstate/react";
import mapMachine from "../machines/mapMachine.js";
import Paths from "./Paths";

const projection = d3.geoMercator()
    .center([0, 60])


const TheWorld = () => {

    let [mapJson, setMapJson] = useState(null)
    const svgRef = useRef(null)
    const groupRef = useRef(null)
    const wrapperRef = useRef(null)
    const backgroundRef = useRef(null)
    const [path, setPath] = useState(() => d3.geoPath(projection))
    const [{context, value}, send] = useMachine(mapMachine)

    const width = 960
    const height = 710


    useEffect(() => {
        if (!mapJson || !context.selectedCountryId) return
        const feature = mapJson.features.find(x => x.id === context.selectedCountryId)

        var bounds = path.bounds(feature),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(20, 1 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        console.log(d3.zoomTransform(svgRef.current))


        d3.select(svgRef.current).transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale)); // updated for d3 v4
    }, [context, width, height])

    useEffect(() => {
        if (value !== 'highlighted') return;

        const exitHighlightState = () => {
            const svg = d3.select(svgRef.current)

            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity.translate(context.previousZoom.x, context.previousZoom.y).scale(context.previousZoom.k)

            );



            send('EXIT_HIGHLIGHT')
        }

        window.addEventListener('keydown', exitHighlightState)

        return () => {
            window.removeEventListener('keydown', exitHighlightState)
        }
    }, [value])

    //Calling zoom
    useEffect(() => {
        if (!svgRef.current) return;
        d3.select(svgRef.current).call(zoom);

    }, [svgRef.current])


    //Getting TopoJson and converting it to GeoJson
    useEffect(() => {
        d3.json("https://unpkg.com/world-atlas@2.0.2/countries-50m.json")
            .then(data => setMapJson(topojson.feature(data, data.objects.countries)))
    }, []);


    const zoom = d3.zoom()
        .scaleExtent([1, 20])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', zoomed);

    // Zoom handler
    function zoomed(event) {
        groupRef.current.setAttribute('transform', event.transform)
        backgroundRef.current.setAttribute('transform', event.transform)
    }

    if (mapJson){
        projection.fitSize([width, height], mapJson)
    }


    const pathClicked = useCallback((feature) => () => {
        send({type: 'SELECT_COUNTRY', payload: feature.id, previousZoom: d3.zoomTransform(svgRef.current)})
    }, [])

    return <div ref={wrapperRef}>
            <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`}  className={styles.svg}>
               <rect ref={backgroundRef} width={width} height={height} className={styles.background} onClick={() => send('EXIT_HIGHLIGHT')}/>
                <g ref={groupRef}>
                    {mapJson ? <Paths features={mapJson?.features} path={path} clickHandler={pathClicked} /> : null}
                </g>
            </svg>
        </div>

}

export default TheWorld;