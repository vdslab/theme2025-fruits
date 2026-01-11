function toYouTubeEmbedUrl(url) {
    if (!url) return null;

    try {
        const u = new URL(url);

        // youtu.be/<id>
        if (u.hostname === "youtu.be") {
            const id = u.pathname.replace("/", "");
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }

        // youtube.com/watch?v=<id>
        if (u.hostname.includes("youtube.com")) {
            const id = u.searchParams.get("v");
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }

        return null;
    } catch {
        return null;
    }
}

export default function DetailContent({ contId, onClose }) {
    if (!contId) return null;

    const embedUrl = toYouTubeEmbedUrl(contId.url);

    return (
        <>
            {/* 背景クリックで閉じたいなら使う（不要なら消してOK） */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.25)",
                    zIndex: 40,
                }}
            />

            {/* 右パネル本体 */}
            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    height: "100vh",
                    width: 360, // 固定幅（必要なら変更）
                    background: "#fff",
                    zIndex: 50,
                    boxShadow: "0 0 24px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* ヘッダ */}
                <div
                    style={{
                        padding: "16px 16px 12px",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        alignItems: "start",
                        gap: 12,
                    }}
                >
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "#666" }}>
                            ID: {contId.contId}
                            {contId.performanceId
                                ? ` / 公演ID: ${contId.performanceId}`
                                : ""}
                        </div>

                        <h2
                            style={{
                                margin: "6px 0 0",
                                fontSize: 18,
                                lineHeight: 1.3,
                                wordBreak: "break-word",
                            }}
                        >
                            {contId.title}
                        </h2>

                        {contId.relatedPerformanceName ? (
                            <div
                                style={{
                                    marginTop: 8,
                                    fontSize: 12,
                                    color: "#666",
                                }}
                            >
                                関連: {contId.relatedPerformanceName}
                                {contId.relatedPerformanceId
                                    ? `（${contId.relatedPerformanceId}）`
                                    : ""}
                            </div>
                        ) : null}
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="close"
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 18,
                            lineHeight: "30px",
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 本文 */}
                <div style={{ padding: 16, overflow: "auto", flex: 1 }}>
                    {/* 動画 */}
                    {embedUrl ? (
                        <div style={{ borderRadius: 12, overflow: "hidden" }}>
                            <iframe
                                width="100%"
                                height="200"
                                src={embedUrl}
                                title={contId.title ?? "YouTube"}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    ) : contId.url ? (
                        <a href={contId.url} target="_blank" rel="noreferrer">
                            動画を開く
                        </a>
                    ) : (
                        <div style={{ color: "#888", fontSize: 13 }}>
                            URLがありません
                        </div>
                    )}

                    {/* 追加情報（後で拡張しやすい枠） */}
                    <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                        {/* 時間（後で使う） */}
                        {contId.duration ? (
                            <div>
                                <div style={{ fontSize: 12, color: "#666" }}>
                                    コントの時間
                                </div>
                                <div style={{ fontSize: 14 }}>
                                    {contId.duration}
                                </div>
                            </div>
                        ) : null}

                        {/* 小道具 */}
                        {contId.props ? (
                            <div>
                                <div style={{ fontSize: 12, color: "#666" }}>
                                    小道具
                                </div>
                                <div style={{ fontSize: 14 }}>
                                    {contId.props}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </aside>
        </>
    );
}
