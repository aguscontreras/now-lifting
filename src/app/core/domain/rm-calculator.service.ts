import { Injectable } from '@angular/core';

export type FormulaName =
  | 'epley'
  | 'brzycki'
  | 'lander'
  | 'lombardi'
  | 'oconner';

@Injectable({ providedIn: 'root' })
export class RmCalculator {
  calculate1RM(
    weight: number,
    reps: number,
    formula: FormulaName = 'brzycki'
  ): number {
    if (reps < 1) throw new Error('Reps must be at las 1');

    switch (formula) {
      case 'epley':
        return Math.floor(weight * (1 + reps / 30));
      case 'brzycki':
        return Math.floor((weight * 36) / (37 - reps));
      case 'lander':
        return Math.floor((100 * weight) / (101.3 - 2.67123 * reps));
      case 'lombardi':
        return Math.floor(weight * Math.pow(reps, 0.1));
      case 'oconner':
        return Math.floor(weight * (1 + 0.025 * reps));
      default:
        throw new Error('Formula not supported');
    }
  }

  calculate1RMAverage(weight: number, reps: number): number {
    const formulas: FormulaName[] = [
      'epley',
      'brzycki',
      'lander',
      'lombardi',
      'oconner',
    ];
    const results = formulas.map((f) => this.calculate1RM(weight, reps, f));
    const sum = results.reduce((a, b) => a + b, 0);
    return Math.floor(sum / results.length);
  }

  estimateWeightFrom1RM(
    oneRm: number,
    reps: number,
    formula: FormulaName = 'brzycki'
  ): number {
    if (reps < 1) throw new Error('Las repeticiones deben ser al menos 1');

    switch (formula) {
      case 'epley':
        return Math.floor(oneRm / (1 + reps / 30));
      case 'brzycki':
        return Math.floor((oneRm * (37 - reps)) / 36);
      case 'lombardi':
        return Math.floor(oneRm / Math.pow(reps, 0.1));
      case 'oconner':
        return Math.floor(oneRm / (1 + 0.025 * reps));
      default:
        throw new Error('Fórmula no soportada');
    }
  }

  getRmByReps(oneRm: number, max = 20): { reps: number; weight: number }[] {
    return Array(max).fill({}).map((_, index) => {
      const reps = index + 1;
      return {
        reps,
        weight: this.estimateWeightFrom1RM(oneRm, reps),
      };
    });
  }
}
