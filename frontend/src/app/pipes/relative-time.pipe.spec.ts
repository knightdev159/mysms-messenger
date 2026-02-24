import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  const pipe = new RelativeTimePipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "just now" for recent dates', () => {
    const now = new Date();
    expect(pipe.transform(now)).toBe('just now');
  });

  it('should return "Xm ago" for minutes', () => {
    const past = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(past)).toMatch(/\d+m ago/);
  });

  it('should return "Xh ago" for hours', () => {
    const past = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(pipe.transform(past)).toMatch(/\d+h ago/);
  });

  it('should return "Xd ago" for days', () => {
    const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(pipe.transform(past)).toMatch(/\d+d ago/);
  });

  it('should accept ISO string', () => {
    const iso = new Date(Date.now() - 60 * 1000).toISOString();
    expect(pipe.transform(iso)).toMatch(/\d+m ago/);
  });
});
