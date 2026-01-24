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

export default function DetailContent({ cont, performanceById, contsInSamePerformance, onSelectContId, onClose, }) {
    if (!cont) return null;

    const perf = cont.performanceId
        ? performanceById?.get(String(cont.performanceId)) ?? null
        : null;

    const embedUrl = toYouTubeEmbedUrl(cont.url);

    const performanceName = perf?.performanceName ?? "";
    const performanceYear = perf?.performanceYear ?? "";
    const performanceCityRaw = perf?.performanceCity ?? "";
    const performanceUrl = perf?.url ?? "";

    return (
        <aside className="absolute top-0 right-0 z-50 h-screen w-[360px] bg-base-100 shadow-2xl flex flex-col">
            {/* header */}
            <div className="p-4 border-base-200 flex items-start gap-3">
                <div className="flex-1 min-w-0">
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
            <div className="px-4 overflow-y-auto flex-1">
                {/* youtube埋め込み */}
                <div className="card bg-base-100">
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

                {/* {cont.summary ? (
                    <div className="mt-4 card bg-base-100 border border-base-200">
                        <div className="card-body p-3">
                            <div className="text-xs text-base-content/60">
                                あらすじ
                            </div>
                            <p className="mt-1 text-sm leading-relaxed">
                                {cont.summary}
                            </p>
                        </div>
                    </div>
                ) : null} */}

                <div className="divider my-2">コント情報</div>

                {cont.duration ? (
                    <div className="card bg-base-100">
                        <div className="card-body p-1">
                            <div className="text-xs text-base-content/60">
                                時間
                            </div>
                            <div className="text-sm">{cont.duration}</div>
                        </div>
                    </div>
                ) : null}

                <div className="mt-3 card bg-base-100">
                    <div className="card-body p-1">
                        <div className="text-xs text-base-content/60">
                            小道具
                        </div>
                        <div className="text-sm break-words">
                            {cont.props ? cont.props : "なし"}
                        </div>
                    </div>
                </div>

                <div className="divider my-2">公演情報</div>

                {/* 公演名 */}
                <div className="card bg-base-100">
                    <div className="card-body p-1">
                        <div className="text-xs text-base-content/60">
                            公演名
                        </div>
                        <div className="text-sm break-words">
                            {performanceName || "情報がありません"}
                        </div>
                    </div>
                </div>

                {/* 公演年 */}
                {performanceYear ? (
                    <div className="card bg-base-100">
                        <div className="card-body p-1">
                            <div className="text-xs text-base-content/60">
                                公演年
                            </div>
                            <div className="text-sm">{performanceYear}</div>
                        </div>
                    </div>
                ) : (
                    <div className="card bg-base-100">
                        <div className="card-body p-1">
                            <div className="text-xs text-base-content/60">
                                公演年
                            </div>
                            <div className="text-sm text-base-content/60">
                                情報がありません
                            </div>
                        </div>
                    </div>
                )}

                {/* この公演で演じられたコント */}
                <div className="mt-3 card bg-base-100">
                    <div className="card-body p-1">
                        <div className="text-xs text-base-content/60 mb-1">
                            この公演で演じられたコント
                        </div>

                        {contsInSamePerformance?.length ? (
                            <ul className="space-y-1">
                                {contsInSamePerformance.map((c, index) => {
                                    const isCurrent = c.contId === cont.contId;
                                    const order = index + 1;

                                    return (
                                        <li key={c.contId}>
                                            <button
                                                type="button"
                                                disabled={isCurrent}
                                                onClick={() => onSelectContId?.(c.contId)}
                                                className={`w-full text-left flex gap-2 rounded px-1 py-0.5 text-sm break-words ${isCurrent
                                                    ? "font-semibold text-primary cursor-default"
                                                    : "hover:bg-base-200 text-base-content cursor-pointer"
                                                    }`}
                                            >
                                                {/* 公演内番号 */}
                                                <span className="tabular-nums text-base-content/60">
                                                    {order}.
                                                </span>

                                                {/* コント名 */}
                                                <span className="flex-1">
                                                    {c.title}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-sm text-base-content/60">
                                情報がありません
                            </div>
                        )}
                    </div>
                </div>

                {/* 公演都市 */}
                <div className="mt-3 card bg-base-100">
                    <div className="card-body p-1">
                        <div className="text-xs text-base-content/60">
                            公演都市
                        </div>
                        <div className="text-sm break-words">
                            {performanceCityRaw || "情報がありません"}
                        </div>
                    </div>
                </div>

                {/* 公演DVD（URL） */}
                <div className="mt-3 card bg-base-100 ">
                    <div className="card-body p-1">
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
