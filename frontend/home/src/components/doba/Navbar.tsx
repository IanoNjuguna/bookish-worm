import { motion } from "framer-motion";
import { AuthButton } from "./AuthButton";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 inset-x-0 mx-auto z-50 w-[calc(100%-2rem)] max-w-6xl glass-surface border border-white/5 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <img src="/doba.png" alt="Doba Logo" className="w-8 h-8 object-contain" />
            <span className="text-white text-base font-semibold">doba protocol</span>
          </a>

        </div>
        <div className="flex items-center gap-6">
          <AuthButton />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
