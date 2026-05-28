import { cubicBezier } from "framer-motion";

export const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: cubicBezier(0.25, 0.1, 0.25, 1),
            staggerChildren: 0.08,
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: cubicBezier(0.25, 0.1, 0.25, 1),
        },
    },
};
