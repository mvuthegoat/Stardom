// import { Card, CardContent } from "@/components/ui/card";
// import Link from "next/link";
// import Image from "next/image";

// interface MemeStats {
//   meme_origin: string;
//   total_videos: number;
//   total_likes: number;
//   latest_video_date: string;
//   original_image_key: string;
// }

// interface MemecoinResultsProps {
//   results: MemeStats[];
// }

// export const MemecoinResults = ({ results }: MemecoinResultsProps) => {
//   if (results.length === 0) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         No memecoins found matching your search.
//       </div>
//     );
//   }

//   const formatPrice = (price: number = 0.25) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 6,
//     }).format(price);
//   };

//   const formatMarketCap = (marketCap: number = 1200000000) => {
//     if (marketCap >= 1e9) {
//       return `$${(marketCap / 1e9).toFixed(2)}B`;
//     }
//     if (marketCap >= 1e6) {
//       return `$${(marketCap / 1e6).toFixed(2)}M`;
//     }
//     return `$${(marketCap / 1e3).toFixed(2)}K`;
//   };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
//       {results.map((meme) => (
//         <Card
//           key={meme.meme_origin}
//           className="group bg-white hover:bg-gray-50 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md rounded-xl overflow-hidden"
//         >
//           <Link href={`/meme/${encodeURIComponent(meme.meme_origin)}`}>
//             <CardContent className="p-4 flex flex-col gap-4">
//               {/* Image container with improved aspect ratio */}
//               <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
//                 <img
//                   src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${meme.original_image_key}`}
//                   alt={meme.meme_origin}
//                   className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
//                 />
//               </div>

//               {/* Content section */}
//               <div className="space-y-3">
//                 <h3 className="font-semibold text-gray-900 truncate">
//                   {meme.meme_origin}
//                 </h3>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-500">Price</span>
//                     <span className="font-medium text-gray-900">
//                       {formatPrice()}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-500">Market Cap</span>
//                     <span className="font-medium text-gray-900">
//                       {formatMarketCap()}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="pt-2">
//                   <div className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-lg text-center transition-colors duration-200 hover:bg-gray-900">
//                     View Details
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Link>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default MemecoinResults;
