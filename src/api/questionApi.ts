import axios from 'axios';
import { getApiUrl, DEFAULT_REQUEST_OPTIONS, getAuthHeaders } from './config';

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: getApiUrl(''),
  headers: {
    'Content-Type': 'application/json',
  },
});

// 定义问题项的接口
export interface Question {
  id: string;
  languageCode: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  createTime: string;
  checkpoints: any[];
  visibility: string[];
  tags: string[];
  difficulty: string;
}

// 定义问题详情的数据类型
export interface QuestionDetail {
  id: string;
  title: string;
  description: string; 
  tags: string[];
  createdBy: string;
  createdAt: string;
  difficulty: string;
  timeLimit: number;
  memoryLimit: number;
  acceptance: string;
  author: {
    username: string;
    nickname: string;
    avatar: string;
  };
}

// 定义分页结果的接口
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

// 定义获取问题列表的请求参数
export interface GetQuestionsParams {
  onlyCreatedByUser?: boolean;
  searchTitle?: string;
  tags?: string[];
  pageIndex?: number;
  pageSize?: number;
}

// 定义API响应的接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string | null;
}

// 创建题目的请求接口
export interface CreateQuestionRequest {
  languageCode: string;
  title: string;
  description: string;
  checkpoints: {
    input: string;
    output: string;
    score: number;
  }[];
  visibility: string[];
  tags: string[];
}

// AI生成题目描述的请求接口
export interface GenerateQuestionRequest {
  description: string;
}

// AI生成测试用例的请求接口
export interface GenerateTestcasesRequest {
  title: string;
  description: string;
  testCaseCount: number;
}

// 定义提交代码的请求接口
export interface SubmitCodeRequest {
  questionId: string;
  code: string;
  language: string;
}

// 定义提交代码的响应接口
export interface SubmitCodeResponse {
  id: string;
  status: string;
}

// 定义测试用例结果的接口
export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  passed: boolean;
  actualOutput: string;
  timeUsed: number;
  memoryUsed: number;
  score: number;
}

// 定义提交记录详情的接口
export interface SubmissionDetail {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  code: string;
  language: string;
  submitTime: string;
  status: string;
  timeUsed: number;
  memoryUsed: number;
  score: number;
  message: string | null;
  testCaseResults: TestCaseResult[];
}

/**
 * 获取指定ID的问题详情
 * @param questionId 问题ID
 * @returns 问题详情
 */
export const getQuestionById = async (questionId :string) => {
  try {
    const response = await fetch(getApiUrl(`/Question/${questionId}`), {
      method: 'GET',
      headers: DEFAULT_REQUEST_OPTIONS.headers
    });

    return await response.json();
  } catch (error) {
    console.error('获取问题详情失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 获取问题列表
 * @param params 查询参数
 * @returns 分页的问题列表
 */
export const getQuestions = async (params: GetQuestionsParams = {}): Promise<ApiResponse<PaginatedResult<Question>>> => {
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    
    if (params.onlyCreatedByUser !== undefined) {
      queryParams.append('onlyCreatedByUser', params.onlyCreatedByUser.toString());
    }
    
    if (params.searchTitle) {
      queryParams.append('searchTitle', params.searchTitle);
    }
    
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(tag => {
        queryParams.append('tags', tag);
      });
    }
    
    if (params.pageIndex !== undefined) {
      queryParams.append('pageIndex', params.pageIndex.toString());
    }
    
    if (params.pageSize !== undefined) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/Question?${queryString}` : '/Question';
    
    const response = await fetch(getApiUrl(url), {
      method: 'GET',
      headers: DEFAULT_REQUEST_OPTIONS.headers
    });

    return await response.json();
  } catch (error) {
    console.error('获取问题列表失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 创建新题目
 * @param request 创建题目的请求数据
 * @returns 创建结果
 */
export const createQuestion = async (request: CreateQuestionRequest): Promise<ApiResponse<Question>> => {
  try {
    const response = await fetch(getApiUrl('/Question/create'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    console.error('创建题目失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 使用AI生成题目描述
 * @param request 生成请求
 * @returns 生成的描述
 */
export const generateQuestionByAI = async (request: GenerateQuestionRequest): Promise<ApiResponse<string>> => {
  try {
    const response = await fetch(getApiUrl('/Question/ai/generate-question'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    console.error('生成题目描述失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 使用AI生成测试用例
 * @param request 测试用例生成请求
 * @returns 生成的测试用例
 */
export const generateTestcasesByAI = async (request: GenerateTestcasesRequest): Promise<ApiResponse<string>> => {
  try {
    const response = await fetch(getApiUrl('/Question/ai/generate-testcases'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    console.error('生成测试用例失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 提交代码进行评测
 * @param request 提交代码的请求数据
 * @returns 提交结果
 */
export const submitCode = async (request: SubmitCodeRequest): Promise<ApiResponse<SubmitCodeResponse>> => {
  try {
    const response = await fetch(getApiUrl('/Submit'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request)
    });

    return await response.json();
  } catch (error) {
    console.error('提交代码失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

/**
 * 获取提交记录详情
 * @param submissionId 提交记录ID
 * @returns 提交记录详情
 */
export const getSubmissionDetail = async (submissionId: string): Promise<ApiResponse<SubmissionDetail>> => {
  try {
    const response = await fetch(getApiUrl(`/Submit/${submissionId}`), {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await response.json();
  } catch (error) {
    console.error('获取提交记录详情失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试'
    };
  }
};

// 同时保留 axios 版本的接口用于后续迁移
export const questionApiAxios = {
  getQuestionById: (questionId:string) => {
    return apiClient.get(`/Question/${questionId}`);
  },
  
  getQuestions: (params: GetQuestionsParams = {}) => {
    return apiClient.get('/Question', { params });
  },
  
  createQuestion: (request: CreateQuestionRequest) => {
    return apiClient.post('/Question/create', request, {
      headers: getAuthHeaders()
    });
  },
  
  generateQuestionByAI: (request: GenerateQuestionRequest) => {
    return apiClient.post('/Question/ai/generate-question', request, {
      headers: getAuthHeaders()
    });
  },
  
  generateTestcasesByAI: (request: GenerateTestcasesRequest) => {
    return apiClient.post('/Question/ai/generate-testcases', request, {
      headers: getAuthHeaders()
    });
  },

  submitCode: (request: SubmitCodeRequest) => {
    return apiClient.post('/Submit', request, {
      headers: getAuthHeaders()
    });
  },

  getSubmissionDetail: (submissionId: string) => {
    return apiClient.get(`/Submit/${submissionId}`, {
      headers: getAuthHeaders()
    });
  },
};
