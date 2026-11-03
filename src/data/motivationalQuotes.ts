export interface MotivationalQuote {
  id: string;
  quote: string;
  author: string;
  tag: 'consistency' | 'mindset' | 'gentle' | 'strength';
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: 'quote-1',
    quote: "You don't need to be perfect. Just keep showing up.",
    author: "Daily Reminder",
    tag: "consistency",
  },
  {
    id: 'quote-2',
    quote: "Discipline is built one day at a time.",
    author: "Habit Mindset",
    tag: "strength",
  },
  {
    id: 'quote-3',
    quote: "Your only competition is who you were yesterday.",
    author: "Self-Growth",
    tag: "mindset",
  },
  {
    id: 'quote-4',
    quote: "Kadinamai iru. Stay hard, stay focused, stay gentle with yourself.",
    author: "App Mantra",
    tag: "strength",
  },
  {
    id: 'quote-5',
    quote: "Even a lighter workout counts as showing up.",
    author: "Grace in Movement",
    tag: "gentle",
  },
  {
    id: 'quote-6',
    quote: "Small daily habits lead to life-changing strength.",
    author: "Consistency First",
    tag: "consistency",
  },
  {
    id: 'quote-7',
    quote: "Listen to your body. Movement is a celebration of what you can do.",
    author: "Mindful Fitness",
    tag: "gentle",
  },
  {
    id: 'quote-8',
    quote: "Celebrate every single minute on the mat today.",
    author: "Daily Motivation",
    tag: "mindset",
  },
];
