/**
 * Mock data for student submissions (scores and comments)
 * This provides stable, persisted data for submissions instead of random generation
 */

export type SubmissionData = {
  submissionId: string
  memberId: number
  score?: number // undefined means "chưa chấm"
  comment?: string
  submittedAt?: string // ISO datetime
  file?: string // URL or file path
}

// Helper to create a unique key for each submission
export function getSubmissionKey(submissionId: string, memberId: number): string {
  return `${submissionId}-${memberId}`
}

// Mock submissions data - initialize with some sample data
// In a real app, this would come from a backend API
const submissionsMap = new Map<string, SubmissionData>()

// Initialize with some sample data for a few Submissions
const initialData: SubmissionData[] = [
  // Submission s-1
  { submissionId: 's1', memberId: 1, score: 8.5, comment: 'Bài làm tốt, logic rõ ràng.', submittedAt: '2024-10-12T20:00:00' },
  { submissionId: 's1', memberId: 2, score: 7.0, comment: 'Cần cải thiện phần xử lý lỗi.', submittedAt: '2024-10-12T19:30:00' },
  { submissionId: 's1', memberId: 3, score: 9.0, comment: 'Xuất sắc! Code sạch và có documentation.', submittedAt: '2024-10-12T21:15:00' },
  { submissionId: 's1', memberId: 4, score: 6.5, comment: 'Đúng yêu cầu nhưng thiếu comments.', submittedAt: '2024-10-12T18:50:00' },
  { submissionId: 's1', memberId: 5, score: undefined, comment: '', submittedAt: '' }, 
  { submissionId: 's1', memberId: 6, score: 7.5, comment: 'Tốt, nhưng có thể tối ưu thêm.', submittedAt: '2024-10-12T20:10:00' },
  { submissionId: 's1', memberId: 7, score: 8.0, comment: 'Rất tốt, logic chặt chẽ.', submittedAt: '2024-10-12T20:30:00' },
  { submissionId: 's1', memberId: 8, score: 9.5, comment: 'Hoàn hảo! Có test cases đầy đủ.', submittedAt: '2024-10-12T21:30:00' },
  
  // Submission s-2
  { submissionId: 's2', memberId: 1, score: 7.5, comment: 'Schema thiết kế tốt.', submittedAt: '2024-11-01T14:30:00' },
  { submissionId: 's2', memberId: 2, score: 8.0, comment: 'Queries hiệu quả.', submittedAt: '2024-11-01T15:00:00' },
  { submissionId: 's2', memberId: 3, score: undefined, comment: '', submittedAt: '2024-11-01T15:10:00' },
  { submissionId: 's2', memberId: 4, score: 6.0, comment: 'Cần optimize queries thêm.', submittedAt: '2024-11-01T13:50:00' },
  { submissionId: 's2', memberId: 5, score: 7.0, comment: 'Đạt yêu cầu cơ bản.', submittedAt: '2024-11-01T14:10:00' },
  { submissionId: 's2', memberId: 6, score: 9.0, comment: 'Rất tốt! Index đúng chỗ.', submittedAt: '2024-11-01T16:00:00' },

  // Submission s-3
  { submissionId: 's3', memberId: 1, score: 8.5, comment: 'Tổng hợp tốt các kiến thức.', submittedAt: '2024-12-01T10:00:00' },
  { submissionId: 's3', memberId: 2, score: 7.5, comment: 'Đầy đủ nhưng có thể chi tiết hơn.', submittedAt: '2024-12-01T10:15:00' },
  { submissionId: 's3', memberId: 3, score: 9.0, comment: 'Xuất sắc! Hiểu sâu vấn đề.', submittedAt: '2024-12-01T10:30:00' },
  { submissionId: 's3', memberId: 4, score: undefined, comment: '', submittedAt: '2024-12-01T11:00:00' },
  { submissionId: 's3', memberId: 5, score: 6.5, comment: 'Cần bổ sung thêm ví dụ.', submittedAt: '2024-12-01T11:15:00' },
  { submissionId: 's3', memberId: 6, score: 8.0, comment: 'Tốt, trình bày rõ ràng.', submittedAt: '2024-12-01T11:30:00' },
  { submissionId: 's3', memberId: 7, score: 7.0, comment: 'Đạt yêu cầu.', submittedAt: '2024-12-01T12:00:00' },
  { submissionId: 's3', memberId: 8, score: 8.5, comment: 'Rất hay! Có so sánh các phương pháp.', submittedAt: '2024-12-01T12:15:00' },
  { submissionId: 's3', memberId: 9, score: 9.5, comment: 'Hoàn hảo! Phân tích sâu sắc.', submittedAt: '2024-12-01T12:30:00' },
  { submissionId: 's3', memberId: 10, score: 7.5, comment: 'Tốt, nhưng thiếu một số chi tiết.', submittedAt: '2024-12-01T12:45:00' },

  // Submission s-4
  { submissionId: 's4', memberId: 1, score: 8.0, comment: 'Bài tập đầy đủ.', submittedAt: '2025-01-05T09:00:00' },
  { submissionId: 's4', memberId: 2, score: 7.0, comment: 'Đúng hướng nhưng chưa hoàn thiện.', submittedAt: '2025-01-05T09:15:00' },
  { submissionId: 's4', memberId: 3, score: 9.0, comment: 'Tuyệt vời! Có thêm test cases.', submittedAt: '2025-01-05T09:30:00' },
  { submissionId: 's4', memberId: 4, score: undefined, comment: '', submittedAt: '2025-01-05T10:00:00' },
  { submissionId: 's4', memberId: 5, score: 6.5, comment: 'Cần sửa lại một số phần.', submittedAt: '2025-01-05T10:15:00' },
  { submissionId: 's4', memberId: 6, score: 8.5, comment: 'Rất tốt! Code gọn gàng.', submittedAt: '2025-01-05T10:30:00' },
  { submissionId: 's4', memberId: 7, score: 7.5, comment: 'Tốt, có thể cải thiện performance.', submittedAt: '2025-01-05T10:45:00' },
  { submissionId: 's4', memberId: 8, score: 9.5, comment: 'Xuất sắc! Có bonus features.', submittedAt: '2025-01-05T11:00:00' },

  // Submission s-5
  { submissionId: 's5', memberId: 1, score: 7.5, comment: 'Bài thi đạt yêu cầu.', submittedAt: '2025-02-10T14:00:00' },
  { submissionId: 's5', memberId: 2, score: 8.0, comment: 'Tốt, logic đúng.', submittedAt: '2025-02-10T14:10:00' },
  { submissionId: 's5', memberId: 3, score: 9.0, comment: 'Rất tốt! Giải chi tiết.', submittedAt: '2025-02-10T14:20:00' },
  { submissionId: 's5', memberId: 4, score: 6.0, comment: 'Chưa đầy đủ một số phần.', submittedAt: '2025-02-10T14:30:00' },
  { submissionId: 's5', memberId: 5, score: 7.0, comment: 'Đạt.', submittedAt: '2025-02-10T14:40:00' },
  { submissionId: 's5', memberId: 6, score: 8.5, comment: 'Xuất sắc! Có giải thích rõ ràng.', submittedAt: '2025-02-10T14:50:00' },
  { submissionId: 's5', memberId: 7, score: undefined, comment: '', submittedAt: '2025-02-10T15:00:00' },
  { submissionId: 's5', memberId: 8, score: 9.5, comment: 'Hoàn hảo! Có ví dụ minh họa.', submittedAt: '2025-02-10T15:10:00' },
  { submissionId: 's5', memberId: 9, score: 7.5, comment: 'Tốt, nhưng thiếu một số bước.', submittedAt: '2025-02-10T15:20:00' },
  { submissionId: 's5', memberId: 10, score: 8.0, comment: 'Rất tốt! Trình bày khoa học.', submittedAt: '2025-02-10T15:30:00' },
  { submissionId: 's5', memberId: 11, score: 6.5, comment: 'Cần bổ sung thêm.', submittedAt: '2025-02-10T15:40:00' },
  { submissionId: 's5', memberId: 12, score: 9.0, comment: 'Tuyệt vời! Logic chặt chẽ.', submittedAt: '2025-02-10T15:50:00' },
]

// Populate the map
initialData.forEach((data) => {
  const key = getSubmissionKey(data.submissionId, data.memberId)
  submissionsMap.set(key, data)
})

/**
 * Get submission data for a specific member in a specific Submission
 */
export function getSubmission(submissionId: string, memberId: number): SubmissionData | undefined {
  const key = getSubmissionKey(submissionId, memberId)
  return submissionsMap.get(key)
}

/**
 * Get all submissions for a Submission
 */
export function getSubmissionSubmissions(submissionId: string): SubmissionData[] {
  const submissions: SubmissionData[] = []
  submissionsMap.forEach((data) => {
    if (data.submissionId === submissionId) {
      submissions.push(data)
    }
  })
  return submissions
}

/**
 * Update or create a submission
 */
export function updateSubmission(
  submissionId: string,
  memberId: number,
  updates: Partial<Pick<SubmissionData, 'score' | 'comment' | 'submittedAt'>>
): SubmissionData {
  const key = getSubmissionKey(submissionId, memberId)
  const existing = submissionsMap.get(key)

  const updated: SubmissionData = {
    submissionId,
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

export const getSubmissionBySubmissionId = (submissionId: string): SubmissionData[] => {
  const results: SubmissionData[] = []
  submissionsMap.forEach((data) => {
    if (data.submissionId === submissionId) {
      results.push(data)
    }
  })
  return results
}