import { useEffect, useState } from 'react';
import { readBaseFee, UNKNOWN_FEE, type FeeRate } from '../lib/strike/fees';

/** The venue's base taker rate, falling back to 5 bps only while it is genuinely unknown. */
export function useFeeRate(): FeeRate {
  const [fee, setFee] = useState<FeeRate>(UNKNOWN_FEE);

  useEffect(() => {
    let alive = true;
    void readBaseFee().then((next) => {
      if (alive) setFee(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  return fee;
}
