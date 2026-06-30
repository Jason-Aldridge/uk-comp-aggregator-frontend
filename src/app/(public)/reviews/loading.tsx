import { RadarLoader } from "@/components/ui/RadarLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-rr-bg">
      <RadarLoader size="lg" />
    </div>
  );
}
