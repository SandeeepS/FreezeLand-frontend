
interface FadeInHidden {
    y: number;
    x: number;
}

interface FadeInShow extends FadeInHidden {
    opactiy: number;
    transition: {
        type: string;
        duration: number;
        delay: number;
        ease: [number, number, number, number];
    };
}

interface FadeInVariants {
    hidden: FadeInHidden;
    show: FadeInShow;
}

export const fadeIn = (
    direction: 'up' | 'down' | 'left' | 'right',
    delay: number
): FadeInVariants => {
    return {
        hidden: {
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
            x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
        },
        show: {
            y: 0,
            x: 0,
            opactiy: 1,
            transition: {
                type: 'tween',
                duration: 1.2,
                delay: delay,
                ease: [0.25, 0.25, 0.25, 0.75],
            },
        },
    };
};