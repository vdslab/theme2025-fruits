import { useMemo } from "react";
import { CONT_ID_TO_COLOR } from "../../lib/getContNodeClass";

export default function Legend({ performanceMetaData, highlightedPerformanceId, onClickPerformance, }) {
    const performanceNameById = useMemo(() => {
        const m = new Map();
        for (const p of performanceMetaData ?? []) {
            m.set(String(p.performanceId), p.performanceName);
        }
        return m;
    }, [performanceMetaData]);

    return (
        <div className="mt-4 text-sm space-y-2 pointer-events-none">
            <div className="font-semibold text-gray-700">
                公演
            </div>

            <div className="space-y-1">
                {Object.entries(CONT_ID_TO_COLOR).map(([id, color]) => {
                    const name =
                        performanceNameById.get(String(id)) ??
                        `Performance ${id}`;

                    const isActive =
                        highlightedPerformanceId == null ||
                        String(highlightedPerformanceId) === String(id);

                    return (
                        <div key={id}>
                            <div
                                className="inline-flex items-center gap-2
                                    cursor-pointer transition-opacity
                                    pointer-events-auto"
                                style={{ opacity: isActive ? 1 : 0.3 }}
                                onClick={() => onClickPerformance?.(id)}
                            >
                                <span
                                    className="inline-block w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-gray-700 leading-tight">
                                    {name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

    );
}
