"use client";
import { useRef, useEffect, useState, useCallback } from "react";
/**
 * Generic scroll-to-points hook with:
 * - key/index mapping
 * - scroll spy
 * - vertical & horizontal support
 * - container visibility detection
 */
export const useScrollPoints = ({ axis = "vertical", threshold = 0.1, scrollBehavior = "smooth", scrollBlock = "center", } = {}) => {
    const containerRef = useRef(null);
    const pointsMapRef = useRef(new Map());
    const orderedKeysRef = useRef([]);
    const [activeKey, setActiveKey] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isContainerVisible, setIsContainerVisible] = useState(false);
    /* Register scroll points (key optional, fallback to index) */
    const registerPoint = useCallback((keyOrIndex) => (el) => {
        if (!el)
            return;
        const key = keyOrIndex !== undefined && keyOrIndex !== null
            ? keyOrIndex
            : orderedKeysRef.current.length;
        if (!pointsMapRef.current.has(key)) {
            orderedKeysRef.current.push(key);
        }
        pointsMapRef.current.set(key, el);
    }, []);
    /* Scroll to a registered key or index */
    const scrollTo = useCallback((keyOrIndex) => {
        const el = pointsMapRef.current.get(keyOrIndex);
        if (!el)
            return;
        el.scrollIntoView({
            behavior: scrollBehavior,
            block: scrollBlock,
            inline: axis === "horizontal" ? "center" : "nearest",
        });
    }, [axis, scrollBehavior, scrollBlock]);
    /* Scroll Spy + Active Key/Index */
    useEffect(() => {
        if (!pointsMapRef.current.size)
            return;
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible)
                return;
            for (const [key, el] of pointsMapRef.current.entries()) {
                if (el === visible.target) {
                    setActiveKey(key);
                    setActiveIndex(orderedKeysRef.current.indexOf(key));
                    break;
                }
            }
        }, {
            threshold,
            root: axis === "horizontal" ? containerRef.current : null,
        });
        pointsMapRef.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [axis, threshold]);
    /* Container visibility detection */
    useEffect(() => {
        if (!containerRef.current)
            return;
        const observer = new IntersectionObserver(([entry]) => setIsContainerVisible(entry.isIntersecting), { threshold });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [threshold]);
    return {
        containerRef,
        registerPoint,
        scrollTo,
        activeKey,
        activeIndex,
        isContainerVisible,
    };
};
