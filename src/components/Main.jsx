import { useEffect, useState } from "react";
import FilterPanel from "./FilterPanel";
import GraphLayer from "./charts/Layer";
import { buildGraph } from "../lib/buildGraph";

export default function Main() {
    const [graph, setGraph] = useState(null);

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        buildGraph({ width, height }).then(setGraph);
    }, []);

    return (
        <>
            <FilterPanel />
            <GraphLayer
                nodes={graph?.nodes ?? null}
                links={graph?.links ?? null}
            />
        </>
    );
}
