import { IconChartLine, IconMusic, type Icon } from "@tabler/icons-react";

export interface HouseProduct {
  /** Product name as it appears in the house and the navbar. */
  name: string;
  /** One honest line. No adjectives that the product does not earn. */
  description: string;
  /** Who it is for, in three words or fewer. */
  audience: string;
  cta: string;
  href: string;
  icon: Icon;
}

export const PRODUCTS: HouseProduct[] = [
  {
    name: "doba music",
    description:
      "Release a track as a song token your fans can collect and stream for free, before the streaming platforms have it.",
    audience: "for artists and collectors",
    cta: "Go to doba music",
    href: "/music",
    icon: IconMusic,
  },
  {
    name: "paps",
    description:
      "Trade perpetuals on live Strike prices with paper money, and see the price you get closed out at before you swipe.",
    audience: "for traders",
    cta: "Go to paps",
    href: "/paps",
    icon: IconChartLine,
  },
];
