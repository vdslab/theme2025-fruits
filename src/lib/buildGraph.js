import * as d3 from "d3-force";

export async function buildGraph({ width, height }) {
    const graphPath = "/data/knn_graph.json"
    const metaPath = "/data/cont-meta-data.csv"

    const [graph, meta] = await Promise.all([
        fetch(graphPath).then(r => r.json()),
        fetch(metaPath).then(r => r.text())
    ]);

    // ---- meta: コントID → コント名 ----
    const idToName = {};
    meta.split("\n").slice(1).forEach(line => {
        const cols = line.split(",");
        idToName[cols[1]] = cols[2];
    });

    // ---- nodeにlabelを追加 ----
    const nodes = graph.nodes.map(n => ({
        ...n,
        label: idToName[n.id] ?? n.id
    }));

    const links = graph.links.map(l => ({ ...l }));

    // ---- レイアウト計算 ----
    const sim = d3.forceSimulation(nodes)
        .force(
            "link",
            d3.forceLink(links)
                .id(d => d.id)
                .distance(d => 300 * (1 - d.weight))
        )
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .stop();

    for (let i = 0; i < 300; i++) sim.tick();

    return { nodes, links };
}
