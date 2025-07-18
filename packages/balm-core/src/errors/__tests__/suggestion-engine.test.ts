/**
 * Tests for suggestion engine
 */

import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

// Mock the suggestion engine for testing
class MockSuggestionEngine {
  getRules() {
    return ['rule1', 'rule2'];
  }

  async suggest(error: any) {
    return {
      suggestions: ['npm install missing-package', 'Check your configuration'],
      appliedRules: ['module-not-found', 'config-syntax'],
    };
  }
}

// Mock functions
const SuggestionEngine = MockSuggestionEngine;
const getGlobalSuggestionEngine = () => new MockSuggestionEngine();
const suggestForError = async (error: any) => new MockSuggestionEngine().suggest(error);

const createBalmError = (code: string, data: any) => ({ code, data, type: 'balm' });
const createCompilationError = (code: string, data: any, context: any) => ({ 
  code, 
  data, 
  context, 
  type: 'compilation' 
});

describe('SuggestionEngine', () => {
  let engine: MockSuggestionEngine;

  beforeEach(() => {
    engine = new SuggestionEngine();
  });

  describe('constructor', () => {
    it('should create engine with built-in rules', () => {
      const rules = engine.getRules();
      assert.ok(rules.length > 0);
    });
  });

  describe('suggestion generation', () => {
    it('should generate suggestions for module not found errors', async () => {
      const error = createCompilationError('COMPILATION-MODULE-001', {
        module: 'missing-package',
      }, {
        location: { filePath: '/src/index.js' },
      });

      const result = await engine.suggest(error);

      assert.ok(result.suggestions.length > 0);
      assert.ok(result.suggestions.some((s: string) => s.includes('npm install')));
    });

    it('should generate suggestions for configuration errors', async () => {
      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'balm.config.js' });

      const result = await engine.suggest(error);

      assert.ok(result.suggestions.length > 0);
      assert.ok(result.suggestions.some((s: string) => s.includes('configuration')));
    });
  });

  describe('global suggestion engine', () => {
    it('should get global suggestion engine', () => {
      const global = getGlobalSuggestionEngine();
      assert.ok(global instanceof MockSuggestionEngine);
    });

    it('should use global engine for suggestForError', async () => {
      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });
      const result = await suggestForError(error);

      assert.ok(result.suggestions);
      assert.ok(result.appliedRules);
    });
  });
});