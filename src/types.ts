/**
 * 文件分组信息
 */
export interface FileGroup {
  /** 分组的基础名称（去除数字后的部分） */
  baseName: string;
  /** 扩展名 */
  extension: string;
  /** 该组的所有文件 */
  files: FileInfo[];
}

/**
 * 单个文件信息
 */
export interface FileInfo {
  /** 原始文件名 */
  originalName: string;
  /** 提取的数字 */
  number: number;
  /** 数字在原文件名中的位置（用于替换） */
  numberIndex: number;
  /** 数字的原始长度 */
  numberLength: number;
  /** 新文件名（补零后） */
  newName: string;
  /** 是否需要重命名 */
  needsRename: boolean;
}

/**
 * 重命名计划
 */
export interface RenamePlan {
  /** 分组列表 */
  groups: FileGroup[];
  /** 总共需要重命名的文件数 */
  totalToRename: number;
}
