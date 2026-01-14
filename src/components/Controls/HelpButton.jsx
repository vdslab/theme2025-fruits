// components/HelpButton.jsx
export default function HelpButton({ onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="btn btn-circle btn-sm btn-ghost"
            aria-label="ヘルプを開く"
            title="使い方"
        >
            ?
        </button>
    );
}
