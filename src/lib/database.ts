import { prisma } from "./db";
import { RateNameResponse, SavedNameData } from "./types";

function mapSavedNameToData(savedName: any): SavedNameData {
  return {
    id: savedName.id,
    userId: savedName.userId,
    firstName: savedName.firstName,
    lastName: savedName.lastName,
    fullName: savedName.fullName,
    gender: savedName.gender,
    origin: savedName.origin,
    feedback: savedName.feedback,
    popularity: savedName.popularity,
    middleNames: savedName.middleNames,
    similarNames: savedName.similarNames,
    savedAt: savedName.savedAt,
  };
}

function mapPrismaToData<T, R>(mapper: (item: T) => R) {
  return (items: T[]): R[] => items.map(mapper);
}

const mapSavedNames = mapPrismaToData(mapSavedNameToData);

export async function saveNameWithMetadata(
  userId: string,
  firstName: string,
  lastName: string,
  gender: string,
  metadata: RateNameResponse
): Promise<{ success: boolean; error?: any; savedName?: SavedNameData }> {
  try {
    const fullName = `${firstName} ${lastName}`;

    // Check if this name/style combination already exists for this user
    const existingName = await prisma.savedName.findUnique({
      where: {
        userId_firstName_lastName_gender: {
          userId,
          firstName,
          lastName,
          gender,
        },
      },
    });

    if (existingName) {
      // Update existing record
      const updatedName = await prisma.savedName.update({
        where: { id: existingName.id },
        data: {
          origin: metadata.origin,
          feedback: metadata.feedback,
          popularity: metadata.popularity,
          middleNames: metadata.middleNames,
          similarNames: metadata.similarNames,
          savedAt: new Date(),
        },
      });

      return {
        success: true,
        savedName: mapSavedNameToData(updatedName),
      };
    }

    // Create new record
    const savedName = await prisma.savedName.create({
      data: {
        userId,
        firstName,
        lastName,
        fullName,
        gender,
        origin: metadata.origin,
        feedback: metadata.feedback,
        popularity: metadata.popularity,
        middleNames: metadata.middleNames,
        similarNames: metadata.similarNames,
      },
    });

    return {
      success: true,
      savedName: mapSavedNameToData(savedName),
    };
  } catch (error) {
    console.error("Error saving name with metadata:", error);
    return { success: false, error };
  }
}

export async function getSavedNamesWithMetadata(
  userId: string
): Promise<SavedNameData[]> {
  try {
    const savedNames = await prisma.savedName.findMany({
      where: { userId },
      orderBy: { savedAt: "desc" },
    });

    return mapSavedNames(savedNames);
  } catch (error) {
    console.error("Error getting saved names with metadata:", error);
    return [];
  }
}

export async function getSavedNameByLookup(
  userId: string,
  firstName: string,
  lastName: string,
  gender: string
): Promise<SavedNameData | null> {
  try {
    const savedName = await prisma.savedName.findUnique({
      where: {
        userId_firstName_lastName_gender: {
          userId,
          firstName,
          lastName,
          gender,
        },
      },
    });

    if (!savedName) return null;

    return mapSavedNameToData(savedName);
  } catch (error) {
    console.error("Error getting saved name by lookup:", error);
    return null;
  }
}

export async function removeNameWithMetadata(userId: string, nameId: string) {
  try {
    // Verify the name belongs to the user before deleting
    const savedName = await prisma.savedName.findFirst({
      where: {
        id: nameId,
        userId,
      },
    });

    if (!savedName) {
      return { success: false, error: "Name not found or access denied" };
    }

    await prisma.savedName.delete({
      where: { id: nameId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing name with metadata:", error);
    return { success: false, error };
  }
}

// Helper function to get or create a user
export async function getOrCreateUser(
  email: string,
  name?: string,
  image?: string
) {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        image: image || undefined,
      },
      create: {
        email,
        name,
        image,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting or creating user:", error);
    throw error;
  }
}

// Cache functions for global name caching
export async function getCachedName(
  firstName: string,
  lastName: string,
  gender: string
): Promise<RateNameResponse | null> {
  try {
    const cachedName = await prisma.nameCache.findUnique({
      where: {
        firstName_lastName_gender: {
          firstName,
          lastName,
          gender,
        },
      },
    });

    if (!cachedName) return null;

    // Update access statistics
    await prisma.nameCache.update({
      where: { id: cachedName.id },
      data: {
        lastAccessed: new Date(),
        accessCount: {
          increment: 1,
        },
      },
    });

    return {
      origin: cachedName.origin,
      feedback: cachedName.feedback,
      popularity: cachedName.popularity,
      middleNames: cachedName.middleNames,
      similarNames: cachedName.similarNames,
    };
  } catch (error) {
    console.error("Error getting cached name:", error);
    return null;
  }
}

export async function saveToCache(
  firstName: string,
  lastName: string,
  gender: string,
  metadata: RateNameResponse
): Promise<boolean> {
  try {
    const fullName = `${firstName} ${lastName}`;

    await prisma.nameCache.upsert({
      where: {
        firstName_lastName_gender: {
          firstName,
          lastName,
          gender,
        },
      },
      update: {
        origin: metadata.origin,
        feedback: metadata.feedback,
        popularity: metadata.popularity,
        middleNames: metadata.middleNames,
        similarNames: metadata.similarNames,
        lastAccessed: new Date(),
      },
      create: {
        firstName,
        lastName,
        fullName,
        gender,
        origin: metadata.origin,
        feedback: metadata.feedback,
        popularity: metadata.popularity,
        middleNames: metadata.middleNames,
        similarNames: metadata.similarNames,
      },
    });

    return true;
  } catch (error) {
    console.error("Error saving to cache:", error);
    return false;
  }
}

export async function cleanupOldCache(
  olderThanDays: number = 30
): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.nameCache.deleteMany({
      where: {
        lastAccessed: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  } catch (error) {
    console.error("Error cleaning up old cache:", error);
    return 0;
  }
}

export async function getCacheStats() {
  try {
    const [totalEntries, oldestEntry, mostAccessed] = await Promise.all([
      prisma.nameCache.count(),
      prisma.nameCache.findFirst({
        orderBy: { lastAccessed: "asc" },
        select: { lastAccessed: true },
      }),
      prisma.nameCache.findFirst({
        orderBy: { accessCount: "desc" },
        select: { firstName: true, lastName: true, accessCount: true },
      }),
    ]);

    return {
      totalEntries,
      oldestEntry: oldestEntry?.lastAccessed,
      mostAccessed: mostAccessed
        ? {
            name: `${mostAccessed.firstName} ${mostAccessed.lastName}`,
            accessCount: mostAccessed.accessCount,
          }
        : null,
    };
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return null;
  }
}
