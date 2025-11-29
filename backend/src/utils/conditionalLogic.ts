import { IConditionalRules } from '../models';

/**
 * Pure function to determine if a question should be shown based on conditional rules
 * @param rules - The conditional rules for the question (null means always show)
 * @param answersSoFar - The answers provided so far in the form
 * @returns boolean - true if the question should be shown, false otherwise
 */
export function shouldShowQuestion(
  rules: IConditionalRules | null | undefined,
  answersSoFar: Record<string, any>
): boolean {
  // If no rules, always show the question
  if (!rules || !rules.conditions || rules.conditions.length === 0) {
    return true;
  }

  const { logic, conditions } = rules;

  // Evaluate each condition
  const evaluateCondition = (condition: {
    questionKey: string;
    operator: 'equals' | 'notEquals' | 'contains';
    value: any;
  }): boolean => {
    const { questionKey, operator, value } = condition;
    
    // Get the answer for this question (safely handle undefined)
    const answer = answersSoFar[questionKey];

    // Handle undefined answers - they don't match anything except notEquals
    if (answer === undefined || answer === null) {
      return operator === 'notEquals';
    }

    switch (operator) {
      case 'equals':
        // Strict equality check
        if (Array.isArray(answer)) {
          // For multi-select, check if arrays are equal
          return JSON.stringify(answer.sort()) === JSON.stringify(
            Array.isArray(value) ? value.sort() : [value]
          );
        }
        return answer === value;

      case 'notEquals':
        // Strict inequality check
        if (Array.isArray(answer)) {
          return JSON.stringify(answer.sort()) !== JSON.stringify(
            Array.isArray(value) ? value.sort() : [value]
          );
        }
        return answer !== value;

      case 'contains':
        // Convert both to strings for contains check
        const answerStr = String(answer).toLowerCase();
        const valueStr = String(value).toLowerCase();
        
        if (Array.isArray(answer)) {
          // For arrays, check if any element contains the value
          return answer.some(item => 
            String(item).toLowerCase().includes(valueStr)
          );
        }
        return answerStr.includes(valueStr);

      default:
        return false;
    }
  };

  // Combine conditions based on logic
  if (logic === 'AND') {
    // All conditions must be true
    return conditions.every(evaluateCondition);
  } else {
    // At least one condition must be true (OR)
    return conditions.some(evaluateCondition);
  }
}
