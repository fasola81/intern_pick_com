import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internship Rules & Minimum Wage Guide | InternPick",
  description: "A complete guide for students and employers regarding paid vs unpaid internships, FLSA rules, and state minimum wages.",
  openGraph: {
    title: "Internship Rules & Minimum Wage Guide | InternPick",
    description: "A complete guide for students and employers regarding paid vs unpaid internships, FLSA rules, and state minimum wages.",
    url: "https://www.internpick.com/internship-rules",
    images: ["/images/hero_background.png"],
  },
};

export default function InternshipRulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
