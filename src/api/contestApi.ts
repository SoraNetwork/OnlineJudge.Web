import axios from 'axios';
import { getApiUrl, DEFAULT_REQUEST_OPTIONS, getAuthHeaders } from './config';

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: getApiUrl(''),
  headers: {
    'Content-Type': 'application/json',
  },
});

// 定义比赛项的接口
export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  duration: string;
  participants: number;
  status: '即将开始' | '进行中' | '已结束';
  type: '公开赛' | '私有赛' | '练习赛';
  difficulty: '入门' | '简单' | '中等' | '困难';
}

// 定义比赛详情接口
export interface ContestDetail {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // 小时数
  type: string;
  difficulty: string;
  creatorId: string;
  creatorName: string;
  createTime: string;
  visibility: string;
  teams: number[]; // 参与团队ID
  participants: number;
  rules: string[];
  problems: {
    problemId: string;
    displayId: string;
    title: string;
    difficulty: string;
    score: number;
  }[];
}

// 定义分页结果的接口
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

// 定义获取比赛列表的请求参数
export interface GetContestsParams {
  status?: string;
  type?: string;
  sortBy?: string;
  pageIndex?: number;
  pageSize?: number;
}

// 定义API响应的接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string | null;
}

/**
 * 获取比赛列表
 * @param params 查询参数
 * @returns 分页的比赛列表
 */
export const getContests = async (params: GetContestsParams = {}): Promise<ApiResponse<Contest[]>> => {
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    
    if (params.status && params.status !== '全部') {
      queryParams.append('status', params.status);
    }
    
    if (params.type && params.type !== '全部') {
      queryParams.append('type', params.type);
    }
    
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    if (params.pageIndex !== undefined) {
      queryParams.append('pageIndex', params.pageIndex.toString());
    }
    
    if (params.pageSize !== undefined) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/Contest?${queryString}` : '/Contest';
    
    const response = await fetch(getApiUrl(url), {
      method: 'GET',
      headers: DEFAULT_REQUEST_OPTIONS.headers
    });

    return await response.json();
  } catch (error) {
    console.error('获取比赛列表失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 获取比赛详情
 * @param contestId 比赛ID
 * @returns 比赛详情
 */
export const getContestById = async (contestId: string): Promise<ApiResponse<ContestDetail>> => {
  try {
    const response = await fetch(getApiUrl(`/Contest/${contestId}`), {
      method: 'GET',
      headers: DEFAULT_REQUEST_OPTIONS.headers
    });

    return await response.json();
  } catch (error) {
    console.error('获取比赛详情失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 参加比赛
 * @param contestId 比赛ID
 * @returns 参加结果
 */
export const joinContest = async (contestId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(getApiUrl(`/Contest/${contestId}/join`), {
      method: 'POST',
      headers: getAuthHeaders()
    });

    return await response.json();
  } catch (error) {
    console.error('参加比赛失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

// 定义创建比赛的请求接口
export interface CreateContestRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: string;
  type: string;
  difficulty: string;
  rules: string[];
  problems: {
    problemId: string;
    displayId: string;
    score: number;
  }[];
  visibility: {
    type: string;
    teams: number[];
  };
}

/**
 * 创建比赛
 * @param request 创建比赛请求
 * @returns 创建结果
 */
export const createContest = async (request: CreateContestRequest): Promise<ApiResponse<Contest>> => {
  try {
    const response = await fetch(getApiUrl('/Contest'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    console.error('创建比赛失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

// 定义排行榜接口
export interface ContestRanking {
  problems: {
    problemId: string;
    displayId: string;
    title: string;
    difficulty: string;
    score: number;
  }[];
  participants: {
    rank: number;
    userId: string;
    username: string;
    totalScore: number;
    solved: number;
    penalty: number;
    problemScores: {
      problemId: string;
      status: string;
      score: number;
      attempts: number;
    }[];
  }[];
}

/**
 * 获取比赛排行榜
 * @param contestId 比赛ID
 * @returns 比赛排行榜
 */
export const getContestRankings = async (contestId: string): Promise<ApiResponse<ContestRanking>> => {
  try {
    const response = await fetch(getApiUrl(`/Contest/${contestId}/rankings`), {
      method: 'GET',
    });

    return await response.json();
  } catch (error) {
    console.error('获取比赛排行榜失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

// 保留axios版本的接口用于后续迁移
export const contestApiAxios = {
  getContests: (params: GetContestsParams = {}) => {
    return apiClient.get('/Contest', { params });
  },
  
  getContestById: (contestId: string) => {
    return apiClient.get(`/Contest/${contestId}`);
  },
  
  joinContest: (contestId: string) => {
    return apiClient.post(`/Contest/${contestId}/join`, {}, {
      headers: getAuthHeaders()
    });
  },
  
  createContest: (request: CreateContestRequest) => {
    return apiClient.post('/Contest', request, {
      headers: getAuthHeaders()
    });
  },
  
  getContestRankings: (contestId: string) => {
    return apiClient.get(`/Contest/${contestId}/rankings`, {
      headers: getAuthHeaders()
    });
  }
};
