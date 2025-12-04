// 第8章: テストとデバッグ - ツールのテスト例
import { describe, it, expect } from '@jest/globals';

// テスト対象のツール関数
function calculate(a: number, b: number, op: 'add' | 'subtract' | 'multiply' | 'divide'): number {
    switch (op) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            if (b === 0) throw new Error('0で割ることはできません');
            return a / b;
    }
}

describe('Calculator Tool', () => {
    describe('add operation', () => {
        it('should add two positive numbers', () => {
            expect(calculate(5, 3, 'add')).toBe(8);
        });

        it('should add positive and negative numbers', () => {
            expect(calculate(5, -3, 'add')).toBe(2);
        });

        it('should handle zero', () => {
            expect(calculate(0, 5, 'add')).toBe(5);
        });
    });

    describe('subtract operation', () => {
        it('should subtract two numbers', () => {
            expect(calculate(10, 3, 'subtract')).toBe(7);
        });

        it('should handle negative results', () => {
            expect(calculate(3, 10, 'subtract')).toBe(-7);
        });
    });

    describe('multiply operation', () => {
        it('should multiply two numbers', () => {
            expect(calculate(4, 5, 'multiply')).toBe(20);
        });

        it('should handle zero multiplication', () => {
            expect(calculate(5, 0, 'multiply')).toBe(0);
        });
    });

    describe('divide operation', () => {
        it('should divide two numbers', () => {
            expect(calculate(10, 2, 'divide')).toBe(5);
        });

        it('should handle decimal results', () => {
            expect(calculate(10, 3, 'divide')).toBeCloseTo(3.333, 2);
        });

        it('should throw error when dividing by zero', () => {
            expect(() => calculate(10, 0, 'divide')).toThrow('0で割ることはできません');
        });
    });
});
