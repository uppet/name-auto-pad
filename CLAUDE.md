# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 开发工具链
- 运行时: Bun (bun.sh)
- 语言: TypeScript
- 构建: `bun build src/cli.ts --outdir dist --target node`
- 开发测试: `bun run src/cli.ts`

# 项目概述
一个可通过 npx 运行的命令行工具，用于批量重命名文件并对齐数字序号。

## 功能
自动扫描当前目录内的文件，找到文件名中相同的部分，提取其中的数字字符。
然后根据最大数字的位数，给较短的数字前面补充 0 字符。

这样可以让这些文件的排序能适应更多只对字符串敏感的软件环境（如按字母排序时）。

## 使用场景示例
```
# 重命名前
file1.txt
file2.txt
file10.txt

# 重命名后
file01.txt
file02.txt
file10.txt
```

## CLI 参数
- 无参数: 显示帮助信息和使用说明
- `--test-run` / `-t`: 预览将要执行的重命名操作（推荐先运行此命令）
- `--run` / `-r`: 实际执行重命名操作
- `--help` / `-h`: 显示帮助信息

# 发布信息
- 目标平台: npmjs.com
- 包名: name-auto-pad

# 代码结构
- `src/types.ts` - 类型定义
- `src/fileScanner.ts` - 文件扫描、分组、补零计算逻辑
- `src/cli.ts` - 命令行入口和用户交互
