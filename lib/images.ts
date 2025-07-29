import supabase from '@/utils/supabase';

export interface BlogImage {
  id: string;
  url: string;
  alt_text: string | null;
  usage: 'blog' | 'project' | 'experience';
  related_id: string;
  display_order: number | null;
  created_at: string;
}

export const getBlogImages = async (relatedId: string): Promise<BlogImage[]> => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('usage', 'blog')
    .eq('related_id', relatedId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching blog images:', error);
    return [];
  }

  return data || [];
};