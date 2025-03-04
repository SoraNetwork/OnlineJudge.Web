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
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
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

// 获取问题列表的函数
export async function getQuestions(params: GetQuestionsParams = {}): Promise<ApiResponse<PaginatedResult<Question>>> {
  const url = new URL('/api/Question', 'http://127.0.0.1:5148');
  
  // 添加查询参数
  if (params.onlyCreatedByUser !== undefined) {
    url.searchParams.append('onlyCreatedByUser', params.onlyCreatedByUser.toString());
  }
  
  if (params.searchTitle) {
    url.searchParams.append('searchTitle', params.searchTitle);
  }
  
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach(tag => {
      url.searchParams.append('tags', tag);
    });
  }
  
  if (params.pageIndex !== undefined) {
    url.searchParams.append('pageIndex', params.pageIndex.toString());
  }
  
  if (params.pageSize !== undefined) {
    url.searchParams.append('pageSize', params.pageSize.toString());
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API请求失败，状态码：${response.status}`);
  }
  
  return await response.json();
}

// 创建新题目
export async function createQuestion(request: CreateQuestionRequest): Promise<ApiResponse<Question>> {
  const response = await fetch('/api/Question/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // 假设token存在localStorage中
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error(`API请求失败，状态码：${response.status}`);
  }
  
  return await response.json();
}

// 使用AI生成题目描述
export async function generateQuestionByAI(request: GenerateQuestionRequest): Promise<ApiResponse<string>> {
  const response = await fetch('/api/Question/ai/generate-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error(`API请求失败，状态码：${response.status}`);
  }
  
  return await response.json();
}

// 使用AI生成测试用例
export async function generateTestcasesByAI(request: GenerateTestcasesRequest): Promise<ApiResponse<string>> {
  const response = await fetch('/api/Question/ai/generate-testcases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error(`API请求失败，状态码：${response.status}`);
  }
  
  return await response.json();
}
