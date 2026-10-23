import { Link } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";
import type { HouseProduct } from "./products";

interface ProductCardProps {
  product: HouseProduct;
}

/**
 * One product, one link. The whole card is the target, because the only action on it
 * is "take me there"; a second link inside would just split one decision in two.
 */
export function ProductCard({ product }: ProductCardProps) {
  const { name, description, audience, cta, href, icon: ProductIcon } = product;

  return (
    <Link
      to={href}
      className="group glass-surface-hover flex h-full flex-col gap-4 p-6 sm:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyber-pink/10 transition-colors duration-300 group-hover:bg-cyber-pink/20">
          <ProductIcon size={20} className="text-cyber-pink" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-bold text-midnight dark:text-white">{name}</h2>
      </div>

      <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
        {description}
      </p>

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <span className="font-display text-[11px] uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
          {audience}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-midnight transition-colors duration-200 group-hover:text-cyber-pink dark:text-white">
          {cta}
          <IconArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
