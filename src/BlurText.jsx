import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BlurText = ({
    text,
    delay = 200,
    className = '',
    animateBy = 'words', // 'words' or 'letters'
    direction = 'top', // 'top' or 'bottom'
    onAnimationComplete,
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const initialY = direction === 'top' ? -50 : 50;

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: delay / 1000,
            }
        }
    };

    const item = {
        hidden: { filter: 'blur(10px)', opacity: 0, y: initialY },
        visible: {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`flex flex-wrap ${className}`}
            onAnimationComplete={onAnimationComplete}
        >
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    variants={item}
                    className="inline-block"
                    style={{ marginRight: animateBy === 'words' ? '0.25em' : '0' }}
                >
                    {element === ' ' ? '\u00A0' : element}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default BlurText;
