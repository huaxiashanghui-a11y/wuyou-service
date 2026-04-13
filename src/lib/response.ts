// 统一响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

export function success<T>(data?: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message || '操作成功',
    code: 200
  };
}

export function error(message: string, code: number = 500): ApiResponse {
  return {
    success: false,
    error: message,
    code
  };
}

export function notFound(message: string = '资源不存在'): ApiResponse {
  return error(message, 404);
}

export function unauthorized(message: string = '未授权'): ApiResponse {
  return error(message, 401);
}

export function forbidden(message: string = '权限不足'): ApiResponse {
  return error(message, 403);
}

export function badRequest(message: string = '请求参数错误'): ApiResponse {
  return error(message, 400);
}
