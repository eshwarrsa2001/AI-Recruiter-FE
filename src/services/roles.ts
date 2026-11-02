const ROLE_SUMMARIES: Record<string, string> = {
  "TA Admin": "Administers talent acquisition for the organization.",
  TA: "Runs talent acquisition for open roles.",
  Interviewer: "Interviews candidates for open roles.",
  Candidate: "Applies for roles and follows the interview process.",
};

export function roleSummary(role: string): string | null {
  const summary = ROLE_SUMMARIES[role];
  if (summary === undefined) {
    return null;
  }
  return summary;
}
