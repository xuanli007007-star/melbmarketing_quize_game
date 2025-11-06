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
