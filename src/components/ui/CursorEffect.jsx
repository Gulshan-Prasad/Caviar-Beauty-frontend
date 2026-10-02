import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorEffect() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setIsVisible(true);
    const move = (e) => { cursorX.set(e.clientX - 16); cursorY.set(e.clientY - 16); };
    const leave = () => { cursorX.set(-100); cursorY.set(-100); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave); };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998] mix-blend-difference"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <div className="w-full h-full rounded-full bg-white dark:bg-caviar-950 opacity-80" />
    </motion.div>
  );
}
