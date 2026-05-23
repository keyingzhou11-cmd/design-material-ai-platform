import type { Material, Category, MaterialFilters } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Typography', slug: 'typography', color: '#E85D04', created_at: '' },
  { id: '2', name: 'Color', slug: 'color', color: '#D45303', created_at: '' },
  { id: '3', name: 'Layout', slug: 'layout', color: '#1A1A1A', created_at: '' },
  { id: '4', name: 'Photography', slug: 'photography', color: '#6B6560', created_at: '' },
  { id: '5', name: 'Illustration', slug: 'illustration', color: '#E85D04', created_at: '' },
  { id: '6', name: 'UI/UX', slug: 'ui-ux', color: '#A39E98', created_at: '' },
  { id: '7', name: 'Branding', slug: 'branding', color: '#D45303', created_at: '' },
  { id: '8', name: 'Motion', slug: 'motion', color: '#1A1A1A', created_at: '' },
];

export const MOCK_MATERIALS: Material[] = [
  {
    id: 'm1',
    user_id: null,
    title: 'Minimal Editorial Layout',
    description: 'Clean magazine spread with bold typography',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    thumbnail_url: null,
    source_url: null,
    category_id: '3',
    width: 600,
    height: 800,
    file_size: null,
    is_favorite: true,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[2],
    tags: [{ id: 't1', name: 'editorial', slug: 'editorial', created_at: '' }],
  },
  {
    id: 'm2',
    user_id: null,
    title: 'Warm Color Palette',
    description: 'Earthy tones for brand identity',
    image_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80',
    thumbnail_url: null,
    source_url: null,
    category_id: '2',
    width: 600,
    height: 600,
    file_size: null,
    is_favorite: false,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[1],
  },
  {
    id: 'm3',
    user_id: null,
    title: 'Swiss Typography Poster',
    description: 'Grid-based typographic composition',
    image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    thumbnail_url: null,
    source_url: null,
    category_id: '1',
    width: 600,
    height: 900,
    file_size: null,
    is_favorite: true,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[0],
  },
  {
    id: 'm4',
    user_id: null,
    title: 'Product Photography',
    description: 'Soft natural light product shot',
    image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80',
    thumbnail_url: null,
    source_url: null,
    category_id: '4',
    width: 600,
    height: 750,
    file_size: null,
    is_favorite: false,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[3],
  },
  {
    id: 'm5',
    user_id: null,
    title: 'UI Dashboard Concept',
    description: 'Clean analytics dashboard design',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    thumbnail_url: null,
    source_url: null,
    category_id: '6',
    width: 600,
    height: 400,
    file_size: null,
    is_favorite: false,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[5],
  },
  {
    id: 'm6',
    user_id: null,
    title: 'Brand Identity System',
    description: 'Logo and color system exploration',
    image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
    thumbnail_url: null,
    source_url: null,
    category_id: '7',
    width: 600,
    height: 600,
    file_size: null,
    is_favorite: true,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[6],
  },
  {
    id: 'm7',
    user_id: null,
    title: 'Abstract Illustration',
    description: 'Organic shapes and warm gradients',
    image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    thumbnail_url: null,
    source_url: null,
    category_id: '5',
    width: 600,
    height: 850,
    file_size: null,
    is_favorite: false,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[4],
  },
  {
    id: 'm8',
    user_id: null,
    title: 'Motion Graphics Frame',
    description: 'Kinetic typography still frame',
    image_url: 'https://images.unsplash.com/photo-1633169080405-4e05d27904d8?w=600&q=80',
    thumbnail_url: null,
    source_url: null,
    category_id: '8',
    width: 600,
    height: 500,
    file_size: null,
    is_favorite: false,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[7],
  },
];

export function filterMaterials(
  materials: Material[],
  filters: MaterialFilters
): Material[] {
  let result = [...materials];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q)
    );
  }

  if (filters.categoryId) {
    result = result.filter((m) => m.category_id === filters.categoryId);
  }

  if (filters.favoritesOnly) {
    result = result.filter((m) => m.is_favorite);
  }

  switch (filters.sortBy) {
    case 'oldest':
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return result;
}

export const MOCK_PROJECTS = [
  {
    id: 'p1',
    user_id: null,
    name: 'Brand Refresh 2025',
    description: 'Visual identity exploration for client rebrand',
    cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    user_id: null,
    name: 'Editorial Magazine',
    description: 'Layout and typography moodboard',
    cover_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    user_id: null,
    name: 'App UI Concepts',
    description: 'Mobile app interface exploration',
    cover_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_ANALYSIS = {
  summary:
    'This design exemplifies warm editorial minimalism with a strong typographic hierarchy. The beige background creates an inviting canvas while bold black headlines anchor the composition.',
  colorPalette: ['#F5F0EB', '#1A1A1A', '#E85D04', '#6B6560', '#D9CFC4'],
  typography: ['Serif display headline', 'Sans-serif body text', 'Generous line height', 'Left-aligned grid'],
  layoutNotes: ['Asymmetric two-column grid', 'Generous whitespace', 'Image-text balance 60/40'],
  mood: 'Warm Editorial',
  tags: ['editorial', 'minimal', 'typography', 'warm', 'magazine'],
  styleKeywords: ['editorial', 'minimal', 'warm', 'sophisticated'],
};
