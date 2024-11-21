import { SearchResults } from "../../../components/search/SearchResults";

interface SearchPageProps {
  params: Promise<{
    query: string;
  }>;
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { query } = await params; 
  const decodedQuery = decodeURIComponent(query);

  return <SearchResults query={decodedQuery} />;
}
