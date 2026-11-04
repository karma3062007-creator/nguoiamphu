// Ghép nguồn thành các trang hoàn chỉnh trong dist/.  Chạy: node build.js
const fs = require("fs");
const path = require("path");

const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const readOpt = p => (fs.existsSync(path.join(root, p)) ? read(p) : "");
// Chặn "</script" lọt vào trong thẻ <script>
const safe = s => s.replace(/<\/script/gi, "<\\/script");

const levels = JSON.stringify(JSON.parse(read("src/shared/levels.json"))).replace(/</g, "\\u003c");
fs.mkdirSync(path.join(root, "dist"), { recursive: true });

// Khung trang giống khung Claude Artifact thêm vào khi xuất bản, để mở trực tiếp trên máy cũng đúng
const wrap = body => '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  + "<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>"
  + "</head><body>" + body + "</body></html>";

const tour = read("src/tour/tour.template.html").replace("__DATA__", () => levels);
fs.writeFileSync(path.join(root, "dist/am-phu-travel.html"), wrap(tour));

// Ưu tiên nhân vật của Antigravity (avatars-gen.js); chưa có thì dùng bản của Codex (avatars.js)
const avatarFile = fs.existsSync(path.join(root, "src/online/avatars-gen.js")) ? "src/online/avatars-gen.js" : "src/online/avatars.js";
const avatars = readOpt(avatarFile);
const extras = readOpt("src/online/extras.js");
const online = read("src/online/online.template.html")
  .replace("__DATA__", () => levels)
  .replace("/*__AVATARS__*/", () => safe(avatars) || "/* chưa có avatars.js: game dùng hình nhân vật đơn giản */")
  .replace("/*__EXTRAS__*/", () => safe(extras) || "/* chưa có extras.js */");
fs.writeFileSync(path.join(root, "dist/am-phu-online.html"), wrap(online));
// Bản không có khung, dùng để xuất bản lên Claude Artifact
fs.writeFileSync(path.join(root, "dist/.publish-online.html"), online);
fs.writeFileSync(path.join(root, "dist/.publish-travel.html"), tour);

// Kiểm tra cú pháp các đoạn script
let ok = true;
for (const [name, html] of [["am-phu-travel", tour], ["am-phu-online", online]]) {
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  blocks.forEach((js, i) => { try { new Function(js); } catch (e) { ok = false; console.error(`✗ ${name} script #${i + 1}: ${e.message}`); } });
}
console.log(ok ? "✓ Đã ghép xong dist/am-phu-travel.html và dist/am-phu-online.html" : "Có lỗi cú pháp, xem ở trên.");
console.log(`  nhân vật: ${avatars ? avatarFile : "chưa có"} · extras.js: ${extras ? "có" : "chưa có"}`);
process.exit(ok ? 0 : 1);
