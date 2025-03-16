import api from './api';

export interface EngagementMetric {
  date: string;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

export interface PlatformDistribution {
  platform: string;
  posts: number;
  engagement: number;
}

export interface ContentPerformance {
  type: string;
  avgEngagement: number;
  count: number;
}

export interface AudienceDemographic {
  ageGroup: string;
  percentage: number;
}

export interface AnalyticsSummary {
  totalPosts: number;
  totalEngagement: number;
  averageEngagementRate: number;
  topPerformingPlatform: string;
  growthRate: number;
}

export interface AnalyticsTimeRange {
  startDate: string;
  endDate: string;
}

export interface AnalyticsFilters extends AnalyticsTimeRange {
  platforms?: string[];
  contentTypes?: string[];
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary;
  engagementMetrics: EngagementMetric[];
  platformDistribution: PlatformDistribution[];
  contentPerformance: ContentPerformance[];
  audienceDemographics: AudienceDemographic[];
}

// Helper function to convert filters to params
function filtersToParams(filters: AnalyticsFilters): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  
  if (filters.platforms && filters.platforms.length > 0) {
    params.platforms = filters.platforms.join(',');
  }
  
  if (filters.contentTypes && filters.contentTypes.length > 0) {
    params.contentTypes = filters.contentTypes.join(',');
  }
  
  return params;
}

class AnalyticsService {
  /**
   * Get dashboard analytics data
   */
  async getDashboardData(filters: AnalyticsFilters): Promise<AnalyticsResponse> {
    const { data } = await api.get<AnalyticsResponse>('/analytics/dashboard', { 
      params: filtersToParams(filters)
    });
    return data;
  }

  /**
   * Get engagement metrics over time
   */
  async getEngagementMetrics(filters: AnalyticsFilters): Promise<EngagementMetric[]> {
    const { data } = await api.get<EngagementMetric[]>('/analytics/engagement', { 
      params: filtersToParams(filters)
    });
    return data;
  }

  /**
   * Get platform distribution data
   */
  async getPlatformDistribution(filters: AnalyticsFilters): Promise<PlatformDistribution[]> {
    const { data } = await api.get<PlatformDistribution[]>('/analytics/platforms', { 
      params: filtersToParams(filters)
    });
    return data;
  }

  /**
   * Get content performance by type
   */
  async getContentPerformance(filters: AnalyticsFilters): Promise<ContentPerformance[]> {
    const { data } = await api.get<ContentPerformance[]>('/analytics/content', { 
      params: filtersToParams(filters)
    });
    return data;
  }

  /**
   * Get audience demographics
   */
  async getAudienceDemographics(filters: AnalyticsFilters): Promise<AudienceDemographic[]> {
    const { data } = await api.get<AudienceDemographic[]>('/analytics/audience', { 
      params: filtersToParams(filters)
    });
    return data;
  }

  /**
   * Get analytics summary
   */
  async getAnalyticsSummary(filters: AnalyticsFilters): Promise<AnalyticsSummary> {
    const { data } = await api.get<AnalyticsSummary>('/analytics/summary', { 
      params: filtersToParams(filters)
    });
    return data;
  }

  /**
   * Get analytics for a specific platform
   */
  async getPlatformAnalytics(platform: string, filters: AnalyticsFilters): Promise<any> {
    const { data } = await api.get<any>(`/analytics/platforms/${platform}`, { 
      params: filtersToParams(filters)
    });
    return data;
  }

  /**
   * Export analytics data as CSV
   */
  async exportAnalytics(filters: AnalyticsFilters): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    if (filters.platforms && filters.platforms.length > 0) {
      filters.platforms.forEach(platform => {
        params.append('platforms[]', platform);
      });
    }
    
    if (filters.contentTypes && filters.contentTypes.length > 0) {
      filters.contentTypes.forEach(type => {
        params.append('contentTypes[]', type);
      });
    }
    
    const token = localStorage.getItem('auth_token');
    const baseUrl = process.env.REACT_APP_API_URL || '/api';
    const response = await fetch(`${baseUrl}/analytics/export?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return response.blob();
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService; 