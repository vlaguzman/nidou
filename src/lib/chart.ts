export type Point = { x: number; y: number };

export const CHART = { width: 560, height: 240, padX: 28, padY: 28 };

export function buildPoints(values: number[]): Point[] {
  const innerW = CHART.width - CHART.padX * 2;
  const innerH = CHART.height - CHART.padY * 2;
  const steps = Math.max(values.length - 1, 1);
  return values.map((v, i) => ({
    x: CHART.padX + (innerW * i) / steps,
    y: CHART.padY + innerH * (1 - v / 100),
  }));
}

export function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function areaPath(points: Point[]): string {
  const baseline = CHART.height - CHART.padY;
  const last = points[points.length - 1];
  return `${smoothPath(points)} L ${last.x} ${baseline} L ${points[0].x} ${baseline} Z`;
}
