#!/usr/bin/env bun
import { renameSync } from 'node:fs';
import { resolve } from 'node:path';
import type { FileGroup, RenamePlan } from './types.js';
import { createRenamePlan } from './fileScanner.js';

/**
 * 打印帮助信息
 */
function printHelp() {
  console.log(`
📁 name-auto-pad - 文件自动补零重命名工具

功能说明：
  自动扫描当前目录的文件，找到文件名中相同的部分，提取其中的数字。
  然后根据最大数字的宽度，给较短的数字前面补充 0 字符。
  这样可以让这些文件的排序能适应更多对名字只有字符敏感的软件环境。

使用方法：
  name-auto-pad              显示此帮助信息
  name-auto-pad --test-run   预览将要执行的重命名操作（推荐先运行此命令）
  name-auto-pad --run        实际执行重命名操作

示例：
  假设目录中有文件：file1.txt, file2.txt, file10.txt
  运行后会被重命名为：file01.txt, file02.txt, file10.txt

注意事项：
  - 建议先运行 --test-run 查看预览
  - 只处理包含数字的文件
  - 文件按数字模式分组处理
  发布: npmjs.com/package/name-auto-pad
`);
}

/**
 * 打印重命名计划
 */
function printPlan(plan: RenamePlan) {
  if (plan.groups.length === 0) {
    console.log('⚠️  未找到需要处理的文件（文件名中需要包含数字）');
    return;
  }

  if (plan.totalToRename === 0) {
    console.log('✅ 所有文件已经是对齐格式，无需重命名');
    return;
  }

  console.log(`\n📋 重命名计划 (共 ${plan.totalToRename} 个文件将被重命名):\n`);

  for (const group of plan.groups) {
    if (group.files.length < 2) continue;

    const filesToRename = group.files.filter(f => f.needsRename);
    if (filesToRename.length === 0) continue;

    console.log(`📂 分组: ${group.baseName}${group.extension}`);
    for (const file of group.files) {
      if (file.needsRename) {
        console.log(`   ${file.originalName} → ${file.newName}`);
      }
    }
    console.log('');
  }
}

/**
 * 执行重命名
 */
function executeRename(plan: RenamePlan) {
  if (plan.totalToRename === 0) {
    console.log('✅ 无需重命名');
    return;
  }

  console.log('\n🔄 开始执行重命名...\n');

  let successCount = 0;
  let failCount = 0;

  for (const group of plan.groups) {
    for (const file of group.files) {
      if (!file.needsRename) continue;

      try {
        renameSync(
          resolve('.', file.originalName),
          resolve('.', file.newName)
        );
        console.log(`✓ ${file.originalName} → ${file.newName}`);
        successCount++;
      } catch (error) {
        console.log(`✗ ${file.originalName} → ${file.newName}`);
        console.log(`  错误: ${error}`);
        failCount++;
      }
    }
  }

  console.log(`\n✅ 完成！成功: ${successCount}, 失败: ${failCount}`);
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);

  // 无参数：显示帮助
  if (args.length === 0) {
    printHelp();
    return;
  }

  // 解析参数
  const mode = args[0];

  if (mode === '--test-run' || mode === '-t') {
    console.log('🔍 扫描当前目录...\n');
    const plan = createRenamePlan('.');
    printPlan(plan);
    console.log('💡 提示: 以上为预览，如需实际执行请使用 --run 参数');
  } else if (mode === '--run' || mode === '-r') {
    console.log('🔍 扫描当前目录...\n');
    const plan = createRenamePlan('.');

    if (plan.totalToRename === 0) {
      printPlan(plan);
      return;
    }

    printPlan(plan);
    console.log('⚠️  即将执行重命名操作，请确认...');
    executeRename(plan);
  } else if (mode === '--help' || mode === '-h') {
    printHelp();
  } else {
    console.log(`❌ 未知参数: ${mode}`);
    console.log('请使用 --help 查看帮助信息');
    process.exit(1);
  }
}

main();
