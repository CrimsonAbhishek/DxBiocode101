import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface StatCounterProps {
  targetText: string; // e.g. "50,000+", "3–15 min", "80+", "400 g"
}

export const StatCounter: React.FC<StatCounterProps> = ({ targetText }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const match = targetText.match(/([\d,]+)/);
    if (!match) {
      setDisplayValue(targetText);
      return;
    }

    const numberStr = match[0];
    const target = parseInt(numberStr.replace(/,/g, ''), 10);
    const prefix = targetText.slice(0, targetText.indexOf(numberStr));
    const suffix = targetText.slice(targetText.indexOf(numberStr) + numberStr.length);

    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easedProgress * target);
      const formatted = target >= 1000 ? currentVal.toLocaleString('en-IN') : currentVal.toString();
      setDisplayValue(prefix + formatted + suffix);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, targetText]);

  return (
    <div ref={ref} className="stat-num">
      {isInView ? displayValue : '0'}
    </div>
  );
};
