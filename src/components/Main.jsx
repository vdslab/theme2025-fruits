import FilterPanel from "./FilterPanel";
import DetailModel from "./detail/DetailModal";

import { useEffect, useMemo, useState } from "react";
import { csvParse } from "d3-dsv";

export default function Main() {
    const [contMetaData, setContMetaData] = useState([]);
    const [selectedContId, setSelectedContId] = useState(null);

    useEffect(() => {
        const ac = new AbortController();

        (async () => {
            try {
                const res = await fetch("/data/cont-meta-data.csv", {
                    signal: ac.signal,
                });
                if (!res.ok) {
                    throw new Error(
                        `cont_meta.csvの取得に失敗: ${res.status} ${res.statusText}`
                    );
                }

                const text = await res.text();
                const rows = csvParse(text);

                // 正規化
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

    // 辞書つくる
    const contById = useMemo(() => {
        const m = new Map();
        for (const c of contMetaData) m.set(c.contId, c);
        return m;
    }, [contMetaData]);

    console.log(contMetaData);
    return <p>aaa</p>;
}
