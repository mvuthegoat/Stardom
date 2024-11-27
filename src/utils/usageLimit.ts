const GENERATION_LIMIT = 2;
const STORAGE_KEY = "fun_generation_tracking";

interface UsageTracking {
  deviceId: string;
  generationCount: number;
  lastReset: number;
  hasBonusGeneration: boolean;
}

export const getDeviceId = () => {
  const existingId = localStorage.getItem("device_id");
  if (existingId) return existingId;

  const newId = crypto.randomUUID();
  localStorage.setItem("device_id", newId);
  return newId;
};

export const checkGenerationLimit = () => {
  try {
    const tracking = localStorage.getItem(STORAGE_KEY);
    const currentData: UsageTracking = tracking
      ? JSON.parse(tracking)
      : {
          deviceId: getDeviceId(),
          generationCount: 0,
          lastReset: Date.now(),
          hasBonusGeneration: false,
        };

    return {
      canGenerate: currentData.generationCount < GENERATION_LIMIT,
      remaining: Math.max(0, GENERATION_LIMIT - currentData.generationCount),
      hasBonusGeneration: currentData.hasBonusGeneration,
    };
  } catch (error) {
    console.error("Error checking generation limit:", error);
    return { canGenerate: false, remaining: 0, hasBonusGeneration: false };
  }
};

export const incrementGenerationCount = () => {
  try {
    const tracking = localStorage.getItem(STORAGE_KEY);
    const currentData: UsageTracking = tracking
      ? JSON.parse(tracking)
      : {
          deviceId: getDeviceId(),
          generationCount: 0,
          lastReset: Date.now(),
          hasBonusGeneration: false,
        };

    currentData.generationCount += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  } catch (error) {
    console.error("Error incrementing generation count:", error);
  }
};

export const addBonusGeneration = () => {
  try {
    const tracking = localStorage.getItem(STORAGE_KEY);
    const currentData: UsageTracking = tracking
      ? JSON.parse(tracking)
      : {
          deviceId: getDeviceId(),
          generationCount: 0,
          lastReset: Date.now(),
          hasBonusGeneration: false,
        };

    // Only allow bonus generation once
    if (!currentData.hasBonusGeneration) {
      currentData.generationCount = Math.max(
        0,
        currentData.generationCount - 1
      );
      currentData.hasBonusGeneration = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    }
  } catch (error) {
    console.error("Error adding bonus generation:", error);
  }
};
