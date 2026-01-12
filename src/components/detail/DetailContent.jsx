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

export default function DetailContent({ cont, onClose }) {
    if (!cont) return null;

    const embedUrl = toYouTubeEmbedUrl(cont.url);

    return (
        <>
            {/* right panel */}
            <aside className="fixed top-0 right-0 z-50 h-screen w-[360px] bg-base-100 shadow-2xl flex flex-col">
                {/* header */}
                <div className="p-4 border-b border-base-200 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2">
                            <span className="badge badge-ghost">
                                ID: {cont.contId}
                            </span>
                            {cont.performanceId ? (
                                <span className="badge badge-ghost">
                                    公演ID: {cont.performanceId}
                                </span>
                            ) : null}
                        </div>

                        <h2 className="mt-2 text-lg font-bold break-words">
                            {cont.title}
                        </h2>

                        {cont.relatedPerformanceName ? (
                            <div className="mt-2 text-sm text-base-content/70">
                                関連: {cont.relatedPerformanceName}
                                {cont.relatedPerformanceId ? (
                                    <span className="ml-1">
                                        （{cont.relatedPerformanceId}）
                                    </span>
                                ) : null}
                            </div>
                        ) : null}
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
                    {/* video card */}
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

                    <div className="divider my-4">情報</div>

                    {/* info list */}
                    <div className="space-y-3">
                        {cont.duration ? (
                            <div className="card bg-base-100 border border-base-200">
                                <div className="card-body p-3">
                                    <div className="text-xs text-base-content/60">
                                        コントの時間
                                    </div>
                                    <div className="text-sm">
                                        {cont.duration}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {cont.props ? (
                            <div className="card bg-base-100 border border-base-200">
                                <div className="card-body p-3">
                                    <div className="text-xs text-base-content/60">
                                        小道具
                                    </div>
                                    <div className="text-sm break-words">
                                        {cont.props}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </aside>
        </>
    );
}
