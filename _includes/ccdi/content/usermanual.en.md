# CCDI Internship Platform User Manual (Student Applicant)

This document guides **student (international student) applicants** through completing the application at `/apply`, uploading documents, and finishing the **final submission**.

---

## 1) Quick Overview

1. Go to **Home (`/`) → Student Apply (`/apply`)**
2. The application has **6 steps**:

   - 1. Personal Information
   - 2. Academic Information
   - 3. Internship Preferences
   - 4. Document Upload
   - 5. Agreements
   - 6. Review & Submit

3. When submission succeeds, an **Application ID** is shown and your application is received.

---

## 2) Getting Started

### 2.1 Enter from the Home page

- On the Home screen, click **Student Apply** to go to `/apply`.
- In the top-right **LanguageSelect**, you can switch between Korean/English/Chinese/Japanese.

### 2.2 A “temporary session” is created automatically

When you open `/apply` for the first time, the system automatically creates an “application session” and stores it in your browser.

- You will see an **Application ID** on the left side (or on a top card on mobile).
- This session lets you continue without logging in.

> ⚠️ Important limitation (current implementation)
>
> - **Your inputs / upload status may NOT be restored on refresh (F5).**
>   Even if some data is stored on the server, the screen may not re-fill correctly, which can block your progress.
> - We strongly recommend avoiding refresh/tab close/browser close while filling out the form.

---

## 3) Saving Rules (Must Know)

### 3.1 Your data is saved only when you click “Next”

For steps **1, 2, 3, and 5**, your inputs are saved to the server **only when you click the `Next` button** in that step.

- If you jump steps directly (e.g., click Stepper 1 → 6),
  your typed content may **not** be saved on the server.

✅ Recommended workflow

- Fill required fields → click **`Next`** → move to the next step

Example

- In Step 1, after entering name/nationality/birthdate/phone/email/passport number,
  you must click **`Next`** to save Step 1 to the server.

### 3.2 Document upload starts immediately on file selection

In Step 4, documents are uploaded **as soon as you select a file**—even before clicking `Next`.

---

## 4) Step-by-step Guide

## Step 1) Personal Information

| Field | Required | Rule | Example |
|---|---:|---|---|
| Full Name | ✅ | Cannot be empty | `GIMON KANGHYUN AHN` |
| Nationality | ✅ | Select from list | `Korea (대한민국)` |
| Date of Birth | ✅ | Pick a date | `2002-03-15` |
| Phone | ✅ | **Digits only, 10–11 digits** (no hyphen) | `01012345678` |
| Email | ✅ | Valid email format | `user@example.com` |
| Passport No. | ✅ | At least 6 characters | `M1234567` |

> If the nationality list fails to load (error message shown)
>
> - It may be a network/server issue.
> - If you haven’t entered anything yet, a refresh may sometimes fix it.

---

## Step 2) Academic Information

University name and major are **required in both Korean and English**.

| Field | Required | Rule | Example |
|---|---:|---|---|
| University (Korean) | ✅ | Autocomplete after 2+ characters | `포항공과대학교` |
| University (English) | ✅ | Manual input / auto-filled | `POSTECH` |
| Major (Korean) | ✅ | Manual input | `컴퓨터공학` |
| Major (English) | ✅ | Manual input | `Computer Science` |
| Student ID | ⭕ | Optional | `2024xxxx` |
| Completed Semesters | ⭕ | Select a number | `4` |
| GPA | ⭕ | Range 0–5 | `3.78` |
| TOPIK | ⭕ | TOPIK 1–6 | `TOPIK 4` |
| Visa Type | ⭕ | Text | `D-2` |

University autocomplete tips (example)

- Type at least **2 characters** (e.g., `포항`) to see suggestions.
- Selecting an item fills **both Korean and English** fields.

---

## Step 3) Internship Preferences

| Field | Required | Rule | Example |
|---|---:|---|---|
| Preferred Field | ✅ | Select dropdown | `Advertising, Marketing` |
| Preferred Duration | ✅ | 3 months / 6 months / 1 year | `6 months` |
| Preferred Start Date | ✅ | Pick a date | `2026-07-01` |
| Preferred Region | ✅ | Select dropdown | `Seoul` |
| Preferred Company | ⭕ | Text | `ABC Studio` |
| Business Registration No. | ⭕ | Text | `123-45-67890` |
| Self Introduction | ⭕ | **Up to 600 characters** | (see example below) |
| Experience / Career | ⭕ | Free text | (free) |

Short self-introduction example

> “I would like to gain real-world experience through a content marketing internship in Korea. I previously handled promotion for a student club…”

---

## Step 4) Document Upload

### 4.1 Required Documents (5)

- Transcript (TRANSCRIPT)
- Enrollment Certificate (ENROLLMENT)
- Passport Copy (PASSPORT)
- Visa Copy (VISA)
- TOPIK Score Report (TOPIK)

### 4.2 Optional Document (if available)

- Portfolio (PORTFOLIO)

### 4.3 Upload Rules

- File types: **JPG / PNG / PDF**
- Max size: **10MB**
- Recommendations:
  - Documents issued within the last 3 months
  - Korean or English documents preferred

Upload example

- `transcript.pdf (2.3MB)` → If you see an “Upload complete” badge, you’re good.

If you see an error

- “Only jpg/png/pdf…” → check the file type
- “File must be ≤ 10MB…” → reduce size (lower scan resolution, etc.)
- “Upload failed: …” → possible network/file corruption/permission issue (retry)

---

## Step 5) Agreements

To submit, you must check **all 6 items**.

- Consent to collect/use personal information
- Policy agreement
- Consent to unique identification info
- Consent to sensitive information
- Consent to destruction (retention & disposal)
- Consent to third-party provision

> If any checkbox is missing, you’ll see an error like “You must agree to all to submit.”

---

## Step 6) Review & Submit

Before submission, confirm the checklist:

- Required fields completed
- All 5 required documents uploaded
- All agreement checkboxes checked

You can also expand **Input Preview (JSON)** to verify your final data.
(It is shown in a developer-style format and can help with final checking.)

### Final Submission

- When you click `Submit`, the server validates:
  - All agreements are checked
  - All 5 required documents are registered
- If valid, the application status becomes **SUBMITTED**.

---

## 5) After Submission (Success Page)

On success:

- Your **Application ID** is displayed.
- Next steps (summary):

  1. Admin reviews documents
  2. You may receive a request for additional info or an approval notice (via email/phone)
  3. Internship matching & process proceeds

✅ Recommendation

- **Screenshot / write down the Application ID**.
  (It’s the fastest identifier when you contact support.)

---

## 6) Common Issues & Fixes

### Q1. “I filled everything, but it won’t move to the next step.”

Usually a required-field validation issue.

- Phone number must be **10–11 digits, numbers only** (no hyphen)  
  Example: `010-1234-5678` ❌ → `01012345678` ✅
- Check email format
- Passport number must be at least 6 characters

### Q2. “There’s a Submit button in Step 6—can I submit without doing Steps 1–3?”

You can navigate on the screen, but server saving happens **only when you click `Next`** in each step.

- Even if you typed data in Steps 1–3, if you didn’t click `Next`, it may not be saved.
- ✅ Always click **`Next`** on each step to ensure saving.

### Q3. “After refreshing, my inputs/upload badges disappeared.”

With the current implementation, **screen restoration is not complete**.

- Avoid refreshing during the process.
- If you already refreshed:
  - You may need to re-enter and re-upload (especially Step 4 upload badges).

---

## 7) Privacy & Security Notes (User Perspective)

- Sensitive data like passport numbers is designed to be stored **in encrypted form** on the server.
- Uploaded documents are stored in a storage system, and admins access them via **time-limited signed URLs** when previewing/downloading.