export interface Video {
  id: number;
  title: string;
  video_url: string;
  likes: number;
  crypto_address: string;
  thumbnail_url: string;
  meme_origin: string; // Updated to match database column
  creator_name: string;
  dex_chart?: string; // Optional field for DEX chart URL
  description?: string; // Optional description for popup details
}
