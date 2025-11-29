import { shouldShowQuestion } from '../conditionalLogic';
import { IConditionalRules } from '../../models';

describe('shouldShowQuestion', () => {
  describe('No rules', () => {
    it('should return true when rules are null', () => {
      expect(shouldShowQuestion(null, {})).toBe(true);
    });

    it('should return true when rules are undefined', () => {
      expect(shouldShowQuestion(undefined, {})).toBe(true);
    });

    it('should return true when conditions array is empty', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: []
      };
      expect(shouldShowQuestion(rules, {})).toBe(true);
    });
  });

  describe('Equals operator', () => {
    it('should return true when value equals', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' }
        ]
      };
      const answers = { status: 'Active' };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should return false when value does not equal', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' }
        ]
      };
      const answers = { status: 'Inactive' };
      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });

    it('should return false when answer is undefined', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' }
        ]
      };
      const answers = {};
      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });
  });

  describe('NotEquals operator', () => {
    it('should return true when value does not equal', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'notEquals', value: 'Active' }
        ]
      };
      const answers = { status: 'Inactive' };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should return false when value equals', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'notEquals', value: 'Active' }
        ]
      };
      const answers = { status: 'Active' };
      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });

    it('should return true when answer is undefined', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'notEquals', value: 'Active' }
        ]
      };
      const answers = {};
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });
  });

  describe('Contains operator', () => {
    it('should return true when string contains value (case-insensitive)', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'email', operator: 'contains', value: 'example' }
        ]
      };
      const answers = { email: 'test@EXAMPLE.com' };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should return false when string does not contain value', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'email', operator: 'contains', value: 'gmail' }
        ]
      };
      const answers = { email: 'test@example.com' };
      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });

    it('should return true when array contains value', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'tags', operator: 'contains', value: 'tech' }
        ]
      };
      const answers = { tags: ['Technology', 'Science'] };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should return false when answer is undefined', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'email', operator: 'contains', value: 'example' }
        ]
      };
      const answers = {};
      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });
  });

  describe('AND logic', () => {
    it('should return true when all conditions are met', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' },
          { questionKey: 'type', operator: 'equals', value: 'Premium' }
        ]
      };
      const answers = { status: 'Active', type: 'Premium' };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should return false when any condition fails', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' },
          { questionKey: 'type', operator: 'equals', value: 'Premium' }
        ]
      };
      const answers = { status: 'Active', type: 'Basic' };
      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });
  });

  describe('OR logic', () => {
    it('should return true when at least one condition is met', () => {
      const rules: IConditionalRules = {
        logic: 'OR',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' },
          { questionKey: 'type', operator: 'equals', value: 'Premium' }
        ]
      };
      const answers = { status: 'Inactive', type: 'Premium' };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should return false when no conditions are met', () => {
      const rules: IConditionalRules = {
        logic: 'OR',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' },
          { questionKey: 'type', operator: 'equals', value: 'Premium' }
        ]
      };
      const answers = { status: 'Inactive', type: 'Basic' };
      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });

    it('should return true when all conditions are met', () => {
      const rules: IConditionalRules = {
        logic: 'OR',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' },
          { questionKey: 'type', operator: 'equals', value: 'Premium' }
        ]
      };
      const answers = { status: 'Active', type: 'Premium' };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });
  });

  describe('Array handling', () => {
    it('should handle multi-select equals correctly', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'interests', operator: 'equals', value: ['Tech', 'Sports'] }
        ]
      };
      const answers = { interests: ['Tech', 'Sports'] };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should handle multi-select equals with different order', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'interests', operator: 'equals', value: ['Sports', 'Tech'] }
        ]
      };
      const answers = { interests: ['Tech', 'Sports'] };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should return false for multi-select with different values', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'interests', operator: 'equals', value: ['Tech', 'Sports'] }
        ]
      };
      const answers = { interests: ['Tech', 'Music'] };
      expect(shouldShowQuestion(rules, answers)).toBe(false);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle complex AND logic with mixed operators', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'status', operator: 'equals', value: 'Active' },
          { questionKey: 'role', operator: 'notEquals', value: 'Guest' },
          { questionKey: 'email', operator: 'contains', value: 'company.com' }
        ]
      };
      const answers = {
        status: 'Active',
        role: 'User',
        email: 'john@company.com'
      };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should handle null values gracefully', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'optional', operator: 'notEquals', value: 'something' }
        ]
      };
      const answers = { optional: null };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });

    it('should handle type coercion for contains operator', () => {
      const rules: IConditionalRules = {
        logic: 'AND',
        conditions: [
          { questionKey: 'count', operator: 'contains', value: '5' }
        ]
      };
      const answers = { count: 15 };
      expect(shouldShowQuestion(rules, answers)).toBe(true);
    });
  });
});
