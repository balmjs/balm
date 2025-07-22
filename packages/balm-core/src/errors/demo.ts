/**
 * Demo file showing how to use the BalmJS error handling system
 * This file demonstrates the key features and usage patterns
 */

import {
  createBalmError,
  createCompilationError,
  createConfigError,
  ErrorHandler,
  formatErrorForConsole,
  generateCodeFrameFromContent,
  SuggestionEngine,
  ErrorCategory,
  ErrorSeverity,
} from './index.js';

/**
 * Demo: Basic error creation and handling
 */
function demoBasicErrorHandling() {
  console.log('\n=== Basic Error Handling Demo ===');
  
  // Create a configuration error
  const configError = createConfigError('CONFIG-SYNTAX-001', 
    'Invalid configuration syntax in balm.config.js', 
    {
      config: { output: { path: 'dist' } },
      configPath: '/project/balm.config.js',
    }
  );
  
  // Create an error handler
  const handler = new ErrorHandler({
    logToConsole: false, // We'll format manually for demo
  });
  
  // Handle the error
  const handledError = handler.handleError(configError);
  
  // Format and display
  const formatted = formatErrorForConsole(handledError, {
    colors: false, // Disable colors for demo
    icons: true,
  });
  
  console.log(formatted);
  console.log('\nError Summary:', handler.getSummary());
}

/**
 * Demo: Code frame generation
 */
function demoCodeFrameGeneration() {
  console.log('\n=== Code Frame Generation Demo ===');
  
  const sampleCode = `function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  const tax = total * 0.08;
  return total + tax;
}

// Error on this line
const result = calculateTotal();`;

  // Generate code frame for the error
  const codeFrame = generateCodeFrameFromContent(
    sampleCode, 
    10, // Line 10 (the error line)
    25, // Column 25 (after 'calculateTotal')
    {
      colors: false,
      syntaxHighlighting: false,
      beforeLines: 2,
      afterLines: 1,
    }
  );
  
  console.log('Code frame for missing arguments error:');
  console.log(codeFrame.frame);
}

/**
 * Demo: Compilation error with code frame
 */
function demoCompilationErrorWithCodeFrame() {
  console.log('\n=== Compilation Error with Code Frame Demo ===');
  
  const sourceCode = `import React from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`;

  // Create compilation error
  const compilationError = createCompilationError('COMPILATION-MODULE-001', 
    'Module "useState" not found in MyComponent.jsx', 
    {
    location: {
      filePath: '/src/components/MyComponent.jsx',
      line: 4,
      column: 25,
      snippet: generateCodeFrameFromContent(sourceCode, 4, 25, {
        colors: false,
        syntaxHighlighting: false,
        beforeLines: 1,
        afterLines: 1,
      }).frame,
    },
  });
  
  // Format the error
  const formatted = formatErrorForConsole(compilationError, {
    colors: false,
    icons: true,
  });
  
  console.log(formatted);
}

/**
 * Demo: Suggestion engine
 */
async function demoSuggestionEngine() {
  console.log('\n=== Suggestion Engine Demo ===');
  
  // Create a module not found error
  const moduleError = createCompilationError('COMPILATION-MODULE-001', 
    'Module "reac" not found. Did you mean "react"?', 
    {
    location: { filePath: '/src/App.js' },
  });
  
  // Create suggestion engine
  const suggestionEngine = new SuggestionEngine();
  
  // Set context
  suggestionEngine.setContext({
    packageJson: {
      dependencies: {
        'react': '^18.0.0',
        'lodash': '^4.17.21',
      },
    },
    projectFiles: [
      'src/App.js',
      'src/components/Header.js',
      'src/utils/helpers.js',
    ],
  });
  
  // Generate suggestions
  const suggestions = await suggestionEngine.suggest(moduleError);
  
  console.log('Error:', moduleError.message);
  console.log('Suggestions:');
  suggestions.suggestions.forEach((suggestion, index) => {
    console.log(`  ${index + 1}. ${suggestion}`);
  });
  console.log('Applied rules:', suggestions.appliedRules);
}

/**
 * Demo: Multiple errors handling
 */
function demoMultipleErrorsHandling() {
  console.log('\n=== Multiple Errors Handling Demo ===');
  
  const errors = [
    createBalmError('CONFIG-SYNTAX-001', 'Configuration syntax error in balm.config.js'),
    createBalmError('CONFIG-DEPRECATED-001', 'Deprecated property "oldOption" used'),
    createCompilationError('COMPILATION-SYNTAX-001', 
      'Unexpected token in index.js', 
      {
      location: { filePath: '/src/index.js', line: 5, column: 10 },
    }),
  ];
  
  const handler = new ErrorHandler({ logToConsole: false });
  
  // Handle all errors
  const handledErrors = handler.handleErrors(errors);
  
  // Get summary
  const summary = handler.getSummary();
  console.log('Error Summary:');
  console.log(`  Total: ${summary.total}`);
  console.log(`  Fatal: ${summary.fatal}`);
  console.log(`  Errors: ${summary.errors}`);
  console.log(`  Warnings: ${summary.warnings}`);
  
  // Check error states
  console.log('\nError States:');
  console.log(`  Has fatal errors: ${handler.hasFatalErrors()}`);
  console.log(`  Has errors: ${handler.hasErrors()}`);
  console.log(`  Has warnings: ${handler.hasWarnings()}`);
}

/**
 * Demo: Custom error rule
 */
async function demoCustomErrorRule() {
  console.log('\n=== Custom Error Rule Demo ===');
  
  const suggestionEngine = new SuggestionEngine();
  
  // Add a custom rule
  suggestionEngine.addRule({
    id: 'custom-balm-rule',
    name: 'Custom BalmJS Rule',
    description: 'Provides custom suggestions for BalmJS projects',
    categories: [ErrorCategory.CONFIG],
    codes: ['CONFIG-SYNTAX-001'],
    priority: 100,
    matches: (error, context) => {
      return error.message.includes('balm.config');
    },
    suggest: (error, context) => {
      return [
        'Check the BalmJS documentation for configuration examples',
        'Validate your configuration using the BalmJS CLI tool',
        'Consider using the BalmJS configuration generator',
      ];
    },
  });
  
  const configError = createBalmError('CONFIG-SYNTAX-001', 'Configuration syntax error in balm.config.js');
  const suggestions = await suggestionEngine.suggest(configError);
  
  console.log('Custom suggestions for config error:');
  suggestions.suggestions.forEach((suggestion, index) => {
    console.log(`  ${index + 1}. ${suggestion}`);
  });
}

/**
 * Run all demos
 */
async function runAllDemos() {
  console.log('🚀 BalmJS Error Handling System Demo');
  console.log('=====================================');
  
  try {
    demoBasicErrorHandling();
    demoCodeFrameGeneration();
    demoCompilationErrorWithCodeFrame();
    await demoSuggestionEngine();
    demoMultipleErrorsHandling();
    await demoCustomErrorRule();
    
    console.log('\n✅ All demos completed successfully!');
  } catch (error) {
    console.error('\n❌ Demo failed:', error);
  }
}

// Export for use in other files or run directly
export {
  demoBasicErrorHandling,
  demoCodeFrameGeneration,
  demoCompilationErrorWithCodeFrame,
  demoSuggestionEngine,
  demoMultipleErrorsHandling,
  demoCustomErrorRule,
  runAllDemos,
};

// Run demos if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllDemos();
}