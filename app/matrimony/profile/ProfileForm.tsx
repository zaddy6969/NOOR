"use client";

import { useActionState } from "react";
import type { MatrimonyProfile } from "@/db/matrimony";
import { saveProfileAction, type ProfileActionState } from "./actions";

const emptyState: ProfileActionState = { ok: false, message: "", errors: {} };

export default function ProfileForm({ profile }: { profile: MatrimonyProfile | null }) {
  const [state, formAction, pending] = useActionState(saveProfileAction, emptyState);
  const currentYear = new Date().getFullYear();

  return (
    <form className="profile-form" action={formAction}>
      <div className="profile-form-head"><div><p className="eyebrow">PRIVATE PROFILE</p><h1>{profile ? "Edit your draft" : "Create your draft"}</h1><p>Only your account can read or update this record. Every save keeps it private and returns its moderation status to draft.</p></div><span><b>Visibility</b>Only you</span></div>

      <section className="profile-form-section"><div><span>01</span><h2>About you</h2><p>Use broad, accurate details. Do not include a phone number, email, workplace name or exact address.</p></div><div className="profile-field-grid">
        <label><span>Display name or initials</span><input name="displayName" defaultValue={profile?.displayName} maxLength={60} required aria-invalid={Boolean(state.errors.displayName)} />{state.errors.displayName && <small>{state.errors.displayName}</small>}</label>
        <label><span>Gender</span><select name="gender" defaultValue={profile?.gender ?? "undisclosed"} aria-invalid={Boolean(state.errors.gender)}><option value="undisclosed">Prefer not to display yet</option><option value="man">Man</option><option value="woman">Woman</option></select>{state.errors.gender && <small>{state.errors.gender}</small>}</label>
        <label><span>Birth year</span><input name="birthYear" type="number" min={currentYear - 90} max={currentYear - 18} defaultValue={profile?.birthYear ?? currentYear - 18} required aria-invalid={Boolean(state.errors.birthYear)} />{state.errors.birthYear && <small>{state.errors.birthYear}</small>}</label>
        <label><span>Marital status</span><select name="maritalStatus" defaultValue={profile?.maritalStatus ?? "never_married"}><option value="never_married">Never married</option><option value="divorced">Divorced</option><option value="widowed">Widowed</option><option value="other">Other / discuss privately</option></select></label>
        <label><span>City or district only</span><input name="city" defaultValue={profile?.city} maxLength={80} required aria-invalid={Boolean(state.errors.city)} />{state.errors.city && <small>{state.errors.city}</small>}</label>
        <label><span>Country</span><input name="country" defaultValue={profile?.country ?? "India"} maxLength={80} required aria-invalid={Boolean(state.errors.country)} />{state.errors.country && <small>{state.errors.country}</small>}</label>
      </div></section>

      <section className="profile-form-section"><div><span>02</span><h2>Life and compatibility</h2><p>Keep descriptions truthful and concise. Sensitive matters can be discussed through a future moderated process.</p></div><div className="profile-field-grid">
        <label><span>Education</span><input name="education" defaultValue={profile?.education} maxLength={120} /></label>
        <label><span>Profession or field</span><input name="profession" defaultValue={profile?.profession} maxLength={120} /></label>
        <label className="profile-wide-field"><span>Faith practice and values</span><textarea name="religiousPractice" defaultValue={profile?.religiousPractice} maxLength={240} rows={4} placeholder="For example: prayer, learning goals, family values and the Islamic environment you hope to build." /></label>
        <label className="profile-wide-field"><span>Short introduction</span><textarea name="bio" defaultValue={profile?.bio} maxLength={600} rows={7} required aria-invalid={Boolean(state.errors.bio)} placeholder="Describe your serious intentions, character, interests and broad compatibility expectations. Do not add contact details." />{state.errors.bio && <small>{state.errors.bio}</small>}</label>
        <label className="profile-check"><input name="guardianInvolved" type="checkbox" defaultChecked={profile?.guardianInvolved} /><span><b>Family or guardian involvement</b>I would like a wali, family member or trusted advocate involved in the process.</span></label>
      </div></section>

      <div className="profile-submit-row"><div><strong>Draft only</strong><span>Saving does not publish your profile or make it searchable.</span></div><button type="submit" disabled={pending}>{pending ? "Saving…" : "Save private draft"}</button></div>
      {state.message && <p className={state.ok ? "profile-message success" : "profile-message"} role="status">{state.message}</p>}
    </form>
  );
}
