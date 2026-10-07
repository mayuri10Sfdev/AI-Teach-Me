export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  explore: '/explore',
  study: (id: string) => `/study/${id}`,
} as const;

export const INTERESTS = [
  'Artificial Intelligence',
  'Salesforce',
  'Python',
  'Cloud Computing',
  'Data Science',
  'Cybersecurity',
  'Web Development',
  'Finance',
  'Marketing',
  'UI/UX',
  'Leadership',
];
