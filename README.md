melb-quiz/
├─ index.html
├─ vercel.json
├─ README.md
├─ config.json                # 只改这里即可：API_BASE、积分、倍率等
├─ data/
│  └─ questions.json         # 题库（可持续追加/替换）
├─ css/
│  └─ style.css              # 主题与动画
└─ js/
   ├─ main.js                # 入口：启动应用
   ├─ config.js              # 读取 config.json
   ├─ state.js               # 全局状态（积分、倍率、已答数等）
   ├─ api.js                 # 与 Wix/Velo 对接（自动超时兜底本地）
   ├─ data.js                # 加载题库（本地或后端）
   ├─ ui.js                  # DOM 绑定与渲染
   ├─ quiz.js                # 核心玩法规则（判分、双倍、结束本轮）
   ├─ fx.js                  # Canvas 粒子/爆裂特效
   └─ sfx.js                 # WebAudio “叮”音效
# MelbQuiz 模块化版
- 纯静态 ES Modules，Vercel 直接部署
- 不限题数，3题一跳下一题双倍（config.json 可改）
- 「结束本轮」保留积分不清零
- 支持接 Wix/Velo API（填 config.json 的 API_BASE 即可）

## 开发
- 直接把整个目录丢到 Vercel 新项目
- 本地可用：`npx serve .` 或任意静态服务器

## 修改
- 配置：`config.json`（积分、倍率、领奖中心链接、API_BASE）
- 题库：`data/questions.json`（可无限追加）
- UI：`css/style.css`
- 规则：`js/quiz.js`
- 特效：`js/fx.js`

## 接 Wix/Velo
config.json:
{
  "API_BASE":"https://你的域名/_functions",
  "ENDPOINTS":{"ME":"/me","ADD_POINTS":"/points/add","RECORD_ANSWER":"/answers/record","TODAY_QUESTION":"/questions/today"}
}
