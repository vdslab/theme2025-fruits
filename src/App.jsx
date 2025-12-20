import Header from "./components/Header";

export default function App() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">DaisyUI 動作確認</h2>
                        <p>Tailwind CSS + DaisyUI が使えています！</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">Primary Button</button>
                            <button className="btn btn-outline">Outline Button</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
