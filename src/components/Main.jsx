import DetailContent from "./detail/DetailContent";
import GraphLayer from "./charts/Layer";
import SearchBox from "./Controls/SearchBox";
import HelpButton from "./Controls/HelpButton";
import HelpModal from "./HelpModal";

import { buildGraph } from "../lib/buildGraph";
import { useEffect, useMemo, useState, useRef } from "react";
import { csvParse } from "d3-dsv";

export default function Main() {
    const [isHelpOpen, setIsHelpOpen] = useState(true);

    const [contMetaData, setContMetaData] = useState([]);
    const [selectedContId, setSelectedContId] = useState(null);

    const [performanceMetaData, setPerformanceMetaData] = useState([]);

    const autoPickTimerRef = useRef(null);
    const autoPickDoneRef = useRef(false);

    const selectCont = (id) => {
        autoPickDoneRef.current = true;
        setSelectedContId(id);
    };

    // cont-meta読み込み
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

    // performance-meta読み込み
    useEffect(() => {
        const ac = new AbortController();

        (async () => {
            try {
                const res = await fetch("/data/performance-meta-data.csv", {
                    signal: ac.signal,
                });
                if (!res.ok) {
                    throw new Error(
                        `CSV取得に失敗: ${res.status} ${res.statusText}`
                    );
                }

                const rawText = await res.text();
                const text = rawText.replace(/^\uFEFF/, "");
                const rows = csvParse(text);

                const normalized = rows
                    .map((r) => ({
                        performanceId: String(r["公演ID"] ?? ""),
                        performanceName: r["公演名"] ?? "",
                        performanceYear: r["公演年"] ?? "",
                        performanceCity: r["公演都市"] ?? "",
                        url: r["URL"] ?? "",
                    }))
                    .filter((p) => p.performanceId);

                setPerformanceMetaData(normalized);
            } catch (e) {
                if (e?.name === "AbortError") return;
                console.error("エラー発生(performance-meta)", e);
            }
        })();

        return () => ac.abort();
    }, []);

    // contById
    const contById = useMemo(() => {
        const m = new Map();
        for (const c of contMetaData) m.set(c.contId, c);
        return m;
    }, [contMetaData]);

    const selectedCont = selectedContId ? contById.get(selectedContId) : null;

    // performanceById
    const performanceById = useMemo(() => {
        const m = new Map();
        for (const p of performanceMetaData) m.set(p.performanceId, p);
        return m;
    }, [performanceMetaData]);

    // ヘルプが閉じたことを記録
    const helpClosedOnceRef = useRef(false);
    useEffect(() => {
        if (!isHelpOpen && !helpClosedOnceRef.current) {
            helpClosedOnceRef.current = true;
        }
    }, [isHelpOpen]);

    // 自動選択
    useEffect(() => {
        if (autoPickDoneRef.current) return;
        // 条件を満たさないならタイマーは不要
        if (contMetaData.length === 0 || selectedContId != null) return;
        if (!helpClosedOnceRef.current) return;

        // 追加：ヘルプが開いている間はタイマーを動かさない（推奨）
        if (isHelpOpen) {
            if (autoPickTimerRef.current != null) {
                clearTimeout(autoPickTimerRef.current);
                autoPickTimerRef.current = null;
            }
            return;
        }

        // 二重セット防止（StrictMode対策にもなる）
        if (autoPickTimerRef.current != null) return;

        autoPickTimerRef.current = window.setTimeout(() => {
            // 発火時点でもう選択されてたら何もしない（最後の安全弁）
            if (autoPickDoneRef.current) return;
            if (contMetaData.length === 0) return;
            if (selectedContId != null) return;
            if (!helpClosedOnceRef.current) return;
            if (isHelpOpen) return;

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
    }, [contMetaData, selectedContId, isHelpOpen]);

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
        <div className="relative h-full">
            <div className="pointer-events-none absolute left-0 z-40">
                <div className="pointer-events-auto  px-5 py-6">
                    <div className="flex items-center gap-2">
                        <SearchBox
                            contMetaData={contMetaData}
                            onSelectContId={selectCont}
                        />
                        <HelpButton onOpen={() => setIsHelpOpen(true)} />
                    </div>
                </div>
            </div>
            <GraphLayer
                nodes={graph?.nodes ?? null}
                links={graph?.links ?? null}
                selectedContId={selectedContId}
                onSelectContId={selectCont}
            />
            <DetailContent
                cont={selectedCont}
                performanceById={performanceById}
                onClose={() => setSelectedContId(null)}
            />
            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
        </div>
    );
}
