import type { ChecklistsBundle } from "@/services/checklists";
import type { ContentBundle } from "@/services/content";
import type { EventsBundle } from "@/services/events";
import type { JobsBundle } from "@/services/jobs";
import type { LearnBundle } from "@/services/learn";
import type { TutorBundle } from "@/services/learnTutor";

// Central place for mock test data used when remote APIs are unavailable.
// These bundles mirror the structures expected by the runtime services and
// are usually backed by JSON files in assets/content.

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const mockJobsBundle: JobsBundle = require("@/assets/content/jobs-v1.json");

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const mockEventsBundle: EventsBundle = require("@/assets/content/events-v1.json");

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const mockLearnBundle: LearnBundle = require("@/assets/content/learn-v1.json");

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const mockContentBundle: ContentBundle = require("@/assets/content/content-v1.json");

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const mockChecklistsBundle: ChecklistsBundle = require("@/assets/content/checklists-v1.json");

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const mockTutorBundle: TutorBundle = require("@/assets/content/learn-tutor-v1.json");
