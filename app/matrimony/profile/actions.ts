"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { saveMatrimonyProfile } from "@/db/matrimony";

export type ProfileActionState = {
  ok: boolean;
  message: string;
  errors: Record<string, string>;
};

const genders = new Set(["man", "woman", "undisclosed"]);
const maritalStatuses = new Set(["never_married", "divorced", "widowed", "other"]);

function textValue(formData: FormData, name: string, max: number) {
  const value = String(formData.get(name) ?? "").trim().replace(/\s+/g, " ");
  return value.slice(0, max);
}

export async function saveProfileAction(_previous: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Please sign in again before saving.", errors: {} };

  const displayName = textValue(formData, "displayName", 60);
  const gender = textValue(formData, "gender", 20);
  const birthYear = Number(formData.get("birthYear"));
  const city = textValue(formData, "city", 80);
  const country = textValue(formData, "country", 80);
  const maritalStatus = textValue(formData, "maritalStatus", 24);
  const education = textValue(formData, "education", 120);
  const profession = textValue(formData, "profession", 120);
  const religiousPractice = textValue(formData, "religiousPractice", 240);
  const bio = textValue(formData, "bio", 600);
  const guardianInvolved = formData.get("guardianInvolved") === "on";
  const currentYear = new Date().getFullYear();
  const errors: Record<string, string> = {};

  if (displayName.length < 2) errors.displayName = "Use at least 2 characters.";
  if (!genders.has(gender)) errors.gender = "Choose a valid option.";
  if (!Number.isInteger(birthYear) || birthYear > currentYear - 18 || birthYear < currentYear - 90) errors.birthYear = "Profiles are limited to adults aged 18–90.";
  if (city.length < 2) errors.city = "Add only your city or district—not an address.";
  if (country.length < 2) errors.country = "Add your country.";
  if (!maritalStatuses.has(maritalStatus)) errors.maritalStatus = "Choose a valid status.";
  if (bio.length < 30) errors.bio = "Write at least 30 characters about serious intentions and compatibility.";

  if (Object.keys(errors).length) return { ok: false, message: "Please correct the highlighted details.", errors };

  try {
    await saveMatrimonyProfile(userId, {
      displayName,
      gender: gender as "man" | "woman" | "undisclosed",
      birthYear,
      city,
      country,
      maritalStatus: maritalStatus as "never_married" | "divorced" | "widowed" | "other",
      education,
      profession,
      religiousPractice,
      guardianInvolved,
      bio,
    });
    revalidatePath("/matrimony/profile");
    return { ok: true, message: "Your private draft has been saved.", errors: {} };
  } catch {
    return { ok: false, message: "The profile database is temporarily unavailable. Please try again shortly.", errors: {} };
  }
}
