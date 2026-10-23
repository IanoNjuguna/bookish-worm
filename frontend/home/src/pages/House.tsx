import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/doba/PageLayout";
import { ProductCard } from "@/components/house/ProductCard";
import { PRODUCTS } from "@/components/house/products";

const ITEM_LIST = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "doba products",
  itemListElement: PRODUCTS.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: product.name,
    url: `https://doba.world${product.href}`,
  })),
};

const House = () => {
  return (
    <>
      <Helmet>
        <title>doba | music collectibles and paper perpetuals</title>
        <meta
          name="description"
          content="doba makes two products: doba music, where artists release song tokens fans can collect and stream free, and paps, a perpetuals app that shows your liquidation price before you swipe."
        />
        <meta property="og:title" content="doba | music collectibles and paper perpetuals" />
        <meta
          property="og:description"
          content="Two products: song tokens for artists and their fans, and a perpetuals app that writes the risk down."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="doba | music collectibles and paper perpetuals" />
        <meta
          name="twitter:description"
          content="Two products: song tokens for artists and their fans, and a perpetuals app that writes the risk down."
        />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/" />
        <script type="application/ld+json">{JSON.stringify(ITEM_LIST)}</script>
      </Helmet>

      <PageLayout maxWidth="5xl">
        <header className="mb-12 sm:mb-16">
          <h1 className="text-4xl font-black tracking-tight text-midnight dark:text-white sm:text-5xl">
            doba makes two products.
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            doba music turns a release into a song token fans can collect and stream for free,
            before the streaming platforms have it. paps trades perpetuals on your phone and tells
            you where you would be liquidated before you swipe. Pick the one you came for.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
          The <Link to="/for-artists" className="text-midnight underline decoration-cyber-pink/40 underline-offset-4 hover:decoration-cyber-pink dark:text-white">artist pages</Link>,{" "}
          <Link to="/research" className="text-midnight underline decoration-cyber-pink/40 underline-offset-4 hover:decoration-cyber-pink dark:text-white">the research</Link> and{" "}
          <Link to="/docs" className="text-midnight underline decoration-cyber-pink/40 underline-offset-4 hover:decoration-cyber-pink dark:text-white">the docs</Link>{" "}
          all describe doba music. paps has its own landing and its own app.
        </p>
      </PageLayout>
    </>
  );
};

export default House;
