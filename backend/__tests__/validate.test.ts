import { z } from 'zod';
import { validate } from '../src/hooks/validate';
import type { Request, Response, NextFunction } from 'express';

describe('validate middleware', () => {
  const schema = z.object({ name: z.string() });
  const middleware = validate(schema);

  const mockNext: NextFunction = jest.fn();

  const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should call next for valid body', () => {
    const req = { body: { name: 'test' } } as Request;
    const res = mockRes();
    middleware(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 400 for invalid body', () => {
    const req = { body: { name: 123 } } as Request;
    const res = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
