export function getContNodeClass(performanceId) {
    const CONT_ID_TO_COLOR = {
        5: "text-[#1F77B4]", // blue
        6: "text-[#FF7F0E]", // orange
        7: "text-[#2CA02C]", // green
        8: "text-[#17BECF]", // cyan
        9: "text-[#D62728]", // red

        10: "text-[#9467BD]", // purple
        11: "text-[#8C564B]", // brown
        12: "text-[#E377C2]", // pink-magenta
        13: "text-[#7F7F7F]", // gray

        14: "text-[#BCBD22]", // olive
        15: "text-[#AEC7E8]", // light blue
        16: "text-[#FF9896]", // light red
        17: "text-[#C49C94]", // light brown
    };
    const base = CONT_ID_TO_COLOR[performanceId];
    if (!base) return "fill-gray-400";
    return `${base}`;
}
