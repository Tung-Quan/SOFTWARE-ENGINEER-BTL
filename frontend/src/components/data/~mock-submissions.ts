/**
 * Mock data for student submissions (scores and comments)
 * This provides stable, persisted data for submissions instead of random generation
 */

export type SubmissionData = {
  sessionId: string
  memberId: number
  score?: number // undefined means "chưa chấm"
  comment?: string
  submittedAt?: string // ISO datetime
}

// Helper to create a unique key for each submission
export function getSubmissionKey(sessionId: string, memberId: number): string {
  return `${sessionId}-${memberId}`
}

// Mock submissions data - initialize with some sample data
// In a real app, this would come from a backend API
const submissionsMap = new Map<string, SubmissionData>()

// Initialize with some sample data for a few sessions
const initialData: SubmissionData[] = [
  // Session s-1
  { sessionId: 's-1', memberId: 1, score: 8.5, comment: 'Bài làm tốt, logic rõ ràng.' },
  { sessionId: 's-1', memberId: 2, score: 7.0, comment: 'Cần cải thiện phần xử lý lỗi.' },
  { sessionId: 's-1', memberId: 3, score: 9.0, comment: 'Xuất sắc! Code sạch và có documentation.' },
  { sessionId: 's-1', memberId: 4, score: 6.5, comment: 'Đúng yêu cầu nhưng thiếu comments.' },
  { sessionId: 's-1', memberId: 5, score: undefined, comment: '' }, // Chưa chấm
  { sessionId: 's-1', memberId: 6, score: 7.5, comment: 'Tốt, nhưng có thể tối ưu thêm.' },
  { sessionId: 's-1', memberId: 7, score: 8.0, comment: 'Rất tốt, logic chặt chẽ.' },
  { sessionId: 's-1', memberId: 8, score: 9.5, comment: 'Hoàn hảo! Có test cases đầy đủ.' },

  // Session s-2
  { sessionId: 's-2', memberId: 1, score: 7.5, comment: 'Schema thiết kế tốt.' },
  { sessionId: 's-2', memberId: 2, score: 8.0, comment: 'Queries hiệu quả.' },
  { sessionId: 's-2', memberId: 3, score: undefined, comment: '' },
  { sessionId: 's-2', memberId: 4, score: 6.0, comment: 'Cần optimize queries thêm.' },
  { sessionId: 's-2', memberId: 5, score: 7.0, comment: 'Đạt yêu cầu cơ bản.' },
  { sessionId: 's-2', memberId: 6, score: 9.0, comment: 'Rất tốt! Index đúng chỗ.' },

  // Session s-3
  { sessionId: 's-3', memberId: 1, score: 8.5, comment: 'Tổng hợp tốt các kiến thức.' },
  { sessionId: 's-3', memberId: 2, score: 7.5, comment: 'Đầy đủ nhưng có thể chi tiết hơn.' },
  { sessionId: 's-3', memberId: 3, score: 9.0, comment: 'Xuất sắc! Hiểu sâu vấn đề.' },
  { sessionId: 's-3', memberId: 4, score: undefined, comment: '' },
  { sessionId: 's-3', memberId: 5, score: 6.5, comment: 'Cần bổ sung thêm ví dụ.' },
  { sessionId: 's-3', memberId: 6, score: 8.0, comment: 'Tốt, trình bày rõ ràng.' },
  { sessionId: 's-3', memberId: 7, score: 7.0, comment: 'Đạt yêu cầu.' },
  { sessionId: 's-3', memberId: 8, score: 8.5, comment: 'Rất hay! Có so sánh các phương pháp.' },
  { sessionId: 's-3', memberId: 9, score: 9.5, comment: 'Hoàn hảo! Phân tích sâu sắc.' },
  { sessionId: 's-3', memberId: 10, score: 7.5, comment: 'Tốt, nhưng thiếu một số chi tiết.' },

  // Session s-4
  { sessionId: 's-4', memberId: 1, score: 8.0, comment: 'Bài tập đầy đủ.' },
  { sessionId: 's-4', memberId: 2, score: 7.0, comment: 'Đúng hướng nhưng chưa hoàn thiện.' },
  { sessionId: 's-4', memberId: 3, score: 9.0, comment: 'Tuyệt vời! Có thêm test cases.' },
  { sessionId: 's-4', memberId: 4, score: undefined, comment: '' },
  { sessionId: 's-4', memberId: 5, score: 6.5, comment: 'Cần sửa lại một số phần.' },
  { sessionId: 's-4', memberId: 6, score: 8.5, comment: 'Rất tốt! Code gọn gàng.' },
  { sessionId: 's-4', memberId: 7, score: 7.5, comment: 'Tốt, có thể cải thiện performance.' },
  { sessionId: 's-4', memberId: 8, score: 9.5, comment: 'Xuất sắc! Có bonus features.' },

  // Session s-5
  { sessionId: 's-5', memberId: 1, score: 7.5, comment: 'Bài thi đạt yêu cầu.' },
  { sessionId: 's-5', memberId: 2, score: 8.0, comment: 'Tốt, logic đúng.' },
  { sessionId: 's-5', memberId: 3, score: 9.0, comment: 'Rất tốt! Giải chi tiết.' },
  { sessionId: 's-5', memberId: 4, score: 6.0, comment: 'Chưa đầy đủ một số phần.' },
  { sessionId: 's-5', memberId: 5, score: 7.0, comment: 'Đạt.' },
  { sessionId: 's-5', memberId: 6, score: 8.5, comment: 'Xuất sắc! Có giải thích rõ ràng.' },
  { sessionId: 's-5', memberId: 7, score: undefined, comment: '' },
  { sessionId: 's-5', memberId: 8, score: 9.5, comment: 'Hoàn hảo! Có ví dụ minh họa.' },
  { sessionId: 's-5', memberId: 9, score: 7.5, comment: 'Tốt, nhưng thiếu một số bước.' },
  { sessionId: 's-5', memberId: 10, score: 8.0, comment: 'Rất tốt! Trình bày khoa học.' },
  { sessionId: 's-5', memberId: 11, score: 6.5, comment: 'Cần bổ sung thêm.' },
  { sessionId: 's-5', memberId: 12, score: 9.0, comment: 'Tuyệt vời! Logic chặt chẽ.' },
]

// Populate the map
initialData.forEach((data) => {
  const key = getSubmissionKey(data.sessionId, data.memberId)
  submissionsMap.set(key, data)
})

/**
 * Get submission data for a specific member in a specific session
 */
export function getSubmission(sessionId: string, memberId: number): SubmissionData | undefined {
  const key = getSubmissionKey(sessionId, memberId)
  return submissionsMap.get(key)
}

/**
 * Get all submissions for a session
 */
export function getSessionSubmissions(sessionId: string): SubmissionData[] {
  const submissions: SubmissionData[] = []
  submissionsMap.forEach((data) => {
    if (data.sessionId === sessionId) {
      submissions.push(data)
    }
  })
  return submissions
}

/**
 * Update or create a submission
 */
export function updateSubmission(
  sessionId: string,
  memberId: number,
  updates: Partial<Pick<SubmissionData, 'score' | 'comment' | 'submittedAt'>>
): SubmissionData {
  const key = getSubmissionKey(sessionId, memberId)
  const existing = submissionsMap.get(key)

  const updated: SubmissionData = {
    sessionId,
    memberId,
    score: updates.score !== undefined ? updates.score : existing?.score,
    comment: updates.comment !== undefined ? updates.comment : existing?.comment,
    submittedAt: updates.submittedAt ?? existing?.submittedAt,
  }

  submissionsMap.set(key, updated)
  return updated
}

/**
 * Get all submissions (for debugging or admin views)
 */
export function getAllSubmissions(): SubmissionData[] {
  return Array.from(submissionsMap.values())
}
