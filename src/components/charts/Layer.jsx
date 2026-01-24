import { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import { getContNodeClass } from "../../lib/getContNodeClass";


// 文字省略用の関数
function truncateLabel(text, maxLength = 5) {
    if (!text) return "";
    return text.length > maxLength
        ? text.slice(0, maxLength) + "…"
        : text;
}

export default function GraphLayer({
    nodes,
    links,
    selectedContId,
    highlightedPerformanceId,
    onSelectContId,
    onClearHighlightedPerformance,
    onHighlightPerformance,
}) {
    const svgRef = useRef(null);
    const viewportRef = useRef(null);
    const zoomBehaviorRef = useRef(null);

    const [hoveredNodeId, setHoveredNodeId] = useState(null);

    // ---- zoom / pan の設定 ----
    useEffect(() => {
        if (!nodes || !links) return;

        const svg = select(svgRef.current);
        const viewport = select(viewportRef.current);

        // ---- zoom behavior ----
        const zb = zoom()
            .scaleExtent([0.1, 5])
            .on("zoom", (event) => {
                viewport.attr("transform", event.transform);
            });

        zoomBehaviorRef.current = zb;

        svg.call(zb);
        svg.on("dblclick.zoom", null);

        // =========================
        // 初期ズーム（bounding box から自動計算）
        // =========================

        // ノード座標の範囲を計算
        const xs = nodes.map((n) => n.x);
        const ys = nodes.map((n) => n.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const graphWidth = maxX - minX;
        const graphHeight = maxY - minY;

        const { innerWidth: w, innerHeight: h } = window;

        // 少し余白を持たせる
        const MARGIN = 200;

        const scale = Math.min(
            w / (graphWidth + MARGIN),
            h / (graphHeight + MARGIN),
            1.2 // 拡大しすぎ防止
        );

        const translateX = w / 2 - scale * (minX + maxX) / 2;
        const translateY = h / 2 - scale * (minY + maxY) / 2;

        const initialTransform = zoomIdentity
            .translate(translateX, translateY)
            .scale(scale);

        svg.call(zb.transform, initialTransform);

        // ---- cleanup ----
        return () => {
            svg.on(".zoom", null);
        };
    }, [nodes, links]);

    // 詳細画面をを閉じたらホバーも解除する
    useEffect(() => {
        if (selectedContId == null) {
            setHoveredNodeId(null);
        }
    }, [selectedContId]);

    // ノードを選択したら画面中央に持ってくる
    useEffect(() => {
        if (!selectedContId) return;
        if (!nodes || !zoomBehaviorRef.current) return;

        const node = nodes.find((n) => n.id === selectedContId);
        if (!node) return;

        const svg = select(svgRef.current);

        const PANEL_WIDTH = 360;
        const { innerWidth: w, innerHeight: h } = window;

        const centerX = (w - PANEL_WIDTH) / 2;
        const centerY = h / 2;

        const transform = zoomIdentity
            .translate(centerX - node.x, centerY - node.y)
            .scale(1);

        svg
            .transition()
            .duration(600)
            .call(zoomBehaviorRef.current.transform, transform);
    }, [selectedContId, nodes]);

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
                <g ref={viewportRef}>
                    {/* 背景（何もない場所のクリック用） */}
                    <rect
                        x={-100000}
                        y={-100000}
                        width={200000}
                        height={200000}
                        fill="transparent"
                        onClick={() => {
                            onSelectContId(null);
                            onClearHighlightedPerformance?.();
                        }}
                    />

                    {/* ---- links ---- */}
                    <g className="links">
                        {links.map((l, i) => {
                            const hasSelection = selectedContId != null;

                            const isSelectedEdge =
                                selectedContId &&
                                (l.source.id === selectedContId ||
                                    l.target.id === selectedContId);

                            const isHoveredEdge =
                                hoveredNodeId &&
                                (l.source.id === hoveredNodeId ||
                                    l.target.id === hoveredNodeId);

                            const emphasis = !hasSelection
                                ? isHoveredEdge
                                    ? "high"
                                    : "medium"
                                : isSelectedEdge
                                    ? "high"
                                    : isHoveredEdge
                                        ? "medium"
                                        : "low";

                            return (
                                <line
                                    key={i}
                                    x1={l.source.x}
                                    y1={l.source.y}
                                    x2={l.target.x}
                                    y2={l.target.y}
                                    className={
                                        emphasis === "high"
                                            ? "stroke-gray-500 opacity-100"
                                            : emphasis === "medium"
                                                ? "stroke-gray-400 opacity-60"
                                                : "stroke-gray-400 opacity-10"
                                    }
                                    strokeWidth={
                                        emphasis === "high"
                                            ? 2 + 2 * l.weight
                                            : emphasis === "medium"
                                                ? 1.5 + 2 * l.weight
                                                : 1 + 2 * l.weight
                                    }
                                />
                            );
                        })}
                    </g>

                    {/* ---- nodes ---- */}
                    <g className="nodes">
                        {nodes.map((n) => {
                            const isSelected = selectedContId === n.id;
                            const isHovered = hoveredNodeId === n.id;

                            const isNeighbor =
                                (selectedContId &&
                                    links.some(
                                        (l) =>
                                            (l.source.id === selectedContId && l.target.id === n.id) ||
                                            (l.target.id === selectedContId && l.source.id === n.id)
                                    )) ||
                                (hoveredNodeId &&
                                    links.some(
                                        (l) =>
                                            (l.source.id === hoveredNodeId && l.target.id === n.id) ||
                                            (l.target.id === hoveredNodeId && l.source.id === n.id)
                                    ));

                            const hasSelection = selectedContId != null;

                            const emphasis = !hasSelection
                                ? isHovered
                                    ? "high"
                                    : isNeighbor
                                        ? "medium"
                                        : "medium"
                                : isSelected
                                    ? "high"
                                    : (isHovered || isNeighbor)
                                        ? "medium"
                                        : "low";

                            const r =
                                emphasis === "high" ? 16 :
                                    emphasis === "medium" ? 13 :
                                        12;

                            const shouldDeemphasizeByPerformance =
                                highlightedPerformanceId != null &&
                                n.performanceId !== highlightedPerformanceId &&
                                !isNeighbor &&
                                !isSelected;


                            const opacityClass =
                                shouldDeemphasizeByPerformance
                                    ? "opacity-40"
                                    : emphasis === "high"
                                        ? "opacity-100"
                                        : emphasis === "medium"
                                            ? "opacity-100"
                                            : "opacity-40";

                            return (
                                <g
                                    key={n.id}
                                    onMouseEnter={() => setHoveredNodeId(n.id)}
                                    onMouseLeave={() => setHoveredNodeId(null)}
                                    className={getContNodeClass(n.performanceId)}
                                >
                                    {/* 下地 */}
                                    <circle cx={n.x} cy={n.y} r={r} fill="white" />

                                    {/* ノード本体 */}
                                    <circle
                                        cx={n.x}
                                        cy={n.y}
                                        r={r}
                                        fill="currentColor"
                                        className={`cursor-pointer transition-all ${opacityClass}`}
                                        onClick={() => {
                                            onSelectContId(n.id);
                                            onHighlightPerformance?.(n.performanceId);
                                        }}
                                    />
                                </g>
                            );
                        })}
                    </g>

                    {/* ---- labels ---- */}
                    <g className="labels">
                        {nodes.map((n) => {
                            const isSelected = selectedContId === n.id;
                            const isHovered = hoveredNodeId === n.id;

                            const isNeighbor =
                                (selectedContId &&
                                    links.some(
                                        (l) =>
                                            (l.source.id === selectedContId &&
                                                l.target.id === n.id) ||
                                            (l.target.id === selectedContId &&
                                                l.source.id === n.id)
                                    )) ||
                                (hoveredNodeId &&
                                    links.some(
                                        (l) =>
                                            (l.source.id === hoveredNodeId &&
                                                l.target.id === n.id) ||
                                            (l.target.id === hoveredNodeId &&
                                                l.source.id === n.id)
                                    ));

                            const hasSelection = selectedContId != null;

                            const emphasis = !hasSelection
                                ? (isHovered || isNeighbor)
                                    ? "high"
                                    : "medium"
                                : isSelected
                                    ? "high"
                                    : (isHovered || isNeighbor)
                                        ? "medium"
                                        : "low";

                            const r =
                                emphasis === "high"
                                    ? 14
                                    : emphasis === "medium"
                                        ? 13
                                        : 12;

                            const displayLabel =
                                !hasSelection
                                    ? (isHovered || isNeighbor
                                        ? n.label
                                        : truncateLabel(n.label, 6))
                                    : emphasis === "low"
                                        ? truncateLabel(n.label, 6)
                                        : n.label;

                            return (
                                <text
                                    key={n.id}
                                    x={n.x}
                                    y={n.y - r - 6}
                                    textAnchor="middle"
                                    pointerEvents="none"
                                    className={`select-none transition-all ${emphasis === "high"
                                        ? "text-[16px] fill-gray-900 opacity-100"
                                        : emphasis === "medium"
                                            ? "text-[15px] fill-gray-800 opacity-90"
                                            : "text-[14px] fill-gray-500 opacity-70"
                                        }`}
                                >
                                    {displayLabel}
                                </text>
                            );
                        })}
                    </g>
                </g>
            </svg>
        </div>
    );
}
