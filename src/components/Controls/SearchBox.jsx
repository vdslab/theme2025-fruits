import { useEffect, useMemo, useRef, useState } from "react";

function normalize(s) {
    return String(s ?? "")
        .toLowerCase()
        .trim();
}

export default function SearchBox({ contMetaData, onSelectContId }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const suggestions = useMemo(() => {
        const q = normalize(query);
        if (!q) return [];

        // 部分一致（必要なら startsWith に変える）
        const matched = contMetaData.filter((c) =>
            normalize(c.title).includes(q)
        );

        // title が同じものが多い場合に備え、安定ソート
        matched.sort((a, b) => {
            const at = normalize(a.title);
            const bt = normalize(b.title);
            if (at < bt) return -1;
            if (at > bt) return 1;
            return String(a.contId).localeCompare(String(b.contId));
        });

        return matched.slice(0, 10);
    }, [contMetaData, query]);

    // 外側クリックで閉じる
    useEffect(() => {
        const onDocPointerDown = (e) => {
            console.log("doc pointerdown", e.target);
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("pointerdown", onDocPointerDown, true);
        return () =>
            document.removeEventListener("pointerdown", onDocPointerDown, true);
    }, []);

    const commitSelect = (c) => {
        if (!c?.contId) return;
        onSelectContId(c.contId);
        setQuery(""); // 選択後にクリア（残したいなら消す）
        setOpen(false);
    };

    const onKeyDown = (e) => {
        // IME変換中はEnterを無視
        if (e.isComposing || e.keyCode === 229) {
            return;
        }

        if (e.key === "Escape") {
            setOpen(false);
            return;
        }
        if (e.key === "Enter") {
            if (suggestions.length > 0) {
                commitSelect(suggestions[0]);
            }
        }
    };

    return (
        <div ref={rootRef} className="relative w-[min(450px,40vw)]">
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                placeholder="コント名で検索"
                className="
                    w-full rounded-xl border border-gray-300 bg-white
                    px-4 py-2 text-sm shadow-sm
                    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                "
            />

            {open && query.trim() !== "" && (
                <div
                    className="
                        absolute z-50 mt-2 w-full overflow-hidden rounded-xl
                        border border-gray-200 bg-white shadow-lg
                    "
                >
                    {suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            該当なし
                        </div>
                    ) : (
                        <ul className="max-h-[320px] overflow-auto">
                            {suggestions.map((c) => (
                                <li key={c.contId}>
                                    <button
                                        type="button"
                                        onClick={() => commitSelect(c)}
                                        className="
                                            w-full px-4 py-3 text-left
                                            hover:bg-gray-50
                                            cursor-pointer
                                        "
                                    >
                                        <div className="text-sm text-gray-900">
                                            {c.title}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            コントID: {c.contId}
                                            {c.relatedPerformanceName
                                                ? ` / 関連公演: ${c.relatedPerformanceName}`
                                                : ""}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
