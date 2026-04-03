export const Loader = ({ fullScreen = true }: { fullScreen?: boolean }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? "h-screen bg-white" : "py-20"}`}>
      <div className="relative w-16 h-16 border-4 border-[#333333] shadow-[6px_6px_0_0_#333333] mb-8 bg-[#f0f0f0] animate-[spin_1s_ease-in-out_infinite]">
        <div className="absolute inset-2 bg-black border-2 border-white animate-pulse" />
      </div>
      <div className="font-bold text-black border-b-4 border-black animate-pulse uppercase tracking-widest px-2 text-xl">
        DATA._
      </div>
    </div>
  );
};
