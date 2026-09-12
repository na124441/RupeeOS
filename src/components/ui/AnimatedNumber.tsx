import React, { useEffect, useRef, useState } from 'react';
import { animateCount } from '../../lib/animations/counters';
import { formatRupee } from '../../utils/currency';

interface AnimatedNumberProps {
  value: number;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  isCurrency = true,
  prefix = '',
  suffix = '',
  duration = 0.7,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(() =>
    isCurrency ? formatRupee(value) : `${prefix}${value}${suffix}`
  );
  const prevValueRef = useRef(value);

  useEffect(() => {
    const fromVal = prevValueRef.current;
    prevValueRef.current = value;

    const anim = animateCount(value, fromVal, {
      duration,
      isCurrency,
      prefix,
      suffix,
      onUpdate: (formatted) => {
        setDisplayValue(formatted);
      },
    });

    return () => {
      anim.kill();
    };
  }, [value, isCurrency, prefix, suffix, duration]);

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {displayValue}
    </span>
  );
};
