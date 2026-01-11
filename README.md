# name-auto-pad

自动扫描文件并按数字补零对齐的命令行工具。

## 功能说明

自动扫描当前目录的文件，找到文件名中相同的部分，提取其中的数字。然后根据最大数字的位数，给较短的数字前面补充 `0` 字符。

这样可以让这些文件的排序能适应更多只对字符串敏感的软件环境。

## 使用示例

假设目录中有以下文件：
```
file1.txt
file2.txt
file10.txt
```

运行工具后会重命名为：
```
file01.txt
file02.txt
file10.txt
```

## 安装

```bash
# 通过 npx 直接运行（无需安装）
npx name-auto-pad

# 或全局安装
npm install -g name-auto-pad
```

## 使用方法

```bash
# 显示帮助信息
name-auto-pad

# 预览将要执行的重命名操作（推荐先运行此命令）
name-auto-pad --test-run

# 实际执行重命名操作
name-auto-pad --run
```

### 参数说明

| 参数 | 简写 | 说明 |
|------|------|------|
| `--test-run` | `-t` | 预览将要执行的重命名操作 |
| `--run` | `-r` | 实际执行重命名操作 |
| `--help` | `-h` | 显示帮助信息 |

## 开发

```bash
# 安装依赖
bun install

# 开发运行
bun run dev

# 构建
bun run build

# 测试
bun run src/cli.ts --test-run
```

## 注意事项

- 建议先运行 `--test-run` 查看预览，确认无误后再执行 `--run`
- 只处理包含数字的文件
- 文件按数字模式分组处理
- 隐藏文件（以 `.` 开头）会被自动跳过
- 智能识别文件名末尾的数字（通常是集数/序号），不影响其他数字（如年份）

## 仓库

GitHub: [uppet/name-auto-pad](https://github.com/uppet/name-auto-pad)

## 作者

Joyer Huang

## 许可证

[MIT](LICENSE)

