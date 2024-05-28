export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
      ],
    ],
    'subject-max-length': [1, 'always', 150], // subject建议150字以内
  },
  ignores: [(commit) => commit.startsWith('refs #')], // 存在对应单子的提交格式refs #单号 标题
}
