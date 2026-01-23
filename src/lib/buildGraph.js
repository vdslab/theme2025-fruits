import * as d3 from "d3-force";

export async function buildGraph({ width, height }) {
    const graphPath = "/data/knn_graph.json";
    const metaPath = "/data/cont-meta-data.csv";

    const [graph, meta] = await Promise.all([
        fetch(graphPath).then(r => r.json()),
        fetch(metaPath).then(r => r.text())
    ]);

    // ---- meta: コントID → コント名 / 公演ID ----
    const idToName = {};
    const contIdToPerformanceId = {};

    meta.split("\n").slice(1).forEach(line => {
        if (!line.trim()) return;

        const cols = line.split(",");

        const performanceId = String(cols[0]);
        const contId = cols[1];
        const contName = cols[2];

        idToName[contId] = contName;
        contIdToPerformanceId[contId] = performanceId;
    });

    // ---- nodeにlabel / performanceIdを追加 ----
    const nodes = graph.nodes.map(n => ({
        ...n,
        label: idToName[n.id] ?? n.id,
        performanceId: contIdToPerformanceId[n.id] ?? null,
    }));

    const links = graph.links.map(l => ({ ...l }));

    // ---- レイアウト計算 ----
    const sim = d3.forceSimulation(nodes)
        .force(
            "link",
            d3.forceLink(links)
                .id(d => d.id)
                .distance(d => 50 + 400 * Math.pow(1 - d.weight, 2))
                .strength(d => d.weight)
        )
        .force("charge", d3.forceManyBody().strength(-450))
        .force("collision", d3.forceCollide().radius(18))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
        .stop();

    for (let i = 0; i < 300; i++) sim.tick();

    return { nodes, links };
}
