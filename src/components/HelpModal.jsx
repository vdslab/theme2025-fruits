// components/HelpModal.jsx
import { useEffect, useId } from "react";

export default function HelpModal({ isOpen, onClose }) {
    const titleId = useId();

    // Escで閉じる（dialogでも効くが、保険として）
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    // 非表示のときは描画しない（余計なイベント/フォーカスを残さない）
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            {/* 背景（クリックで閉じる） */}
            <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                aria-label="背景をクリックして閉じる"
                onClick={onClose}
            />

            {/* ウィンドウ本体 */}
            <section className="relative w-full max-w-2xl rounded-2xl bg-base-100 shadow-2xl border border-base-300">
                {/* タイトルバー（ウィンドウ風） */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                    <div className="flex items-center gap-2">
                        {/* ウィンドウっぽい3点 */}
                        <div className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                        </div>
                        <h2 id={titleId} className="font-semibold">
                            使い方 / このサイトについて
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-circle"
                        onClick={onClose}
                        aria-label="閉じる"
                        title="閉じる"
                    >
                        ✕
                    </button>
                </div>

                {/* 本文 */}
                <div className="px-5 py-4 space-y-4">
                    <section className="space-y-2">
                        <h3 className="font-bold">概要</h3>
                        <p className="text-sm opacity-80 leading-relaxed">
                            ここにサイトの説明を入れてください。
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-bold">基本操作</h3>
                        <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
                            <li>検索で絞り込みができます</li>
                            <li>ノードをクリックすると詳細が表示されます</li>
                            <li>（必要なら）ズーム/ドラッグの説明</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-bold">補足</h3>
                        <p className="text-sm opacity-80 leading-relaxed">
                            凡例、スコアの意味、データ出典などをここに。
                        </p>
                    </section>
                </div>
            </section>
        </div>
    );
}
