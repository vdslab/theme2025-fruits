export function getContNodeClass(performanceId, emphasis) {
    const CONT_ID_TO_COLOR = {
        5: "fill-[#1F77B4]", // blue
        6: "fill-[#FF7F0E]", // orange
        7: "fill-[#2CA02C]", // green
        8: "fill-[#17BECF]", // cyan
        9: "fill-[#D62728]", // red

        10: "fill-[#9467BD]", // purple
        11: "fill-[#8C564B]", // brown
        12: "fill-[#E377C2]", // pink-magenta
        13: "fill-[#7F7F7F]", // gray

        14: "fill-[#BCBD22]", // olive
        15: "fill-[#AEC7E8]", // light blue
        16: "fill-[#FF9896]", // light red
        17: "fill-[#C49C94]", // light brown
    };
    const base = CONT_ID_TO_COLOR[performanceId];
    if (!base) return "fill-gray-400";

    const opacity =
        emphasis === "high" ? "opacity-100" :
            emphasis === "medium" ? "opacity-80" :
                "opacity-40";

    return `${base} ${opacity}`;
}
