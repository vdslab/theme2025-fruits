import React from "react";

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

export default function DetailContent({ cont, performanceById, onClose }) {
    if (!cont) return null;

    const perf = cont.performanceId
        ? performanceById?.get(String(cont.performanceId)) ?? null
        : null;

    const embedUrl = toYouTubeEmbedUrl(cont.url);

    const performanceName = perf?.performanceName ?? "";
    const performanceYear = perf?.performanceYear ?? "";
    const performanceCityRaw = perf?.performanceCity ?? "";
    const performanceUrl = perf?.url ?? "";

    const performanceCities = performanceCityRaw
        ? performanceCityRaw
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : [];

    return (
        <aside className="absolute top-0 right-0 z-50 h-screen w-[360px] bg-base-100 shadow-2xl flex flex-col">
            {/* header */}
            <div className="p-4 border-b border-base-200 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    {/* 公演名 */}
                    <h1 className="text-lg font-bold break-words leading-snug">
                        {performanceName || "（公演名不明）"}
                    </h1>

                    {/* タイトル */}
                    <h2 className="mt-1 text-base font-semibold break-words">
                        {cont.title}
                    </h2>
                </div>

                <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle"
                    aria-label="close"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>

            {/* body */}
            <div className="p-4 overflow-y-auto flex-1">
                {/* youtube埋め込み */}
                <div className="card bg-base-100 border border-base-200">
                    <div className="card-body p-3">
                        {embedUrl ? (
                            <div className="w-full aspect-video rounded-box overflow-hidden">
                                <iframe
                                    className="w-full h-full"
                                    src={embedUrl}
                                    title={cont.title ?? "YouTube"}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                        ) : cont.url ? (
                            <a
                                className="link link-primary"
                                href={cont.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                動画を開く
                            </a>
                        ) : (
                            <div className="text-sm text-base-content/60">
                                URLがありません
                            </div>
                        )}
                    </div>
                </div>

                {/* コントの時間 */}
                {cont.duration ? (
                    <div className="mt-4 card bg-base-100 border border-base-200">
                        <div className="card-body p-3">
                            <div className="text-xs text-base-content/60">
                                コントの時間
                            </div>
                            <div className="text-sm">{cont.duration}</div>
                        </div>
                    </div>
                ) : null}

                <div className="divider my-4">公演情報</div>

                {/* 公演年 */}
                {performanceYear ? (
                    <div className="card bg-base-100 border border-base-200">
                        <div className="card-body p-3">
                            <div className="text-xs text-base-content/60">
                                公演年
                            </div>
                            <div className="text-sm">{performanceYear}</div>
                        </div>
                    </div>
                ) : (
                    <div className="card bg-base-100 border border-base-200">
                        <div className="card-body p-3">
                            <div className="text-xs text-base-content/60">
                                公演年
                            </div>
                            <div className="text-sm text-base-content/60">
                                情報がありません
                            </div>
                        </div>
                    </div>
                )}

                {/* 公演都市 */}
                {performanceCities.length > 0 ? (
                    <div className="mt-3 card bg-base-100 border border-base-200">
                        <div className="card-body p-3">
                            <div className="text-xs text-base-content/60">
                                公演都市
                            </div>

                            {/* バッジ表示 */}
                            <div className="mt-1 flex flex-wrap gap-2">
                                {performanceCities.map((city) => (
                                    <span
                                        key={city}
                                        className="badge badge-outline"
                                    >
                                        {city}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 card bg-base-100 border border-base-200">
                        <div className="card-body p-3">
                            <div className="text-xs text-base-content/60">
                                公演都市
                            </div>
                            <div className="text-sm text-base-content/60">
                                情報がありません
                            </div>
                        </div>
                    </div>
                )}

                {/* 公演DVD（URL） */}
                <div className="mt-3 card bg-base-100 border border-base-200">
                    <div className="card-body p-3">
                        <div className="text-xs text-base-content/60">
                            公演DVD
                        </div>

                        {performanceUrl ? (
                            <a
                                className="link link-primary break-all"
                                href={performanceUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                商品ページを開く
                            </a>
                        ) : (
                            <div className="text-sm text-base-content/60">
                                情報がありません
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
