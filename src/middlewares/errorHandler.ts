import { Request, Response, NextFunction } from 'express';

// Middleware xử lý lỗi tập trung
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Ghi lại lỗi để gỡ lỗi

  // Gửi một phản hồi lỗi chung chung cho client
  res.status(500).json({ message: 'Đã có lỗi xảy ra phía máy chủ' });
};
