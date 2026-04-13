"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function usePullToRefresh() {
    const router = useRouter();

    useEffect(() => {
        let startY = 0;

        // Very simple pull-to-refresh implementation
        // For a cleaner native feel, we'd use a library, but this is sufficient for MVP PWA.
        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                const endY = e.changedTouches[0].clientY;
                if (endY - startY > 150) { // Dragged down significantly
                    window.location.reload(); // Hard reload to fetch fresh data
                }
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);
}
