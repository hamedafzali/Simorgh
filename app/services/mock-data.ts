export type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  type: "Full-time" | "Part-time" | "Internship";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  description: string;
};

export type CommunityEvent = {
  id: string;
  title: string;
  city: string;
  date: string;
  description: string;
};

export type DocumentGuide = {
  id: string;
  title: string;
  category: "Immigration" | "Jobcenter" | "Appointments";
  description: string;
};

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Warehouse Associate",
    company: "LogiBerlin GmbH",
    city: "Berlin",
    type: "Full-time",
    level: "A2",
    description:
      "Entry-level role. Helpful German, team spirit, and reliability. Training provided.",
  },
  {
    id: "2",
    title: "Restaurant Service",
    company: "Rhein Café",
    city: "Köln",
    type: "Part-time",
    level: "A1",
    description:
      "Part-time service role. Friendly communication and punctuality. Tip-based bonus.",
  },
  {
    id: "3",
    title: "Office Assistant",
    company: "Nord Solutions",
    city: "Hamburg",
    type: "Internship",
    level: "B1",
    description:
      "Support office operations. Email communication, scheduling, basic spreadsheets.",
  },
];

export const mockEvents: CommunityEvent[] = [
  {
    id: "e1",
    title: "German Conversation Night",
    city: "Berlin",
    date: "2025-12-21",
    description:
      "Practice German in a friendly group. Topics for A1–B2. Free entry.",
  },
  {
    id: "e2",
    title: "CV & Job Applications Workshop",
    city: "Köln",
    date: "2025-12-28",
    description:
      "Learn how to build a German CV and write application emails. Bring your laptop.",
  },
];

export const mockDocuments: DocumentGuide[] = [
  {
    id: "d1",
    title: "Residence Permit Checklist",
    category: "Immigration",
    description:
      "What to prepare before your Ausländerbehörde appointment: documents, copies, photos.",
  },
  {
    id: "d2",
    title: "Jobcenter: First Registration",
    category: "Jobcenter",
    description:
      "Steps and common forms when registering for support. Tips for appointments.",
  },
  {
    id: "d3",
    title: "Doctor Appointment Preparation",
    category: "Appointments",
    description: "What to bring, how to describe symptoms, and useful phrases.",
  },
];
