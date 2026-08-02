const VantaBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-[#FAF9F5] dark:bg-[#0d0d12] overflow-hidden pointer-events-none transition-colors duration-300">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EDE4F9] dark:via-[#140b19] to-[#FAF3FF] dark:to-transparent opacity-95" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-cyber-pink/20 dark:bg-cyber-pink/10 blur-[130px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-lavender/30 dark:bg-lavender/5 blur-[100px] rounded-full" />
    </div>
  );
};

export default VantaBackground;
