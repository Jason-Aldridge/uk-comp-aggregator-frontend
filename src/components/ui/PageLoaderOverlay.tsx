import { RadarLoader } from "@/components/ui/RadarLoader";

export function PageLoaderOverlay() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-rr-bg/72 backdrop-blur-[2px]">
      <RadarLoader size="lg" className="scale-[1.45]" />
    </div>
  );
}