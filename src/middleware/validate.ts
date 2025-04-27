import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array().map((err) => {
        // 'param' only exists on one type, so we check for it
        const field = 'param' in err ? err.param : 'unknown';
        return {
          field,
          message: err.msg
        };
      })
    });
    return;
  }

  next();
};



