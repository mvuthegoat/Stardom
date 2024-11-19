import { Video } from "@/types/videoTypes";
import VideoGrid from "../VideoGrid/VideoGrid";

export function InspirationResults({ results }: { results: Video[] }) {
  if (results.length === 0) {
    return <div className="text-center py-8 text-gray-500">No results found</div>;
  }

  return (
    <div className="py-4">
      <VideoGrid videos={results} />
    </div>
  );
}
