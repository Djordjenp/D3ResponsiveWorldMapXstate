import {useEffect, useState} from "react";

const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        const observeTarget = ref.current;
        console.log(observeTarget)
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                setDimensions(entry.contentRect);
            });
        });
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget);
        };
    }, [ref]);
    return dimensions;
};

export default useResizeObserver;
