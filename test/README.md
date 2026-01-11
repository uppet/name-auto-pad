# 测试说明

## 测试场景

### 场景1：简单序列 (scenario01-simple)
最基本的使用场景，单个文件组需要补零对齐。
```
chapter1.txt  → chapter01.txt
chapter2.txt  → chapter02.txt
chapter10.txt → (无需更改)
```

### 场景2：多个文件组 (scenario02-groups)
目录中包含多个独立的文件组，分别处理。
```
track01.mp3 → (无需更改)
track2.mp3  → track02.mp3
track99.mp3 → (无需更改)

img1.png  → img01.png
img20.png → (无需更改)
```

### 场景3：已对齐 (scenario03-aligned)
文件已经是对齐格式，不应有任何更改。
```
file001.txt → (无需更改)
file002.txt → (无需更改)
file100.txt → (无需更改)
```

### 场景4：混合文件 (scenario04-mixed)
包含需要对齐的文件、不需要数字的文件、隐藏文件。
```
data1.csv → data01.csv
data9.csv → data09.csv
readme.md → (跳过，无数字)
.hidden.txt → (跳过，隐藏文件)
photo5.jpg → photo05.jpg
```

### 场景5：嵌套目录 (scenario05-nested)
包含子目录，测试工具是否只处理当前目录。
```
file1.txt → file01.txt
file5.txt → file05.txt
file10.txt → (无需更改)
subdir/ → (不处理子目录)
```

### 场景6：多个数字 (scenario06-multiple-numbers)
文件名中包含多个数字，优先匹配文件名末尾的数字（通常是集数/序号）。
```
(2022人类漫游1.MP4) → (2022人类漫游01.MP4)
(2022人类漫游2.MP4) → (2022人类漫游02.MP4)
(2022人类漫游10.MP4) → (无需更改)
```
**说明**：工具会识别末尾的集数（1、2、10）进行补零，而不会影响开头的年份（2022）。

### 场景7：复杂多数字 (scenario07-complex-multiple)
更复杂的多数字场景，包含不同格式的文件名。
```
[2023]剧集第1集.mp4 → [2023]剧集第01集.mp4
[2023]剧集第12集.mp4 → (无需更改)
2024-01-15_备份5.zip → 2024-01-15_备份05.zip
2024-01-15_备份01.zip → (无需更改，已对齐)
2024-01-15_备份10.zip → (无需更改，已对齐)
```

## 如何用 bun 测试

### 1. 进入测试场景目录
```bash
cd test/scenario01-simple
```

### 2. 预览重命名计划
```bash
bun run ../../dist/cli.js --test-run
```

### 3. 实际执行重命名
```bash
bun run ../../dist/cli.js --run
```

### 4. 查看结果
```bash
ls -la
```

### 5. 重新构建（如果修改了代码）
```bash
cd ../..
bun build src/cli.ts --outdir dist --target node
```

## 快速测试所有场景

```bash
# 测试场景1
cd test/scenario01-simple && bun run ../../dist/cli.js --test-run && cd ../..

# 测试场景2
cd test/scenario02-groups && bun run ../../dist/cli.js --test-run && cd ../..

# 测试场景3
cd test/scenario03-aligned && bun run ../../dist/cli.js --test-run && cd ../..

# 测试场景4
cd test/scenario04-mixed && bun run ../../dist/cli.js --test-run && cd ../..

# 测试场景5
cd test/scenario05-nested && bun run ../../dist/cli.js --test-run && cd ../..

# 测试场景6
cd test/scenario06-multiple-numbers && bun run ../../dist/cli.js --test-run && cd ../..

# 测试场景7
cd test/scenario07-complex-multiple && bun run ../../dist/cli.js --test-run && cd ../..
```

## 恢复测试文件

如果需要重置测试文件，可以运行：

```bash
# 删除并重新创建 test 目录
rm -rf test
bun run create-test-files.ts
```
