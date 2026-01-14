export default function HelpModal({ isOpen, onClose }) {
    return (
        <dialog className="modal" open={isOpen}>
            <div className="modal-box relative max-w-3xl">
                {/* 右上の × ボタン */}
                <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                    aria-label="閉じる"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold tracking-tight border-b border-gray-300 pb-2">
                    使い方 / このサイトについて
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed">
                    <p>
                        このサイトは、YouTubeに公開されているラーメンズのコント作品を対象に、
                        作品同士の関係性や特徴をグラフとして可視化し、自由に探索できるツールです。
                    </p>

                    <section className="space-y-2">
                        <h4 className="font-semibold">ラーメンズについて</h4>
                        <p>
                            小林賢太郎と片桐仁によるコントユニット。
                            <br />
                            衣装やセットに頼らず、言葉遊びや論理のズレ、不条理さを軸にした
                            独自の世界観のコントで知られている。
                            2020年に活動を終了。
                        </p>
                        <p>
                            Youtubeチャンネル：
                            <a
                                href="https://www.youtube.com/channel/UCQ75mjyRYZbprTUwO5kP8ig"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link link-primary ml-1"
                            >
                                ラーメンズ公式
                            </a>
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h4 className="font-semibold">基本操作</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                検索ボックスから作品名を入力すると、対象を絞り込めます
                            </li>
                            <li>
                                円（ノード）をクリックすると、その作品の詳細が表示されます
                            </li>
                            <li>
                                ドラッグで視点を動かし、ズームで全体像を確認できます
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h4 className="font-semibold">補足</h4>
                        <p>
                            何も選択していない場合、一定時間後に作品が自動で選ばれます。
                        </p>
                    </section>
                </div>
            </div>

            {/* 背景クリックで閉じる */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
