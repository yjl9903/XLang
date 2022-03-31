import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index', 'src/cli'
  ],
  replace: {
    'import.meta.vitest': 'undefined',
  },
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});