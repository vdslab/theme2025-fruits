// components/HelpModal.jsx
export default function HelpModal({ isOpen, onClose }) {
    return (
        <dialog className="modal" open={isOpen}>
            <div className="modal-box relative">
                {/* 右上の × ボタン */}
                <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                    aria-label="閉じる"
                >
                    ✕
                </button>

                <h3 className="font-bold text-lg">
                    使い方 / このサイトについて
                </h3>

                <div className="mt-4 space-y-3 text-sm leading-relaxed">
                    <p>ここにサイト全体の説明を書きます。</p>

                    <ul className="list-disc pl-5 space-y-1">
                        <li>検索ボックスで絞り込みができます</li>
                        <li>要素をクリックすると詳細が表示されます</li>
                        <li>ドラッグやズーム操作が可能です</li>
                    </ul>
                </div>
            </div>

            {/* 背景クリックで閉じる */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
