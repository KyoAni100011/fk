export const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-[3px]", lg: "w-8 h-8 border-4" };
  return (
    <span className={`${sizes[size]} border-[#333333] border-t-transparent border-l-transparent rounded-full animate-spin inline-block`}></span>
  );
};
