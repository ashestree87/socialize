import api from './api';

export interface Post {
  id: number;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'link';
  status: 'draft' | 'scheduled' | 'published';
  platforms: string[];
  mediaUrl?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateData {
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'link';
  status: 'draft' | 'scheduled' | 'published';
  platforms: string[];
  mediaUrl?: string;
  scheduledDate?: string;
}

export interface PostUpdateData extends Partial<PostCreateData> {
  id: number;
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface PostFilters {
  status?: 'draft' | 'scheduled' | 'published';
  type?: 'text' | 'image' | 'video' | 'link';
  platform?: string;
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

class ContentService {
  /**
   * Get all posts with optional filtering
   */
  async getPosts(filters: PostFilters = {}): Promise<PostsResponse> {
    const { data } = await api.get<PostsResponse>('/posts', { params: filters as Record<string, string> });
    return data;
  }

  /**
   * Get a single post by ID
   */
  async getPost(id: number): Promise<Post> {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
  }

  /**
   * Create a new post
   */
  async createPost(data: PostCreateData): Promise<Post> {
    const { data: responseData } = await api.post<Post>('/posts', data);
    return responseData;
  }

  /**
   * Update an existing post
   */
  async updatePost(data: PostUpdateData): Promise<Post> {
    const { data: responseData } = await api.put<Post>(`/posts/${data.id}`, data);
    return responseData;
  }

  /**
   * Delete a post
   */
  async deletePost(id: number): Promise<void> {
    await api.delete<void>(`/posts/${id}`);
  }

  /**
   * Upload media for a post
   */
  async uploadMedia(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // We need to use fetch directly here because we're sending FormData
    const token = localStorage.getItem('auth_token');
    const baseUrl = process.env.REACT_APP_API_URL || '/api';
    const response = await fetch(`${baseUrl}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Schedule a post for publishing
   */
  async schedulePost(id: number, scheduledDate: string): Promise<Post> {
    const { data } = await api.put<Post>(`/posts/${id}/schedule`, { scheduledDate });
    return data;
  }

  /**
   * Publish a post immediately
   */
  async publishPost(id: number): Promise<Post> {
    const { data } = await api.put<Post>(`/posts/${id}/publish`, {});
    return data;
  }

  /**
   * Get analytics for posts
   */
  async getPostAnalytics(id: number): Promise<any> {
    const { data } = await api.get<any>(`/posts/${id}/analytics`);
    return data;
  }
}

export const contentService = new ContentService();
export default contentService; 