export interface Video {
  id: number;
  creator_id: string;
  title: string;
  description?: string; // Optional description for popup details
  video_key?: string;
  original_image_key?: string;
  likes: number;
  crypto_address?: string;
  meme_origin: string; // Updated to match database column
  dex_chart?: string; // Optional field for DEX chart URL
}
