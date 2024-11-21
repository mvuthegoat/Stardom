interface PoolInfo {
  poolId: string;
  tokenLogo: string;
  tokenSymbol: string; // might be useful later
  tokenName: string; // might be useful later
}

export async function getTopPool(
  tokenAddress: string
): Promise<PoolInfo | null> {
  try {
    // Construct query parameters
    const poolParams = new URLSearchParams({
      mint1: tokenAddress,
      poolType: "all",
      poolSortField: "liquidity", // Sort by liquidity
      sortType: "desc", // Highest liquidity first
      pageSize: "1", // Only get the top pool
      page: "1",
    });

    const tokenParams = new URLSearchParams({
      mints: tokenAddress,
    });

    // Fetch both APIs concurrently
    const [poolResponse, tokenResponse] = await Promise.all([
      fetch(
        `https://api-v3.raydium.io/pools/info/mint?${poolParams.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      ),
      fetch(`https://api-v3.raydium.io/mint/ids?${tokenParams.toString()}`, {
        headers: {
          Accept: "application/json",
        },
      }),
    ]);

    // Check both responses
    if (!poolResponse.ok) {
      throw new Error(`API error for pool info: ${poolResponse.status}`);
    }
    if (!tokenResponse.ok) {
      throw new Error(`API error for token info: ${tokenResponse.status}`);
    }

    // Parse both responses concurrently
    const [poolData, tokenData] = await Promise.all([
      poolResponse.json(),
      tokenResponse.json(),
    ]);

    // Validate and construct the result
    if (
      poolData.success &&
      poolData.data.data.length > 0 &&
      tokenData.success &&
      tokenData.data.length > 0
    ) {
      const pool = poolData.data.data[0];
      const token = tokenData.data[0];
      return {
        poolId: pool.id,
        tokenLogo: token.logoURI,
        tokenSymbol: token.symbol,
        tokenName: token.name,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch top pool:", error);
    return null;
  }
}
