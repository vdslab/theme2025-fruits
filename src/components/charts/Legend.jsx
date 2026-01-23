import { useMemo } from "react";
import { CONT_ID_TO_COLOR } from "../../lib/getContNodeClass";

export default function Legend({ performanceMetaData }) {
    const performanceNameById = useMemo(() => {
        const m = new Map();
        for (const p of performanceMetaData ?? []) {
            m.set(String(p.performanceId), p.performanceName);
        }
        return m;
    }, [performanceMetaData]);

    return (
        <div className="mt-4 text-sm space-y-2">
            <div className="font-semibold text-gray-700">
                公演
            </div>

            <div className="space-y-1">
                {Object.entries(CONT_ID_TO_COLOR).map(([id, color]) => {
                    const name =
                        performanceNameById.get(String(id)) ??
                        `Performance ${id}`;

                    return (
                        <div
                            key={id}
                            className="flex items-center gap-2"
                        >
                            {/* 色丸 */}
                            <span
                                className="inline-block w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: color }}
                            />

                            {/* 公演名 */}
                            <span className="text-gray-700 leading-tight">
                                {name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
