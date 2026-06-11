'use client';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StatCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}

export default function StatCounter({ target, suffix = '', prefix = '', label, duration = 2 }: StatCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const spring = useSpring(count, { duration: duration * 1000, bounce: 0 });
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      count.set(target);
    }
  }, [isInView, count, target]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, prefix, suffix]);

  return (
    <div ref={ref} className="stat-item">
      <div className="stat-num">
        <span ref={displayRef}>{prefix}0{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
