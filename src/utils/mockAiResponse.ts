const mockProblem = `# 最长递增子序列

## 题目描述

给定一个整数数组 nums，找到其中最长严格递增子序列的长度。

子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

## 输入格式

第一行包含一个整数 n (1 ≤ n ≤ 1000)，表示数组长度。
第二行包含 n 个整数，表示数组 nums，其中 -10^4 ≤ nums[i] ≤ 10^4。

## 输出格式

输出一个整数，表示最长递增子序列的长度。

## 样例输入

\`\`\`
8
10 9 2 5 3 7 101 18
\`\`\`

## 样例输出

\`\`\`
4
\`\`\`

## 提示

最长递增子序列是 [2,5,7,101]，因此长度为 4。

## 数据范围

* 1 ≤ nums.length ≤ 1000
* -10^4 ≤ nums[i] ≤ 10^4

## 题目标签

* 动态规划
* 二分查找`

const mockTestcases = [
  {
    input: `8
10 9 2 5 3 7 101 18`,
    output: '4',
    score: 20
  },
  {
    input: `6
0 1 0 3 2 3`,
    output: '4',
    score: 20
  },
  {
    input: `1
7`,
    output: '1',
    score: 20
  },
  {
    input: `10
1 2 3 4 5 6 7 8 9 10`,
    output: '10',
    score: 20
  },
  {
    input: `10
10 9 8 7 6 5 4 3 2 1`,
    output: '1',
    score: 20
  }
]

export function mockAiResponse(mode: 'problem' | 'testcase', prompt: string) {
  // 模拟延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mode === 'problem') {
        resolve(mockProblem)
      } else {
        resolve(mockTestcases)
      }
    }, 1500)
  })
}
