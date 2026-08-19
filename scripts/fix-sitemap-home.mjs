// 构建后处理：将 sitemap 首页 URL 的尾斜杠去掉
// 规范：首页根域名不带尾斜杠（https://www.xxx.com），内页带尾斜杠（https://www.xxx.com/yyy/）
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distDir = join(process.cwd(), "dist");
const sitemapIndex = join(distDir, "sitemap-index.xml");

// sitemap-index.xml 里记录的是子 sitemap 文件，无需处理首页
// 需要处理的是 sitemap-0.xml 里的首页 URL
const sitemapFile = join(distDir, "sitemap-0.xml");

try {
  const content = readFileSync(sitemapFile, "utf8");
  // 仅替换首页根域名（https://www.xxx.com/ 且路径为空的情况），保留内页尾斜杠
  const fixed = content.replace(
    /<loc>(https:\/\/www\.[^<]+\/)<\/loc>/,
    (match, url) => `<loc>${url.replace(/\/$/, "")}</loc>`
  );
  if (fixed !== content) {
    writeFileSync(sitemapFile, fixed, "utf8");
    console.log("[fix-sitemap-home] 已去除 sitemap 首页 URL 尾斜杠");
  } else {
    console.log("[fix-sitemap-home] 无需处理（首页 URL 已无尾斜杠）");
  }
} catch (err) {
  if (err.code === "ENOENT") {
    console.log("[fix-sitemap-home] 未找到 sitemap-0.xml，跳过");
  } else {
    throw err;
  }
}
