// 在全局作用域声明
declare global {
  // 扩展数组的原型
  interface Array<T> {
    at(index: number): T | undefined; // 增加 at 方法
  }
}

// 如果数组原型中不存在 at 方法
if (!Array.prototype.at) {
  // 定义数组原型的 at 方法
  Array.prototype.at = function (index: number) {
    // 获取数组的长度
    const length = this.length;

    // 将负数索引转换为正数索引
    if (index < 0) {
      index = length + index;
    }

    // 如果索引超出范围，则返回 undefined
    if (index < 0 || index >= length) {
      return undefined;
    }

    // 使用 Array.prototype.slice 方法获取指定索引位置的值
    return Array.prototype.slice.call(this, index, index + 1)[0];
  };
}

// 导出一个空对象，以确保这段代码不会与其他文件中的全局声明合并
export {};
