import { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";

export default function GraphLayer({ nodes, links, setSelectedContId }) {
    const svgRef = useRef(null);
    const viewportRef = useRef(null);

    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [selectedNodeId, setSelectedNodeId] = useState(null);

    const activeNodeId = selectedNodeId ?? hoveredNodeId;

    // ---- zoom / pan の設定 ----
    useEffect(() => {
        if (!nodes || !links) return;

        const svg = select(svgRef.current);
        const viewport = select(viewportRef.current);

        const zoomBehavior = zoom()
            .scaleExtent([0.1, 5])
            .on("zoom", (event) => {
                viewport.attr("transform", event.transform);
            });

        svg.call(zoomBehavior);
        svg.on("dblclick.zoom", null);

        return () => {
            svg.on(".zoom", null);
        };
    }, [nodes, links]);

    // ---- Loading / 未初期化 ----
    if (!nodes || !links) {
        return (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                Loading graph...
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-gray-50">
            <svg
                ref={svgRef}
                className="h-full w-full"
                viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
            >
                {/* viewport: zoom / pan がかかる */}
                <g ref={viewportRef}>
                    {/* ---- links ---- */}
                    <g className="links">
                        {links.map((l, i) => {
                            const connected =
                                activeNodeId &&
                                (l.source.id === activeNodeId ||
                                    l.target.id === activeNodeId);

                            return (
                                <line
                                    key={i}
                                    x1={l.source.x}
                                    y1={l.source.y}
                                    x2={l.target.x}
                                    y2={l.target.y}
                                    className={
                                        activeNodeId
                                            ? connected
                                                ? "stroke-gray-400"
                                                : "stroke-gray-400 opacity-10"
                                            : "stroke-gray-400/70"
                                    }
                                    strokeWidth={
                                        connected
                                            ? 2 + 2 * l.weight
                                            : 1 + 2 * l.weight
                                    }
                                />
                            );
                        })}
                    </g>

                    {/* ---- nodes ---- */}
                    <g className="nodes">
                        {nodes.map((n) => {
                            const isActive =
                                activeNodeId &&
                                (n.id === activeNodeId ||
                                    links.some(
                                        (l) =>
                                            (l.source.id === activeNodeId &&
                                                l.target.id === n.id) ||
                                            (l.target.id === activeNodeId &&
                                                l.source.id === n.id)
                                    ));

                            const isDimmed = activeNodeId && !isActive;

                            const r = isActive ? 14 : 12;

                            return (
                                <g
                                    key={n.id}
                                    onMouseEnter={() =>
                                        !selectedNodeId && setHoveredNodeId(n.id)
                                    }
                                    onMouseLeave={() =>
                                        !selectedNodeId && setHoveredNodeId(null)
                                    }
                                >
                                    {/* 下地（エッジ遮断用） */}
                                    <circle
                                        cx={n.x}
                                        cy={n.y}
                                        r={r}
                                        fill="white"
                                    />

                                    {/* 実ノード */}
                                    <circle
                                        cx={n.x}
                                        cy={n.y}
                                        r={r}
                                        className={`
                        cursor-pointer
                        transition-all
                        ${isActive
                                                ? "fill-blue-600"
                                                : isDimmed
                                                    ? "fill-blue-300 opacity-50"
                                                    : "fill-blue-500"
                                            }
                    `}
                                        onClick={() => {
                                            setSelectedNodeId(n.id);
                                            setSelectedContId(n.id);
                                        }}
                                    />

                                    {/* ラベル */}
                                    <text
                                        x={n.x}
                                        y={n.y - r - 2}
                                        textAnchor="middle"
                                        pointerEvents="none"
                                        className={`
                        select-none
                        ${isActive
                                                ? "text-[16px] fill-gray-900 opacity-100"
                                                : isDimmed
                                                    ? "text-[15px] fill-gray-500 opacity-70"
                                                    : "text-[15px] fill-gray-800 opacity-80"
                                            }
                    `}
                                    >
                                        {n.label}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </g>
            </svg>
        </div>
    );
}
