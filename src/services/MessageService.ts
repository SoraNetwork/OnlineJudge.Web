import { ref, reactive } from 'vue'

export type MessageType = 'error' | 'warning' | 'info' | 'success'

export interface Message {
  id: number
  type: MessageType
  content: string
  duration: number
}

const messages = reactive<Message[]>([])
let messageId = 0

/**
 * 添加一条消息
 * @param type 消息类型
 * @param content 消息内容
 * @param duration 显示时长(毫秒)，默认3000ms，设为0则不会自动关闭
 */
export function addMessage(type: MessageType, content: string, duration = 3000): number {
  const id = messageId++
  const message: Message = {
    id,
    type,
    content,
    duration
  }
  messages.push(message)
  
  // 如果设置了持续时间，则自动移除消息
  if (duration > 0) {
    setTimeout(() => {
      removeMessage(id)
    }, duration)
  }
  
  return id
}

// 移除指定的消息
export function removeMessage(id: number): void {
  const index = messages.findIndex(msg => msg.id === id)
  if (index !== -1) {
    messages.splice(index, 1)
  }
}

// 快捷方法
export const message = {
  error: (content: string, duration?: number) => addMessage('error', content, duration),
  warning: (content: string, duration?: number) => addMessage('warning', content, duration),
  info: (content: string, duration?: number) => addMessage('info', content, duration),
  success: (content: string, duration?: number) => addMessage('success', content, duration),
  remove: removeMessage
}

export function useMessages() {
  return {
    messages,
    addMessage,
    removeMessage
  }
}
