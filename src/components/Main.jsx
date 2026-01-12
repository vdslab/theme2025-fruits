import DetailContent from "./detail/DetailContent";
import GraphLayer from "./charts/Layer";
import { buildGraph } from "../lib/buildGraph";
import { useEffect, useMemo, useState, useRef } from "react";
import { csvParse } from "d3-dsv";

export default function Main() {
    const [contMetaData, setContMetaData] = useState([]);
    const [selectedContId, setSelectedContId] = useState(null);

    const autoPickTimerRef = useRef(null);
    const autoPickDoneRef = useRef(false);

    const selectCont = (id) => {
        autoPickDoneRef.current = true;
        setSelectedContId(id);
    };

    useEffect(() => {
        const ac = new AbortController();

        (async () => {
            try {
                const res = await fetch("/data/cont-meta-data.csv", {
                    signal: ac.signal,
                });
                if (!res.ok) {
                    throw new Error(
                        `CSV取得に失敗: ${res.status} ${res.statusText}`
                    );
                }

                const rawText = await res.text();
                const text = rawText.replace(/^\uFEFF/, ""); // BOM対策
                const rows = csvParse(text);

                const normalized = rows
                    .map((r) => ({
                        performanceId: String(r["公演ID"] ?? ""),
                        contId: String(r["コントID"] ?? ""),
                        title: r["コント名"] ?? "",
                        duration: r["コントの時間"] ?? "",
                        url: r["URL"] ?? "",
                        props: r["小道具"] ?? "",
                        relatedPerformanceId: String(
                            r["関連性の強い公演(id)"] ??
                            r["関連性の強い公演ID"] ??
                            ""
                        ),
                        relatedPerformanceName: r["関連性の高い公演名"] ?? "",
                    }))
                    .filter((c) => c.contId && c.title);

                setContMetaData(normalized);
            } catch (e) {
                if (e?.name === "AbortError") return;
                console.error("エラー発生", e);
            }
        })();

        return () => ac.abort();
    }, []);

    // 1) contById を先に作る
    const contById = useMemo(() => {
        const m = new Map();
        for (const c of contMetaData) m.set(c.contId, c);
        return m;
    }, [contMetaData]);

    // 2) contById を使うのはこの後
    const selectedCont = selectedContId ? contById.get(selectedContId) : null;

    // 3) 自動選択も contMetaData が入った後に
    useEffect(() => {
        if (autoPickDoneRef.current) return;
        // 条件を満たさないならタイマーは不要
        if (contMetaData.length === 0 || selectedContId != null) return;

        // 二重セット防止（StrictMode対策にもなる）
        if (autoPickTimerRef.current != null) return;

        autoPickTimerRef.current = window.setTimeout(() => {
            // 発火時点でもう選択されてたら何もしない（最後の安全弁）
            if (autoPickDoneRef.current) return;
            if (contMetaData.length === 0) return;
            if (selectedContId != null) return;

            const i = Math.floor(Math.random() * contMetaData.length);
            const id = contMetaData[i].contId;

            // 自動選択はこの1回で終了
            autoPickDoneRef.current = true;
            setSelectedContId(id);

            if (autoPickTimerRef.current != null) {
                clearTimeout(autoPickTimerRef.current);
                autoPickTimerRef.current = null;
            }
        }, 3000);

        return () => {
            if (autoPickTimerRef.current != null) {
                clearTimeout(autoPickTimerRef.current);
                autoPickTimerRef.current = null;
            }
        };
    }, [contMetaData, selectedContId]);

    useEffect(() => {
        if (selectedContId == null) return;

        if (autoPickTimerRef.current != null) {
            clearTimeout(autoPickTimerRef.current);
            autoPickTimerRef.current = null;
        }
    }, [selectedContId]);

    // グラフの取得
    const [graph, setGraph] = useState(null);
    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        buildGraph({ width, height }).then(setGraph);
    }, []);

    return (
        <>
            <GraphLayer
                nodes={graph?.nodes ?? null}
                links={graph?.links ?? null}
                selectedContId={selectedContId}
                setSelectedContId={selectCont}
            />
            <DetailContent
                cont={selectedCont}
                onClose={() => setSelectedContId(null)}
            />
        </>
    );
}
