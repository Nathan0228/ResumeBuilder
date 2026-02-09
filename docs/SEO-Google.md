# 让网站在 Google 中被搜索到

项目里已经加好了基础 SEO 和爬虫配置，按下面步骤做完后，Google 才能稳定收录你的网站。

## 1. 部署到公网

- 网站必须有一个 **公网可访问的域名**（例如 `https://your-resume-builder.com`）。
- 用 Vercel / Netlify / GitHub Pages 等部署后，记下你的**真实域名**。

## 2. 把域名改成你的

在仓库里全局把 **`https://yoursite.com`** 换成你的真实地址：

- **index.html**：`<link rel="canonical" href="https://你的域名/" />`
- **public/robots.txt**：`Sitemap: https://你的域名/sitemap.xml`
- **public/sitemap.xml**：三处 `<loc>https://yoursite.com/...</loc>` 都改成 `https://你的域名/...`

例如域名是 `https://resume.waterman.ip-ddns.com`，则：

- canonical: `https://resume.waterman.ip-ddns.com/`
- Sitemap: `https://resume.waterman.ip-ddns.com/sitemap.xml`
- sitemap.xml 里三个 `<loc>` 都换成 `https://resume.waterman.ip-ddns.com/`、`/builder`、`/about`。

## 3. 到 Google 提交网站（必做）

1. 打开 **[Google Search Console](https://search.google.com/search-console)**，用 Google 账号登录。
2. 点击「添加资源」→ 选「网址前缀」→ 输入你的首页地址，例如 `https://你的域名/`。
3. **验证所有权**（任选一种）：
   - **HTML 文件**：按提示下载验证文件，放到站点的**根目录**（部署后能访问到 `https://你的域名/xxx.html`），然后点验证。
   - **HTML 标签**：把给的 `<meta name="google-site-verification" content="..." />` 加到 **index.html** 的 `<head>` 里，重新部署后点验证。
4. 验证通过后，在 Search Console 里：
   - 左侧选「站点地图」→ 输入 `sitemap.xml` → 提交。
   - 可选：左侧「网址检查」里输入首页 URL，请求编入索引。

之后 Google 会按 sitemap 和爬虫规则抓取你的页面，几小时到几天内可能就会在搜索结果里出现。

## 4. 项目里已做的 SEO 相关配置

- **index.html**：`description`、`keywords`、`og:title` / `og:description`、`canonical`，便于搜索摘要和分享。
- **public/robots.txt**：允许所有爬虫抓取，并指向 sitemap。
- **public/sitemap.xml**：列出首页、/builder、/about，方便 Google 发现所有主要页面。

## 5. 可选：更多收录方式

- **Bing**：到 [Bing Webmaster Tools](https://www.bing.com/webmasters) 添加站点并提交同一份 sitemap。
- **外链**：在博客、GitHub 简介、社交资料里放上网站链接，有助于爬虫发现和权重。

---

**总结**：部署到公网 → 把 yoursite.com 改成你的域名 → 在 Google Search Console 添加资源、验证、提交 sitemap。做完这些，网站就有机会在 Google 中被搜索到。
