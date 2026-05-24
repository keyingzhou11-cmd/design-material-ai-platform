import type { Material, Category, MaterialFilters } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: '字体', slug: 'typography', color: '#E85D04', created_at: '' },
  { id: '2', name: '色彩', slug: 'color', color: '#D45303', created_at: '' },
  { id: '3', name: '版式', slug: 'layout', color: '#1A1A1A', created_at: '' },
  { id: '4', name: '摄影', slug: 'photography', color: '#6B6560', created_at: '' },
  { id: '5', name: '插画', slug: 'illustration', color: '#E85D04', created_at: '' },
  { id: '6', name: 'UI/UX', slug: 'ui-ux', color: '#A39E98', created_at: '' },
  { id: '7', name: '品牌', slug: 'branding', color: '#D45303', created_at: '' },
  { id: '8', name: '动态', slug: 'motion', color: '#1A1A1A', created_at: '' },
];

export const MOCK_MATERIALS: Material[] = [
  {
    id: 'm1',
    user_id: null,
    title: '极简编辑版式',
    description: '干净的杂志跨页与强层级标题组合',
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
    tags: [{ id: 't1', name: '编辑感', slug: 'editorial', created_at: '' }],
  },
  {
    id: 'm2',
    user_id: null,
    title: '暖调品牌色盘',
    description: '适合品牌视觉延展的低饱和暖色组合',
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
    title: '瑞士风格字体海报',
    description: '基于网格系统的字体构成参考',
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
    title: '自然光产品摄影',
    description: '柔和光线下的产品质感与留白控制',
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
    title: '数据看板界面',
    description: '信息密度适中的分析型界面参考',
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
    title: '品牌识别系统',
    description: '标志、色彩与基础视觉语言的系统化呈现',
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
    title: '抽象有机插画',
    description: '柔和渐变与自然形态的插画方向',
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
    title: '动态字体画面',
    description: '节奏明确的动态字体静帧参考',
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
      result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
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
    name: '2025 品牌焕新',
    description: '为客户品牌升级整理的视觉方向与参考素材',
    cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    user_id: null,
    name: '编辑杂志版式',
    description: '版式结构、字体层级与图文关系探索',
    cover_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    user_id: null,
    name: 'App 界面概念',
    description: '移动端产品界面的视觉语言与组件灵感',
    cover_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_ANALYSIS = {
  summary:
    '这张参考呈现出温暖、克制的编辑气质，字体层级清晰，版面留白充足。整体视觉重心稳定，适合作为品牌内容页或杂志式落地页的方向参考。',
  colorPalette: ['#F5F0EB', '#1A1A1A', '#E85D04', '#6B6560', '#D9CFC4'],
  typography: ['高对比衬线标题', '简洁无衬线正文', '行距舒展', '左对齐网格'],
  layoutNotes: ['非对称双栏结构', '留白充足', '图文比例接近 60/40'],
  mood: '温暖编辑感',
  tags: ['编辑感', '极简', '字体', '暖调', '杂志'],
  styleKeywords: ['克制', '高级', '温暖', '清晰'],
};
