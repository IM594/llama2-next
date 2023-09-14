// import md5 from "spark-md5";

// // 从环境变量中获取访问代码，将其哈希化并返回一个 Set
// export function getAccessCodes(): Set<string> {
//   const code = process.env.CODE; // 从环境变量中获取 CODE 值

//   try {
//     // 将 CODE 字符串按逗号分隔，过滤掉空字符串，然后对每个代码进行哈希处理
//     const codes = (code?.split(",") ?? [])
//       .filter((v) => !!v)
//       .map((v) => md5.hash(v.trim()));

//     // 创建一个 Set 并将哈希后的代码添加到 Set 中
//     return new Set(codes);
//   } catch (e) {
//     // 如果出现错误，返回一个空的 Set
//     return new Set();
//   }
// }

// // 获取访问代码的哈希化集合
// export const ACCESS_CODES = getAccessCodes();
