import { prisma } from "./db";
import {
  RateNameResponse,
  SavedNameData,
  Gender,
  PromptFeedbackData,
} from "./types";

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
    rank: savedName.rank,
  };
}

function mapPrismaToData<T, R>(mapper: (item: T) => R) {
  return (items: T[]): R[] => items.map(mapper);
}

const mapSavedNames = mapPrismaToData(mapSavedNameToData);

export async function saveName(
  familyId: string,
  userId: string,
  firstName: string,
  lastName: string,
  gender: Gender,
  metadata: RateNameResponse
): Promise<{ success: boolean; error?: any; savedName?: SavedNameData }> {
  try {
    // Check if this name/style combination already exists for this user
    const existingName = await prisma.savedName.findFirst({
      where: {
        firstName,
        lastName,
        gender,
        familyId,
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

    // Get the next rank for this family and gender (0-based)
    const maxRank = await prisma.savedName.aggregate({
      where: {
        familyId,
        gender,
      },
      _max: { rank: true },
    });
    const nextRank = (maxRank._max.rank ?? -1) + 1; // Use -1 as base, so first item gets rank 0

    // Create new record
    const savedName = await prisma.savedName.create({
      data: {
        userId,
        familyId,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        gender,
        origin: metadata.origin,
        feedback: metadata.feedback,
        popularity: metadata.popularity,
        middleNames: metadata.middleNames,
        similarNames: metadata.similarNames,
        rank: nextRank, // Set the rank within this gender
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

export async function getSavedNames(
  familyId: string
): Promise<SavedNameData[]> {
  try {
    const savedNames = await prisma.savedName.findMany({
      where: { familyId },
      orderBy: [
        { gender: "asc" }, // Boys first, then girls
        { rank: "asc" }, // Then by rank within each gender
      ],
    });

    return mapSavedNames(savedNames);
  } catch (error) {
    console.error("Error getting saved names with metadata:", error);
    return [];
  }
}

export async function getSavedNameByLookup(
  familyId: string,
  firstName: string,
  lastName: string,
  gender: Gender
): Promise<SavedNameData | null> {
  try {
    const savedName = await prisma.savedName.findFirst({
      where: {
        firstName,
        lastName,
        gender,
        familyId,
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

    if (!user.familyId) {
      const family = await prisma.family.create({ data: {} });
      await prisma.user.update({
        where: { id: user.id },
        data: { familyId: family.id },
      });
    }

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

    return cachedName;
  } catch (error) {
    console.error("Error getting cached name:", error);
    return null;
  }
}

export async function saveToCache(
  nameData: RateNameResponse
): Promise<boolean> {
  try {
    console.log("saveToCache", { nameData });
    const { firstName, lastName, gender, ...metadata } = nameData;
    const fullName = `${nameData.firstName} ${nameData.lastName}`;

    await prisma.nameCache.upsert({
      where: {
        firstName_lastName_gender: {
          firstName: nameData.firstName,
          lastName: nameData.lastName,
          gender: nameData.gender,
        },
      },
      update: {
        ...nameData,
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

export async function getShareURL(familyId: string): Promise<string | null> {
  const family = await prisma.family.findUnique({
    where: { id: familyId },
  });

  if (!family) {
    return null;
  }

  const inviteToken = crypto.randomUUID();

  const shareURL = `${process.env.NEXT_PUBLIC_APP_URL}/share/${inviteToken}`;

  await prisma.family.update({
    where: { id: familyId },
    data: { inviteToken },
  });

  return shareURL;
}

export async function joinFamily(
  userId: string,
  inviteToken: string
): Promise<boolean> {
  const family = await prisma.family.findUnique({
    where: { inviteToken },
  });

  if (!family) {
    return false;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { familyId: family.id },
  });

  return true;
}

export async function leaveFamily(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { familyId: null },
  });
}

// Updated function to update ranks after reordering (gender-specific)
export async function updateNameRanks(
  familyId: string,
  gender: Gender,
  nameIds: string[]
): Promise<boolean> {
  try {
    // Use a transaction to update all ranks atomically
    await prisma.$transaction(
      nameIds.map((nameId, index) =>
        prisma.savedName.update({
          where: { id: nameId },
          data: { rank: index }, // Use index directly (0-based)
        })
      )
    );

    return true;
  } catch (error) {
    console.error("Error updating name ranks:", error);
    return false;
  }
}

export async function savePromptHistory(
  id: string,
  prompt: string,
  modelName: string,
  topP: number,
  minTokens: number,
  temperature: number,
  presencePenalty: number
) {
  await prisma.promptHistory.upsert({
    where: { id },
    update: {
      usageCount: { increment: 1 },
      lastUsed: new Date(),
    },
    create: {
      id,
      prompt,
      modelName,
      topP,
      minTokens,
      temperature,
      presencePenalty,
    },
  });
}

export async function savePromptFeedback(
  promptId: string,
  feedback: PromptFeedbackData,
  userId?: string
) {
  try {
    await prisma.promptFeedback.create({
      data: {
        promptId,
        userId,
        analysisFeedback: feedback.analysisFeedback,
        analysisFeedbackQuant: feedback.analysisFeedbackQuant,
        originFeedback: feedback.originFeedback,
        originFeedbackQuant: feedback.originFeedbackQuant,
        popularityFeedback: feedback.popularityFeedback,
        popularityFeedbackQuant: feedback.popularityFeedbackQuant,
        similarNamesFeedback: feedback.similarNamesFeedback,
        similarNamesFeedbackQuant: feedback.similarNamesFeedbackQuant,
        middleNamesFeedback: feedback.middleNamesFeedback,
        middleNamesFeedbackQuant: feedback.middleNamesFeedbackQuant,
      },
    });
  } catch (error) {
    console.error("Error saving prompt feedback:", error);
    throw error;
  }
}
