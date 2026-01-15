export function getContNodeClass(performanceId, emphasis) {
    const CONT_ID_TO_COLOR = {
        5: "fill-blue-500",
        6: "fill-blue-600",
        7: "fill-blue-700",

        8: "fill-green-600",
        9: "fill-green-700",

        10: "fill-purple-600",
        11: "fill-purple-700",

        12: "fill-orange-600",
        13: "fill-orange-700",

        14: "fill-red-600",
        15: "fill-red-700",

        16: "fill-teal-600",
        17: "fill-indigo-700",
    };
    const base = CONT_ID_TO_COLOR[performanceId];
    if (!base) return "fill-gray-400";

    const opacity =
        emphasis === "high" ? "opacity-100" :
            emphasis === "medium" ? "opacity-80" :
                "opacity-40";

    return `${base} ${opacity}`;
}
