import { readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import type { FileGroup, FileInfo, RenamePlan } from './types.js';

/**
 * 从文件名中提取数字（包含位置信息）
 * 策略：优先匹配文件名末尾的数字，因为这通常是序号/集数
 * 例如: "(2022人类漫游1.MP4)" -> { number: 1, index: 8, length: 1 }
 *       "file001.txt" -> { number: 1, index: 4, length: 3 }
 */
function extractNumber(filename: string): { number: number; index: number; length: number } | null {
  // 去除扩展名
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

  // 策略：从右向左查找数字，优先匹配文件名末尾的数字
  // 这样可以正确处理 "(2022人类漫游1)" 这种情况，提取 "1" 而不是 "2022"

  // 1. 首先尝试匹配末尾的数字（最常见的情况：集数、序号在最后）
  const trailingMatch = nameWithoutExt.match(/(\d+)[^\d]*$/);
  if (trailingMatch && trailingMatch.index !== undefined) {
    return {
      number: parseInt(trailingMatch[1], 10),
      index: trailingMatch.index,
      length: trailingMatch[1].length,
    };
  }

  // 2. 如果没有末尾的数字，尝试匹配开头的数字（如 "123file.txt"）
  const leadingMatch = nameWithoutExt.match(/^(\d+)/);
  if (leadingMatch && leadingMatch.index !== undefined) {
    return {
      number: parseInt(leadingMatch[1], 10),
      index: leadingMatch.index,
      length: leadingMatch[1].length,
    };
  }

  // 3. 如果都没有，查找文件名中最后的数字
  const allMatches = [...nameWithoutExt.matchAll(/\d+/g)];
  if (allMatches.length > 0) {
    const lastMatch = allMatches[allMatches.length - 1];
    if (lastMatch.index !== undefined) {
      return {
        number: parseInt(lastMatch[1], 10),
        index: lastMatch.index,
        length: lastMatch[1].length,
      };
    }
  }

  return null;
}

/**
 * 扫描当前目录并按文件名模式分组
 */
export function scanFiles(dir: string = '.'): FileGroup[] {
  const files = readdirSync(dir, { withFileTypes: true });

  // 只处理普通文件，跳过目录和隐藏文件
  const normalFiles = files
    .filter(f => f.isFile() && !f.name.startsWith('.'))
    .map(f => f.name)
    .filter(name => name !== 'package.json' && name !== 'node_modules');

  const groupMap = new Map<string, FileGroup>();

  for (const filename of normalFiles) {
    const numberInfo = extractNumber(filename);
    const extension = extname(filename);

    // 只有包含数字的文件才参与分组
    if (numberInfo === null) continue;

    // 生成基础名称（只替换被提取的数字为占位符）
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const before = nameWithoutExt.substring(0, numberInfo.index);
    const after = nameWithoutExt.substring(numberInfo.index + numberInfo.length);
    const baseName = before + '#' + after;

    const key = `${baseName}|${extension}`;

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        baseName: before + after,  // 去掉占位符后的基础名称
        extension,
        files: [],
      });
    }

    const group = groupMap.get(key)!;
    group.files.push({
      originalName: filename,
      number: numberInfo.number,
      numberIndex: numberInfo.index,
      numberLength: numberInfo.length,
      newName: '', // 稍后计算
      needsRename: false,
    });
  }

  return Array.from(groupMap.values());
}

/**
 * 计算补零并生成重命名计划
 */
export function generateRenamePlan(groups: FileGroup[]): RenamePlan {
  let totalToRename = 0;

  for (const group of groups) {
    if (group.files.length < 2) {
      // 只有一个文件的分组不需要重命名
      group.files.forEach(f => f.newName = f.originalName);
      continue;
    }

    // 找出最大的数字位数
    const maxNumber = Math.max(...group.files.map(f => f.number));
    const maxDigits = maxNumber.toString().length;

    // 为每个文件生成新名称
    for (const file of group.files) {
      const paddedNumber = file.number.toString().padStart(maxDigits, '0');
      const originalWithoutExt = file.originalName.replace(/\.[^/.]+$/, '');
      const originalExt = extname(file.originalName);

      // 使用记录的位置信息精确替换被提取的数字
      const before = originalWithoutExt.substring(0, file.numberIndex);
      const after = originalWithoutExt.substring(file.numberIndex + file.numberLength);
      const newWithoutExt = before + paddedNumber + after;

      file.newName = newWithoutExt + originalExt;
      file.needsRename = file.newName !== file.originalName;

      if (file.needsRename) {
        totalToRename++;
      }
    }

    // 按数字排序
    group.files.sort((a, b) => a.number - b.number);
  }

  return { groups, totalToRename };
}

/**
 * 创建完整的重命名计划
 */
export function createRenamePlan(dir: string = '.'): RenamePlan {
  const groups = scanFiles(dir);
  return generateRenamePlan(groups);
}
