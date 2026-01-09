import FilterPanel from "./FilterPanel";
import DetailModel from "./detail/DetailModal";

import { useState } from "react";

export default function Main() {
    const [selectedCont, setSelectedCont] = useState(null);
    return (
        <>
            <FilterPanel />
            <DetailModel cont={selectedCont} />
        </>
    );
}
