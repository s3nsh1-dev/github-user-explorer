import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

// The config had no React or accessibility rules at all, which is why a
// missing rel="noopener noreferrer" and every missing aria-label went
// unnoticed until someone read the files. These two plugins are the durable
// version of that review.
export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      react,
    },
    settings: {
      react: { version: 'detect' },
      // MUI renders anchors through `component=`, so without this the link
      // rules cannot see <Button component="a" href=…> or <IconButton
      // component={RouterLink} to=…> — which is exactly the form that was
      // vulnerable to reverse tabnabbing in ShowSelectedRepo.
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'RouterLink', linkAttribute: 'to' },
        { name: 'Button', linkAttribute: 'href' },
        { name: 'IconButton', linkAttribute: 'href' },
        { name: 'Chip', linkAttribute: 'href' },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
