import { Card } from "./Card";

export const PostSkeleton = () => (
  <Card className="animate-pulse">
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-[#e0e0e0] border border-[#333333]" />
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 bg-[#e0e0e0]" />
          <div className="w-16 h-2 bg-[#e0e0e0]" />
        </div>
      </div>
      <div className="w-3/4 h-5 bg-[#e0e0e0] mb-3" />
      <div className="flex flex-col gap-2 mb-2">
        <div className="w-full h-3 bg-[#e0e0e0]" />
        <div className="w-full h-3 bg-[#e0e0e0]" />
        <div className="w-5/6 h-3 bg-[#e0e0e0]" />
      </div>
    </div>
    <div className="px-4 py-3 flex items-center justify-between border-y border-[#333333] bg-[#f9f9f9]">
      <div className="w-16 h-3 bg-[#e0e0e0]" />
      <div className="w-20 h-3 bg-[#e0e0e0]" />
    </div>
    <div className="flex px-1 py-1 gap-1 bg-white">
      <div className="flex-1 h-8 bg-[#f0f0f0] border border-[#333333]" />
      <div className="flex-1 h-8 bg-[#f0f0f0] border border-[#333333]" />
    </div>
  </Card>
);
