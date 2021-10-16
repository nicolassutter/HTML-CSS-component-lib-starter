module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 13,
    'sourceType': 'module'
  },
  'plugins': ['@typescript-eslint'],
  'rules': {
    'linebreak-style': 'off',
    'keyword-spacing': ['error'],
    'space-in-parens': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['warn', 'never'],
    'key-spacing': ['error', { afterColon: true }],
    'no-console': 'off',
    /**
     * On force une indentation de 2*1 espaces pour les `switch () {}`
     */
    indent: ['error', 2, { SwitchCase: 1 }],
    // 'template-curly-spacing' : 'off',
    'quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'curly': ['error'],
    'brace-style': ['error'],
    'eqeqeq': ['error'],
    'semi': ['warn', 'never'],
    'spaced-comment': ['warn'],
    'object-shorthand': 'warn',
    'prefer-const': [
      'error',
      {
        'destructuring': 'all',
        'ignoreReadBeforeAssign': false
      }
    ],
    'space-infix-ops': ['warn'],
    'space-unary-ops': [2, {
      'words': true,
      'nonwords': false
    }],
    'no-unused-vars': ['error', {
      args: 'after-used',
      /**
       * Ignore les paramètres de fonctions inutilisés qui commencent par _
       *
       * Utile pour la déstructuration de tableaux
       */
      argsIgnorePattern: '^_'
    }],
    'no-trailing-spaces': ['warn'],
    'no-var': ['error'],
    'comma-spacing': ['warn'],
    'no-unneeded-ternary': 'error'
  }
}
