import type { Analysis } from "./schema";

export interface Fixture {
  id: string;
  label: string;
  businessType: string;
  business: string;
  platform: string;
  stars: number;
  reviewText: string;
  recorded: Analysis;
}

/**
 * Realistic demo + test data. With no ANTHROPIC_API_KEY set, these recorded
 * responses are replayed so the whole app works offline. Every reply obeys the
 * safety guardrails (no liability, no unauthorized refunds, no troll-baiting).
 */
export const FIXTURES: Fixture[] = [
  {
    id: "restaurant-1star",
    label: "Restaurant · 1★ furious",
    businessType: "Restaurant",
    business: "The Copper Table",
    platform: "Google",
    stars: 1,
    reviewText:
      "Worst dinner ever. We waited over an hour for cold food and the server was rude the entire time. Completely ruined our anniversary. Never coming back.",
    recorded: {
      intentLine:
        "A guest whose anniversary was ruined by a long wait, cold food, and a rude server — publicly done with you and wanting to be heard.",
      temperature: "Furious, feels disrespected",
      replies: [
        {
          strategyId: "de-escalate",
          strategy: "De-escalate & Reassure",
          text: "I'm so sorry — this is not the night you deserved, especially for your anniversary. A long wait, cold food, and a server who made it worse is completely on us, and I understand why you're upset. I'd genuinely like to make this right. Could you email me at hello@thecoppertable.com so I can look into exactly what happened that evening?",
        },
        {
          strategyId: "hold-the-line",
          strategy: "Hold the Line",
          text: "Thank you for the feedback — I take it seriously. The wait and the cold food fall short of our standard and I'm addressing it with the team directly. I'm sorry the service felt rude; that's never our intent. I'd welcome the chance to hear more so we can do better — please reach out at hello@thecoppertable.com.",
        },
        {
          strategyId: "save-the-account",
          strategy: "Win Them Back",
          text: "An anniversary should be effortless, and we clearly let you down. I've shared this with the floor and kitchen leads so it doesn't happen again. I'd love the opportunity to show you the experience we're actually known for — please email me at hello@thecoppertable.com and I'll personally take care of your next visit.",
        },
      ],
      managerAlert:
        "Genuine service failure (60+ min wait, cold food, rude server) on a milestone occasion. Pull the ticket and the shift, speak with the server, and have the owner reach out to the guest personally.",
    },
  },
  {
    id: "salon-troll-1star",
    label: "Salon · 1★ likely fake",
    businessType: "Salon",
    business: "Lume Hair Studio",
    platform: "Google",
    stars: 1,
    reviewText: "scam. terrible. do not go.",
    recorded: {
      intentLine:
        "A vague, specific-free 1-star with no booking details — more likely a mistaken listing, a competitor, or a troll than a real client.",
      temperature: "Hostile, no specifics",
      replies: [
        {
          strategyId: "hold-the-line",
          strategy: "Hold the Line",
          text: "We take every review seriously, but we can't find a booking or visit matching this. If you've been in with us, we'd truly like to understand what went wrong — please reach out at hello@lumehair.com. If this was posted in error or meant for another business, we'd appreciate it being removed.",
        },
        {
          strategyId: "de-escalate",
          strategy: "De-escalate & Reassure",
          text: "We're sorry you feel this way. We don't have any record that matches, so we'd love the chance to make it right — could you share a few details at hello@lumehair.com? Our door is always open.",
        },
        {
          strategyId: "save-the-account",
          strategy: "Win Them Back",
          text: "If you've visited us, we'd genuinely like to turn this around — reach out at hello@lumehair.com and we'll make sure your next experience reflects the care our clients know us for.",
        },
      ],
      managerAlert:
        "No specifics and no matching booking — likely fake or misdirected. Verify against records; if no match, keep the public reply calm and report it to the platform for removal.",
    },
  },
  {
    id: "shop-refund-2star",
    label: "Shop · 2★ chargeback threat",
    businessType: "Online shop",
    business: "Northbound Goods",
    platform: "Facebook",
    stars: 2,
    reviewText:
      "My order arrived damaged and you've ignored two of my emails now. I'll be doing a chargeback and warning everyone I know to avoid this store.",
    recorded: {
      intentLine:
        "A let-down customer with a real failure (damaged item + ignored emails) now escalating to a chargeback and public warning.",
      temperature: "Frustrated, escalating",
      replies: [
        {
          strategyId: "de-escalate",
          strategy: "De-escalate & Reassure",
          text: "I'm sorry — a damaged order and silence on your emails is exactly the opposite of how we want to treat you, and I understand the frustration. I want to get this sorted today. Please email me directly at care@northboundgoods.com with your order number and I'll personally make sure it's handled.",
        },
        {
          strategyId: "save-the-account",
          strategy: "Win Them Back",
          text: "This isn't the experience we stand for, and I'd like the chance to fix it properly. If you send your order number to care@northboundgoods.com, I'll look into it right away and we'll find the right resolution together. I'd really appreciate the opportunity to make it up to you.",
        },
        {
          strategyId: "hold-the-line",
          strategy: "Hold the Line",
          text: "Thank you for flagging this — a damaged item and missed emails are not acceptable and I'm sorry. We do want to resolve it directly; please reach out at care@northboundgoods.com with your order details so we can make it right.",
        },
      ],
      managerAlert:
        "Urgent: damaged item + two ignored emails + chargeback threat. Find the order now, reply privately today, and resolve before the chargeback is filed. Audit why the emails were missed.",
    },
  },
  {
    id: "salon-3star",
    label: "Salon · 3★ mild",
    businessType: "Salon",
    business: "Lume Hair Studio",
    platform: "Google",
    stars: 3,
    reviewText:
      "The cut itself was great and my stylist was lovely, but I waited 35 minutes past my appointment time and nobody apologized for it.",
    recorded: {
      intentLine:
        "A basically-happy client who loved the cut but was let down by a 35-minute wait and no acknowledgement.",
      temperature: "Mildly annoyed",
      replies: [
        {
          strategyId: "de-escalate",
          strategy: "De-escalate & Reassure",
          text: "Thank you — I'm really glad you loved your cut and your stylist! You're right that a 35-minute wait with no heads-up isn't good enough, and I'm sorry. We're tightening our scheduling so your time is respected. We'd love to see you back.",
        },
        {
          strategyId: "save-the-account",
          strategy: "Win Them Back",
          text: "So glad the cut hit the mark! The wait, though, is on us — and a quick apology in the moment would have gone a long way. I've shared this with the front desk. Next time you book, mention this note and we'll make sure you're seen right on time.",
        },
        {
          strategyId: "hold-the-line",
          strategy: "Hold the Line",
          text: "Thanks for the kind words about your stylist! We aim to run on time and clearly missed that day — I'm sorry, and we're working on our booking buffers so it doesn't repeat.",
        },
      ],
      managerAlert:
        "The work was great — it's a scheduling/wait problem. Thank them, fix appointment buffers, and brief the front desk to acknowledge delays proactively.",
    },
  },
  {
    id: "gym-5star",
    label: "Gym · 5★ delighted",
    businessType: "Gym",
    business: "Forge Fitness",
    platform: "Google",
    stars: 5,
    reviewText:
      "Best gym I've ever joined. Spotlessly clean, the staff actually know your name, and the 6am classes are incredible. Highly recommend!",
    recorded: {
      intentLine:
        "A delighted member praising cleanliness, friendly staff, and the early classes — a genuine brand advocate.",
      temperature: "Delighted, enthusiastic",
      replies: [
        {
          strategyId: "de-escalate",
          strategy: "De-escalate & Reassure",
          text: "This absolutely made our day — thank you! Clean floors, knowing your name, and those 6am classes are exactly what we work for. We're so glad you're part of Forge.",
        },
        {
          strategyId: "save-the-account",
          strategy: "Win Them Back",
          text: "Thank you so much! Reviews like this keep the 6am crew going. If you ever want to bring a friend to a class, just let the front desk know — we'd love to have them.",
        },
        {
          strategyId: "hold-the-line",
          strategy: "Hold the Line",
          text: "We really appreciate you taking the time to share this. Clean facilities and a team that knows our members by name are non-negotiables for us — thank you for noticing, and see you at 6am!",
        },
      ],
      managerAlert:
        "Happy advocate. Thank them warmly and consider (privately) inviting a referral or asking to feature the quote on social.",
    },
  },
];

export function findFixture(text: string): Fixture | undefined {
  const norm = text.trim().toLowerCase();
  if (!norm) return undefined;
  const exact = FIXTURES.find((f) => f.reviewText.trim().toLowerCase() === norm);
  if (exact) return exact;
  return FIXTURES.find((f) => norm.includes(f.reviewText.trim().toLowerCase().slice(0, 40)));
}
