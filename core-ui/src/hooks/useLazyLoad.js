"use client";
import { useEffect, useState } from "react";
export const useLazyLoad = (ref) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        observer.observe(currentRef);
        return () => {
            observer.unobserve(currentRef);
            observer.disconnect();
        };
    }, [ref]);
    return isVisible;
};
