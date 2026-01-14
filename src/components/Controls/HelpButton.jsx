// components/HelpButton.jsx
export default function HelpButton({ onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="btn btn-sm btn-circle bg-base-250 hover:bg-base-400 "
            aria-label="ヘルプを開く"
            title="サイトの使い方"
        >
            <span className="text-base text-gray-600">?</span>
        </button>
    );
}
