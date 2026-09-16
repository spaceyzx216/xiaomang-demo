// Mock data for the creator-suite demo.
// Each product carries its own full market-analysis payload:
// a 6-step reasoning trace + a Creative Brief, so the auto-run flow
// can stream realistic content per selection.

export type Trend = "up" | "hot" | "new"

export type Product = {
  id: string
  name: string
  category: string
  price: string
  commission: string
  trend: Trend
  trendScore: number // 0-100
  competition: "低" | "中" | "高"
  tags: string[]
  emoji: string
  tagline: string // one-line pitch on the selection card
}

// ---- Market analysis: 6 reasoning steps -----------------------------
export type StepKind =
  | "background"
  | "selling-points"
  | "positioning"
  | "market-competition"
  | "audience"
  | "brand"

export type AnalysisStep = {
  kind: StepKind
  index: string // 01..06
  title: string
  icon: string // phosphor icon name (resolved in component)
  // "thinking" — the blurred reasoning stream shown while the step runs
  thinking: string[]
  // "result" — the clear, structured output revealed after thinking
  result: { label: string; value: string }[]
}

// ---- Creative Brief (the consolidated output) -----------------------
export type BriefSection = {
  id: string
  title: string
  rows: { k: string; v: string }[]
}

export type AnalysisPayload = {
  steps: AnalysisStep[]
  brief: BriefSection[]
}

export type BenchmarkAccount = {
  id: string
  handle: string
  platform: "抖音" | "小红书" | "视频号"
  followers: string
  avgViews: string
  engagement: string
  niche: string
  growth: number
  matchScore: number
}

// ====================================================================
// 3 fixed selection candidates (you can replace names later).
// ====================================================================
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "紫镜猫眼穿戴甲",
    category: "美妆 / 美甲",
    price: "¥49",
    commission: "35%",
    trend: "hot",
    trendScore: 96,
    competition: "中",
    tags: ["镜面猫眼", "穿戴甲", "变装转场", "氛围感"],
    emoji: "💅",
    tagline: "黑甲到紫镜猫眼的一遮一揭变装，8.8 秒完成强视觉前后对比。",
  },
  {
    id: "p2",
    name: "便携式冷萃咖啡壶",
    category: "居家 / 厨小电",
    price: "¥168",
    commission: "28%",
    trend: "up",
    trendScore: 88,
    competition: "中",
    tags: ["咖啡", "居家好物", "懒人神器"],
    emoji: "☕️",
    tagline: "决策成本低、视觉表现力强，'打工人的第一台咖啡机'。",
  },
  {
    id: "p3",
    name: "多肽修护睡眠面膜",
    category: "美妆 / 护肤",
    price: "¥129",
    commission: "35%",
    trend: "new",
    trendScore: 85,
    competition: "高",
    tags: ["护肤", "熬夜救星", "成分党"],
    emoji: "🧴",
    tagline: "高频复购、佣金空间大，'熬夜肌'痛点内容持续跑量。",
  },
]

// ====================================================================
// Per-product analysis payloads.
// p1 is reverse-engineered from the supplied nail-art final video.
// ====================================================================
const NAIL_ANALYSIS: AnalysisPayload = {
  steps: [
    {
      kind: "background",
      index: "01",
      title: "传播背景与目标",
      icon: "Compass",
      thinking: [
        "解析成片：1080×2376 竖屏，时长约 8.8 秒……",
        "识别视觉主线：黑色长甲开场 → 遮挡转场 → 紫色镜面猫眼甲亮相",
        "提取高记忆点：双手近景、妆造同步变化、镜面反光随动作流动",
        "确认内容方向：用前后反差展示款式，不依赖长口播",
        "正在拟定短视频传播目标与执行边界……",
      ],
      result: [
        {
          label: "传播背景",
          value:
            "美甲内容天然适合手部近景与前后对比。现有成片以黑色长甲作为视觉起点，通过遮挡式变装切换到紫色镜面猫眼长甲，卖点在 1 秒内即可被看懂，适合抖音与小红书的短时长种草。",
        },
        {
          label: "传播目标",
          value:
            "短期：用 8–10 秒高完成度变装视频提高停留与完播；长期：沉淀'紫色镜面猫眼 + 氛围感变装'的款式记忆，并引导用户收藏同款。",
        },
      ],
    },
    {
      kind: "selling-points",
      index: "02",
      title: "本品主要卖点分析",
      icon: "Star",
      thinking: [
        "逐帧观察甲型：修长尖圆轮廓，十指造型统一",
        "提取颜色：低饱和紫底 + 高光镜面反射",
        "识别动态表现：抬手、翻掌、抓握动作持续展示光泽变化",
        "区分画面可证实信息与待补充产品参数",
        "正在归纳核心视觉卖点……",
      ],
      result: [
        {
          label: "核心卖点",
          value:
            "紫色镜面猫眼长甲：修长甲型拉长手部线条，镜面高光会随手势移动；黑甲到紫甲的强反差转场，让款式效果无需解释也能被快速感知。",
        },
        {
          label: "其他重要卖点",
          value:
            "① 紫色与同色系妆造呼应，适合约会、派对、拍照等氛围场景；② 十指统一的金属镜面效果，上镜辨识度高；③ 具体材质、尺寸、佩戴时长与卸除方式需补充产品资料后再宣称。",
        },
        {
          label: "核心价值关键词",
          value: "紫色镜面 · 猫眼流光 · 显手修长 · 一秒变装",
        },
      ],
    },
    {
      kind: "positioning",
      index: "03",
      title: "本品传播定位分析",
      icon: "Target",
      thinking: [
        "解构用户对美甲内容的第一眼判断……",
        "'紫镜猫眼'锚定颜色与质感，避免宽泛描述",
        "'一秒变装'对应成片的遮挡转场结构",
        "正在收敛为一句话定位……",
      ],
      result: [
        { label: "传播定位", value: "一抬手就完成氛围变装的紫镜猫眼甲" },
        {
          label: "定位拆解",
          value:
            "一抬手：对应真实手势展示；氛围变装：妆发、服装与甲色同步切换；紫镜猫眼：明确最终款式的颜色与动态光泽。",
        },
      ],
    },
    {
      kind: "market-competition",
      index: "04",
      title: "目标市场与竞品分析",
      icon: "ChartLineUp",
      thinking: [
        "圈定抖音 / 小红书'穿戴甲''猫眼美甲'内容垂类",
        "梳理用户决策要素：甲型、显白度、光泽、上手效果",
        "对比纯色、法式、碎钻与猫眼镜面款的视觉表达",
        "寻找 10 秒内能够完成的差异化内容结构……",
      ],
      result: [
        {
          label: "目标细分市场",
          value:
            "抖音 / 小红书美甲与穿戴甲垂类，聚焦偏好显手、显白、氛围感款式，并习惯通过上手视频做购买判断的年轻女性用户。",
        },
        {
          label: "主要竞品",
          value:
            "① 奶白与裸色通勤款；② 法式与碎钻精致款；③ 深色纯色酷感款；④ 紫色、银色等猫眼镜面氛围款。",
        },
        {
          label: "竞品传播侧重",
          value:
            "常见内容多为静态成品展示或贴戴教程；本片用黑甲前态、遮挡式变装和紫镜猫眼后态构成强对比，更适合以视觉反差抢占首屏注意力。",
        },
      ],
    },
    {
      kind: "audience",
      index: "05",
      title: "目标人群画像分析",
      icon: "Users",
      thinking: [
        "聚合美甲 / 穿戴甲内容的典型用户画像",
        "分析审美偏好：显手、上镜、与妆造配色统一",
        "识别决策行为：先看上手效果，再关心尺寸与佩戴信息",
        "提炼痛点：静态商品图难判断真实光泽与手部效果……",
      ],
      result: [
        {
          label: "人群基础特征",
          value:
            "18-30 岁为主的美甲兴趣用户，学生党、年轻职场人与内容创作者；重视拍照上镜、约会派对妆造与低门槛换款体验。",
        },
        {
          label: "行为偏好",
          value:
            "① 收藏显白、显手长的上手视频；② 偏好近景动态展示而非单张商品图；③ 会继续追问尺寸、甲型、佩戴与卸除细节。",
        },
        {
          label: "痛点需求",
          value:
            "担心实物色差、镜面效果不明显或甲型不适合自己，希望先看到自然光下的动态反光与完整十指上手效果。",
        },
      ],
    },
    {
      kind: "brand",
      index: "06",
      title: "品牌信息分析",
      icon: "Sparkle",
      thinking: [
        "从成片提取品牌调性：轻酷、精致、氛围感",
        "梳理必须出现的款式识别镜头",
        "区分视觉效果与尚未提供的产品性能信息",
        "正在生成内容形式与达人选择标准……",
      ],
      result: [
        { label: "品牌价值观", value: "让美甲成为妆造的一部分，用一次抬手完成整体氛围切换。" },
        { label: "品牌调性", value: "轻酷、精致、带一点未来感；画面以真实手部动态和妆造统一为主。" },
        {
          label: "必要做事项",
          value:
            "① 首屏即出现黑色长甲；② 用遮挡或扫镜完成转场；③ 后半段至少一次双手正面展示与一次动态翻转，让紫色镜面高光可见。",
        },
        {
          label: "不可做事项",
          value:
            "① 未提供产品资料前，不宣称持久天数、无损卸除、可重复佩戴或具体材质；② 不用重滤镜改变甲色；③ 不只拍脸而弱化手部与甲面。",
        },
      ],
    },
  ],
  brief: [
    {
      id: "overview",
      title: "创意简报",
      rows: [
        { k: "品牌名称", v: "待补充（当前以款式视觉为核心）" },
        { k: "产品名称", v: "紫镜猫眼穿戴甲" },
        { k: "推广时间", v: "全年可投，优先覆盖约会、派对、节日与换季妆造节点" },
        { k: "推广平台", v: "抖音 + 小红书（短视频上手展示）" },
      ],
    },
    {
      id: "positioning",
      title: "核心定位",
      rows: [
        { k: "传播定位", v: "一抬手就完成氛围变装的紫镜猫眼甲" },
        { k: "核心价值", v: "紫色镜面 · 猫眼流光 · 显手修长 · 一秒变装" },
        { k: "核心卖点", v: "黑甲到紫镜猫眼强反差，动态高光随手势流动" },
      ],
    },
    {
      id: "audience",
      title: "目标人群",
      rows: [
        { k: "核心人群", v: "18-30 岁美甲兴趣用户、学生党、年轻职场人与内容创作者" },
        { k: "行为偏好", v: "先看动态上手与显手效果，再关注尺寸、佩戴和卸除信息" },
        { k: "痛点", v: "静态商品图难判断真实甲色、镜面光泽与甲型适配" },
      ],
    },
    {
      id: "guardrails",
      title: "执行边界",
      rows: [
        { k: "必要做", v: "黑甲前态 + 遮挡转场 + 紫镜猫眼双手动态展示" },
        { k: "不可做", v: "不虚构材质、持久度与卸除效果，不用重滤镜改变甲色" },
        { k: "达人标准", v: "手部表现力强、擅长变装转场的美甲 / 穿搭 / 妆容创作者" },
      ],
    },
  ],
}

const COFFEE_CLEAN: AnalysisPayload = {
  steps: [
    {
      kind: "background",
      index: "01",
      title: "传播背景与目标",
      icon: "Compass",
      thinking: [
        "检索抖音'冷萃咖啡''居家咖啡'搜索趋势……",
        "'打工人咖啡'内容近 30 天播放 +58%",
        "对标便利店咖啡客单价 25-35 元，自制约 3 元/杯",
        "确认'省时省钱'情绪共鸣点，拟定传播目标……",
      ],
      result: [
        { label: "传播背景", value: "居家咖啡内容持续走热，'打工人咖啡'赛道播放月增 58%；便利店单杯 25-35 元 vs 自制 3 元/杯，价格反差强烈。" },
        { label: "传播目标", value: "短期：1 个月抖音播放 300万+，挂车转化 8000+ 单；长期：建立'打工人第一台咖啡机'心智。" },
      ],
    },
    {
      kind: "selling-points",
      index: "02",
      title: "本品主要卖点分析",
      icon: "Star",
      thinking: ["解析产品：免电、免滤纸、冷萃 12 小时", "测算单壶成本与回本周期", "梳理视觉表现点：浓郁色泽 + 加冰加奶", "归纳核心价值关键词……"],
      result: [
        { label: "核心卖点", value: "不用电、不用滤纸，倒进去等 12 小时；一壶够喝 4 天，单杯不到 3 元，一个月回本。" },
        { label: "其他重要卖点", value: "① 操作零门槛，睡前操作早上喝；② 兼容冰拿铁、特调等多种喝法。" },
        { label: "核心价值关键词", value: "省钱 · 省时 · 居家仪式感 · 打工人救星" },
      ],
    },
    {
      kind: "positioning",
      index: "03",
      title: "本品传播定位分析",
      icon: "Target",
      thinking: ["锚定'打工人'人群心智", "'省下一年 8000 块'量化利益点", "收敛为一句话定位……"],
      result: [
        { label: "传播定位", value: "打工人的第一台咖啡机" },
        { label: "定位拆解", value: "打工人：精准人群；第一台：低决策门槛；咖啡机：仪式感升级而非'器具'。" },
      ],
    },
    {
      kind: "market-competition",
      index: "04",
      title: "目标市场与竞品分析",
      icon: "ChartLineUp",
      thinking: ["圈定抖音'咖啡器具''居家好物'垂类", "抓取竞品：意式咖啡机、挂耳、冻干粉", "对比决策成本与使用门槛……"],
      result: [
        { label: "目标细分市场", value: "抖音'咖啡器具''居家好物'垂类，22-32 岁城市职场人群。" },
        { label: "主要竞品", value: "① 意式咖啡机（高客单、高门槛）；② 挂耳/冻干粉（低价但无仪式感）。" },
        { label: "竞品传播侧重", value: "意式机强调'专业'，挂耳强调'便捷'，均未占领'省时省钱'的情绪位。" },
      ],
    },
    {
      kind: "audience",
      index: "05",
      title: "目标人群画像分析",
      icon: "Users",
      thinking: ["聚合抖音该垂类用户画像", "22-32 岁、一二线城市、咖啡高频", "分析行为偏好与痛点……"],
      result: [
        { label: "人群基础特征", value: "22-32 岁，一二线城市，互联网/金融/创意行业职场人，日均 1-2 杯咖啡。" },
        { label: "行为偏好", value: "关注'居家好物''省钱攻略'，易被'算账式'内容打动（单杯成本对比）。" },
        { label: "痛点需求", value: "依赖咖啡但外卖/便利店太贵，想自己搞又嫌意式机贵且麻烦。" },
      ],
    },
    {
      kind: "brand",
      index: "06",
      title: "品牌信息分析",
      icon: "Sparkle",
      thinking: ["提取品牌调性：实用、清爽、亲切", "梳理必要做 / 不可做事项……"],
      result: [
        { label: "品牌调性", value: "实用、清爽、亲切，'像同事推荐'的口吻。" },
        { label: "必要做事项", value: "① 用'算账'强化利益点；② 演示加冰加奶的真实画面；③ 强调'睡前操作'省时。" },
        { label: "不可做事项", value: "不贬低连锁咖啡品牌；不夸大'健康功效'。" },
      ],
    },
  ],
  brief: [
    { id: "overview", title: "创意简报", rows: [
      { k: "产品名称", v: "便携式冷萃咖啡壶" },
      { k: "推广时间", v: "11 月–次年 1 月（居家 + 送礼双场景）" },
      { k: "推广平台", v: "抖音（挂车短视频为主）" },
    ]},
    { id: "positioning", title: "核心定位", rows: [
      { k: "传播定位", v: "打工人的第一台咖啡机" },
      { k: "核心价值", v: "省钱 · 省时 · 居家仪式感" },
      { k: "核心卖点", v: "单杯不到 3 元，一个月回本" },
    ]},
    { id: "audience", title: "目标人群", rows: [
      { k: "核心人群", v: "22-32 岁一二线城市咖啡高频职场人" },
      { k: "行为偏好", v: "易被'算账式'省钱内容打动" },
      { k: "痛点", v: "依赖咖啡但外卖太贵，想自己搞又嫌意式机贵且麻烦" },
    ]},
    { id: "guardrails", title: "执行边界", rows: [
      { k: "必要做", v: "算账 + 真实演示 + '睡前操作'省时点" },
      { k: "不可做", v: "不贬低连锁品牌、不夸大健康功效" },
      { k: "达人标准", v: "职场/家居/省钱类垂类，粉丝 10w-100w" },
    ]},
  ],
}

const MASK_ANALYSIS: AnalysisPayload = {
  steps: [
    {
      kind: "background",
      index: "01",
      title: "传播背景与目标",
      icon: "Compass",
      thinking: ["检索小红书'熬夜肌''睡眠面膜'趋势", "'熬夜不垮脸'内容互动率持续走高", "确认高频复购品类机会……"],
      result: [
        { label: "传播背景", value: "'熬夜肌'内容在小红书互动率持续走高，睡眠面膜作为免洗品类契合'懒人护肤'需求，复购率高。" },
        { label: "传播目标", value: "短期：1 个月小红书曝光 200万+，加购 6000+；长期：建立'熬夜党救星'心智，沉淀复购。" },
      ],
    },
    {
      kind: "selling-points",
      index: "02",
      title: "本品主要卖点分析",
      icon: "Star",
      thinking: ["解析成分：多肽复合物", "提炼'提亮+紧致+补水'三合一", "归纳核心价值关键词……"],
      result: [
        { label: "核心卖点", value: "多肽复合物，提亮、紧致、补水一次到位；睡前抹一层免洗，懒人友好。" },
        { label: "其他重要卖点", value: "① 质地清爽不黏枕；② 连续使用法令纹区域明显嘭起。" },
        { label: "核心价值关键词", value: "熬夜救星 · 多肽修护 · 免洗懒人 · 成分党" },
      ],
    },
    {
      kind: "positioning",
      index: "03",
      title: "本品传播定位分析",
      icon: "Target",
      thinking: ["锚定'熬夜党'人群", "收敛为一句话定位……"],
      result: [
        { label: "传播定位", value: "熬夜党的'急救舱'" },
        { label: "定位拆解", value: "熬夜党：精准人群；急救舱：快速见效 + 免洗省事的心理预期。" },
      ],
    },
    {
      kind: "market-competition",
      index: "04",
      title: "目标市场与竞品分析",
      icon: "ChartLineUp",
      thinking: ["圈定小红书'护肤''成分党'垂类", "抓取竞品：贵妇面霜、贴片面膜", "对比价格与使用门槛……"],
      result: [
        { label: "目标细分市场", value: "小红书'护肤''成分党'垂类，25-35 岁关注功效与性价比的女性。" },
        { label: "主要竞品", value: "① 贵妇面霜（高客单）；② 贴片面膜（仪式感强但繁琐）。" },
        { label: "竞品传播侧重", value: "贵妇霜强调'奢宠'，贴片强调'密集护理'，均未占领'免洗急救'位。" },
      ],
    },
    {
      kind: "audience",
      index: "05",
      title: "目标人群画像分析",
      icon: "Users",
      thinking: ["聚合小红书护肤用户画像", "25-35 岁、熬夜高频、追求性价比", "分析痛点……"],
      result: [
        { label: "人群基础特征", value: "25-35 岁，一二线城市，互联网/媒体/创意行业，熬夜高频。" },
        { label: "行为偏好", value: "关注'成分党''平价替代'，信任素人真实测评与'空瓶记'。" },
        { label: "痛点需求", value: "熬夜后脸垮、暗沉，想要'第二天被夸皮肤好'的快速急救方案。" },
      ],
    },
    {
      kind: "brand",
      index: "06",
      title: "品牌信息分析",
      icon: "Sparkle",
      thinking: ["提取品牌调性：专业、亲切、真实", "梳理必要做 / 不可做事项……"],
      result: [
        { label: "品牌调性", value: "专业、亲切、真实，'像懂行的闺蜜'。" },
        { label: "必要做事项", value: "① 成分前置（多肽）；② 展示'第二天对比'；③ 用'空瓶'建立信任。" },
        { label: "不可做事项", value: "不宣称医疗功效；不拉踩具体品牌。" },
      ],
    },
  ],
  brief: [
    { id: "overview", title: "创意简报", rows: [
      { k: "产品名称", v: "多肽修护睡眠面膜" },
      { k: "推广时间", v: "全年可推，'熬夜季'（大促/换季）加码" },
      { k: "推广平台", v: "小红书（成分种草为主）" },
    ]},
    { id: "positioning", title: "核心定位", rows: [
      { k: "传播定位", v: "熬夜党的'急救舱'" },
      { k: "核心价值", v: "熬夜救星 · 多肽修护 · 免洗懒人" },
      { k: "核心卖点", v: "提亮+紧致+补水一次到位，免洗省事" },
    ]},
    { id: "audience", title: "目标人群", rows: [
      { k: "核心人群", v: "25-35 岁一二线城市熬夜高频女性" },
      { k: "行为偏好", v: "信任成分党素人测评与'空瓶记'" },
      { k: "痛点", v: "熬夜后脸垮暗沉，想要快速急救" },
    ]},
    { id: "guardrails", title: "执行边界", rows: [
      { k: "必要做", v: "成分前置 + 第二天对比 + 空瓶信任" },
      { k: "不可做", v: "不宣称医疗功效、不拉踩具体品牌" },
      { k: "达人标准", v: "护肤/成分党垂类素人为主，互动率 >6%" },
    ]},
  ],
}

const PAYLOADS: Record<string, AnalysisPayload> = {
  p1: NAIL_ANALYSIS,
  p2: COFFEE_CLEAN,
  p3: MASK_ANALYSIS,
}

export function analysisFor(productId: string): AnalysisPayload {
  return PAYLOADS[productId] ?? NAIL_ANALYSIS
}

// ====================================================================
// 选题 · 二创 stage
// Flow mirrors xiaomang2 (api/_lib/contentAgent): the system retrieves
// benchmark accounts → lists benchmark videos → user picks → per video
// resolve → transcribe → 4 parallel creative agents → funnel selection.
// ====================================================================

export type BenchmarkVideo = {
  id: string
  title: string
  author: string
  platform: "抖音" | "小红书" | "视频号"
  duration: string
  views: string
  likes: string
  comments: string
  hotScore: number // 0-100
  age: string
  reason: string // why this is a good benchmark
}

// Stage A: retrieve benchmark accounts + videos (auto-run, streamed)
export type RetrievalStep = {
  index: string
  title: string
  icon: string
  thinking: string[]
  result: { label: string; value: string }[]
}

export type RetrievalPayload = {
  accounts: BenchmarkAccount[]
  videos: BenchmarkVideo[]
  steps: RetrievalStep[]
}

// Stage B: per selected video, the SSE pipeline (resolve → transcribe → 4 agents)
export type PipelineSubStep = {
  id: string // e.g. "resolve-video"
  label: string
  detail: string
  thinking: string[]
}

export type CreativeAgent = {
  id: "opening-hook" | "ending-hook" | "title" | "script"
  name: string
  desc: string
  thinking: string[]
}

export type PipelinePayload = {
  subSteps: PipelineSubStep[] // resolve-video, transcribe-video, transcript-ready
  agents: CreativeAgent[] // the 4 parallel agents
  // final outputs (the funnel)
  output: {
    openingHooks: string[]
    endingHooks: string[]
    titles: { text: string; type: string }[]
    script: string // 二创文案 body
    hashtags: string[]
  }
}

export function retrievalFor(productId: string): RetrievalPayload {
  const accountMap: Record<string, BenchmarkAccount[]> = {
    p1: [
      { id: "r1", handle: "@甲面观察所", platform: "小红书", followers: "86.4万", avgViews: "18万", engagement: "12.4%", niche: "穿戴甲 · 上手实拍", growth: 24.1, matchScore: 97 },
      { id: "r2", handle: "@氛围感变装局", platform: "抖音", followers: "132万", avgViews: "68万", engagement: "9.8%", niche: "美甲 · 妆造变装", growth: 18.6, matchScore: 94 },
      { id: "r3", handle: "@猫眼美甲档案", platform: "小红书", followers: "64.8万", avgViews: "21万", engagement: "11.1%", niche: "猫眼款式 · 显手测评", growth: 20.3, matchScore: 92 },
    ],
    p2: [
      { id: "r1", handle: "@咖啡研究所", platform: "抖音", followers: "182万", avgViews: "94万", engagement: "8.2%", niche: "咖啡器具测评", growth: 14.5, matchScore: 96 },
      { id: "r2", handle: "@打工人的早晨", platform: "小红书", followers: "54.3万", avgViews: "18万", engagement: "11.2%", niche: "职场生活 · 省钱", growth: 21.7, matchScore: 92 },
      { id: "r3", handle: "@居家咖啡局", platform: "抖音", followers: "98.6万", avgViews: "41万", engagement: "9.0%", niche: "居家饮品", growth: 16.4, matchScore: 88 },
    ],
    p3: [
      { id: "r1", handle: "@护肤实验室", platform: "抖音", followers: "410万", avgViews: "150万", engagement: "6.4%", niche: "成分党护肤", growth: 9.8, matchScore: 95 },
      { id: "r2", handle: "@熬夜肌自救指南", platform: "小红书", followers: "73.1万", avgViews: "22万", engagement: "12.9%", niche: "熬夜护肤 · 空瓶记", growth: 26.5, matchScore: 94 },
      { id: "r3", handle: "@成分党小课堂", platform: "小红书", followers: "118万", avgViews: "34万", engagement: "10.1%", niche: "护肤成分科普", growth: 15.2, matchScore: 86 },
    ],
  }
  const videoMap: Record<string, BenchmarkVideo[]> = {
    p1: [
      { id: "rv1", title: "手一抬，黑甲直接变紫镜猫眼", author: "@氛围感变装局", platform: "抖音", duration: "0:09", views: "326万", likes: "28.4万", comments: "6800+", hotScore: 98, age: "3天前", reason: "首屏黑甲与后半段紫色镜面甲反差明确，遮挡转场紧凑，适合复刻成 9 秒成片。" },
      { id: "rv2", title: "紫色猫眼到底有多显手？看动态高光", author: "@甲面观察所", platform: "小红书", duration: "0:12", views: "118万", likes: "11.7万", comments: "3500+", hotScore: 95, age: "5天前", reason: "双手近景与翻转动作完整展示镜面流光，直接回应用户对真实上手效果的判断需求。" },
      { id: "rv3", title: "妆造变了，美甲才是最后一块拼图", author: "@猫眼美甲档案", platform: "小红书", duration: "0:15", views: "86万", likes: "8.2万", comments: "2400+", hotScore: 92, age: "7天前", reason: "将美甲与发型、服装同色系联动，强化'整体氛围变装'定位。" },
      { id: "rv4", title: "不加滤镜拍一次紫镜猫眼", author: "@甲面观察所", platform: "小红书", duration: "0:18", views: "74万", likes: "6.9万", comments: "2900+", hotScore: 90, age: "9天前", reason: "自然光近景降低色差顾虑，评论区可承接尺寸、甲型与佩戴信息。" },
    ],
    p2: [
      { id: "rv1", title: "一年省下8000块｜打工人的第一台咖啡机", author: "@咖啡研究所", platform: "抖音", duration: "0:48", views: "312万", likes: "24.1万", comments: "6800+", hotScore: 97, age: "6天前", reason: "'省8000块'量化利益点，'打工人'精准人群，爆款结构完整。" },
      { id: "rv2", title: "便利店一杯28，我教你3块搞定同款", author: "@打工人的早晨", platform: "小红书", duration: "0:35", views: "94万", likes: "8.7万", comments: "2400+", hotScore: 92, age: "7天前", reason: "价格对比钩子强烈，评论区高频问购买，转化潜力高。" },
      { id: "rv3", title: "用了它之后我再没点过外卖咖啡", author: "@居家咖啡局", platform: "抖音", duration: "0:52", views: "156万", likes: "12.3万", comments: "3100+", hotScore: 90, age: "9天前", reason: "'再没点过'反差表态，情绪共鸣强，适合二创改写。" },
    ],
    p3: [
      { id: "rv1", title: "熬夜3天脸没垮，全靠这一罐", author: "@护肤实验室", platform: "抖音", duration: "0:46", views: "540万", likes: "41.2万", comments: "9200+", hotScore: 98, age: "9天前", reason: "播放量最高，'熬夜不垮脸'痛点钩子经典，结构成熟易拆解。" },
      { id: "rv2", title: "空了4罐的面膜｜熬夜脸真的稳了", author: "@熬夜肌自救指南", platform: "小红书", duration: "0:50", views: "112万", likes: "13.8万", comments: "3600+", hotScore: 95, age: "5天前", reason: "'空4罐'信任背书 + '稳了'情绪，互动率 12.9%，种草力强。" },
      { id: "rv3", title: "成分党亲测｜这罐比贵妇霜还顶", author: "@成分党小课堂", platform: "小红书", duration: "0:58", views: "78万", likes: "6.4万", comments: "2200+", hotScore: 89, age: "12天前", reason: "'比贵妇霜还顶'对比钩子，成分党人设契合度高。" },
    ],
  }

  const steps: RetrievalStep[] = [
    {
      index: "01",
      title: "解析市场简报，提取检索关键词",
      icon: "FileText",
      thinking: [
        `读取《${productName(productId)}》市场简报……`,
        "提取传播定位、核心人群、核心卖点",
        "生成检索关键词矩阵：场景词 + 人群词 + 卖点词",
        "确认平台：抖音 + 小红书（变装传播与款式种草）",
      ],
      result: [
        { label: "检索关键词", value: "紫色猫眼 · 镜面美甲 · 穿戴甲 · 显手长 · 遮挡变装" },
        { label: "目标平台", value: "抖音（变装扩散）+ 小红书（款式搜索与收藏）" },
        { label: "达人筛选标准", value: "手部表现力强；美甲 / 穿搭 / 妆容垂类；能拍清动态甲面高光" },
      ],
    },
    {
      index: "02",
      title: "全网检索对标账号",
      icon: "MagnifyingGlass",
      thinking: [
        "调用小红书 / 抖音达人搜索接口……",
        "按 niche 匹配度 + 涨粉势能 + 互动质量排序",
        "过滤低质账号（刷量/人设不符）……",
        "锁定 Top 3 对标账号",
      ],
      result: [
        { label: "匹配账号数", value: "128 个候选 → 锁定 3 个最佳对标" },
        { label: "排序维度", value: "内容匹配度 · 近 30 天涨粉 · 平均互动率" },
      ],
    },
    {
      index: "03",
      title: "抓取对标账号近期爆款作品",
      icon: "VideoCamera",
      thinking: [
        "抓取每个对标账号近 30 天作品……",
        "按播放 / 点赞 / 评论 / 收藏加权计算热度分",
        "结合 Brief 匹配度二次筛选……",
        "输出今日选题清单",
      ],
      result: [
        { label: "采集作品数", value: "92 条 → 筛出 4 条高潜对标视频" },
        { label: "筛选依据", value: "热度分 > 85 且内容契合 Brief 定位" },
      ],
    },
  ]

  return {
    accounts: accountMap[productId] ?? accountMap.p1,
    videos: videoMap[productId] ?? videoMap.p1,
    steps,
  }
}

function productName(id: string): string {
  return PRODUCTS.find((p) => p.id === id)?.name ?? "推广产品"
}

export function pipelineFor(productId: string): PipelinePayload {
  const base: Record<string, PipelinePayload> = {
    p1: {
      subSteps: [
        {
          id: "resolve-video",
          label: "解析对标视频链接",
          detail: "已获取视频信息：手一抬，黑甲直接变紫镜猫眼",
          thinking: ["解析抖音分享链接……", "提取竖屏视频媒体地址与关键帧", "校验可播放性 ✓"],
        },
        {
          id: "transcribe-video",
          label: "提取音频并转写口播",
          detail: "素材以变装画面为主，同步执行音轨提取与画面语义分析",
          thinking: ["ffmpeg-static 提取音轨并保留原始声音", "同步分析转场节拍与关键帧动作", "逐帧识别：黑甲前态 → 遮挡转场 → 紫镜猫眼后态"],
        },
        {
          id: "transcript-ready",
          label: "画面脚本解析完成",
          detail: "已生成动作与转场脚本，准备喂给创作 Agent",
          thinking: ["整理 8.8 秒时间轴与关键手势", "构建创作输入：标题 + 关键帧 + 动作脚本", "准备并行调度 4 个创作 Agent"],
        },
      ],
      agents: [
        {
          id: "opening-hook",
          name: "开头钩子",
          desc: "提取原文开场 + 二创 3 秒留存开头",
          thinking: ["分析首屏：人物正面 + 黑色长甲", "提取核心冲突：当前黑甲与目标紫镜甲的视觉反差", "二创生成：动作型 / 悬念型 / 款式型", "输出 3 条开头钩子候选"],
        },
        {
          id: "ending-hook",
          name: "结尾钩子",
          desc: "提取 CTA + 二创引导文案",
          thinking: ["定位结尾动作：双手近景展示紫色镜面高光", "设计低干扰 CTA：收藏同款 / 评论选色", "避免文字遮挡甲面", "输出 3 条结尾引导候选"],
        },
        {
          id: "title",
          name: "标题",
          desc: "生成 10 个爆款标题（含类型/技巧标注）",
          thinking: ["分析主题：黑甲到紫镜猫眼的一秒变装", "运用反差 / 动作 / 款式关键词", "前置'紫色猫眼''显手''变装'", "输出 10 条标题（≤27 字）"],
        },
        {
          id: "script",
          name: "二创文案",
          desc: "改写口播文案 + 抽取 SEO 标签",
          thinking: ["理解无口播的动作叙事", "按 8.8 秒重写画面脚本", "保留遮挡转场与双手展示", "抽取 5 个 SEO 关键词生成 #标签"],
        },
      ],
      output: {
        openingHooks: [
          "先别眨眼，黑甲下一秒直接换色。",
          "紫色猫眼上手，到底能有多显手？",
          "妆造还差最后一步——看我的手。",
        ],
        endingHooks: [
          "这个紫镜猫眼你会收藏吗？",
          "想看自然光近拍，评论区告诉我。",
          "黑色和紫色二选一，你站哪边？",
        ],
        titles: [
          { text: "手一抬，黑甲直接变紫镜猫眼", type: "动作反差型" },
          { text: "紫色猫眼到底有多显手？看动态高光", type: "效果验证型" },
          { text: "这副紫镜甲，把整套妆造补完整了", type: "氛围代入型" },
          { text: "别眨眼｜8秒完成一次美甲变装", type: "数字悬念型" },
          { text: "黑甲和紫镜猫眼，你会选哪一副？", type: "互动选择型" },
        ],
        script:
          "0–2 秒：人物正面入镜，抬手依次展示黑色长甲，用食指与双手动作建立节奏。\n\n2–4 秒：双手朝镜头靠近并完成遮挡，手掌扫过画面作为转场切点。\n\n4–6 秒：妆发与紫色造型同步切换，人物重新入镜，先以单手动作承接转场。\n\n6–8.8 秒：双手靠近镜头，翻掌、张合与交替前伸，完整展示紫色镜面猫眼甲的动态高光；笑容定格收尾。",
        hashtags: ["#紫色猫眼", "#镜面美甲", "#穿戴甲", "#美甲变装", "#显手美甲"],
      },
    },
    p2: {
      subSteps: [
        {
          id: "resolve-video",
          label: "解析对标视频链接",
          detail: "已获取视频信息：一年省下8000块｜打工人的第一台咖啡机",
          thinking: ["解析抖音分享链接……", "提取 awemeId 与视频地址", "校验可播放性 ✓"],
        },
        {
          id: "transcribe-video",
          label: "提取音频并转写口播",
          detail: "命中转写方案：tikhub-ffmpeg + 豆包 ASR",
          thinking: ["TikHub 提取 WAV 音频流", "调用豆包 ASR 转写口播……", "ASR 返回，时长 48s，置信度 0.97"],
        },
        {
          id: "transcript-ready",
          label: "口播转写完成",
          detail: "已生成原始文案，准备喂给创作 Agent",
          thinking: ["整理转写文本", "构建创作输入：原标题+链接+转写文案", "准备并行调度 4 个 DeepSeek 创作 Agent"],
        },
      ],
      agents: [
        {
          id: "opening-hook",
          name: "开头钩子",
          desc: "提取原文开场 + 二创 3 秒留存开头",
          thinking: ["分析原文开场：'一年省下8000块'", "提取核心利益点：省钱量化", "二创生成算账型/反差型/人群型", "输出 3 条开头钩子候选"],
        },
        {
          id: "ending-hook",
          name: "结尾钩子",
          desc: "提取 CTA + 二创引导文案",
          thinking: ["定位结尾 CTA：'点下方'", "二创引导：挂车/加购/回购", "输出 3 条结尾引导候选"],
        },
        {
          id: "title",
          name: "标题",
          desc: "生成 10 个爆款标题（含类型/技巧标注）",
          thinking: ["分析主题：省钱+居家咖啡", "运用数字/矛盾/代入等技巧", "前置利益点 + 痛点字词", "输出 10 条标题"],
        },
        {
          id: "script",
          name: "二创文案",
          desc: "改写口播文案 + 抽取 SEO 标签",
          thinking: ["理解原文'算账'结构", "口语化改写，相似度<50%", "保留省钱共鸣与回购点", "抽取 5 个 SEO 关键词"],
        },
      ],
      output: {
        openingHooks: [
          "便利店一杯28，我教你3块搞定同款。",
          "算完这笔账，我把外卖咖啡全删了。",
          "打工人的命是咖啡给的，但钱包不该被它掏空。",
        ],
        endingHooks: [
          "点下方，一杯不到3块，一个月就回本。",
          "挂车了，打工人闭眼冲，回购率超高。",
          "关注我，教你把咖啡自由搬回家。",
        ],
        titles: [
          { text: "一年省下8000块的方法，藏在你每天早上的咖啡里", type: "数字型" },
          { text: "便利店一杯28，我教你3块搞定同款", type: "矛盾冲突型" },
          { text: "用了它之后我再没点过外卖咖啡", type: "代入感型" },
          { text: "打工人的第一台咖啡机，一个月回本", type: "画龙点睛型" },
          { text: "咖啡自由｜一杯不到3块的居家冷萃秘籍", type: "抱大腿型" },
        ],
        script:
          "算一笔账：你每天一杯外卖咖啡，28块，一年就是一万多。这笔钱，够你买十台咖啡机了。\n\n但这台不一样。它不用电、不用滤纸，晚上倒进去，早上起来就是一杯浓郁的冷萃。\n\n你看这个颜色，加冰加奶，就是便利店28块的冰拿铁。一壶够喝4天，算下来一杯不到3块。一个月，本就回来了。\n\n我用了一个月，再没点过外卖咖啡。打工人想喝好咖啡又不想花钱的，这一台真的够了。",
        hashtags: ["#打工人咖啡", "#居家咖啡", "#省钱神器", "#冷萃咖啡", "#咖啡自由"],
      },
    },
    p3: {
      subSteps: [
        {
          id: "resolve-video",
          label: "解析对标视频链接",
          detail: "已获取视频信息：熬夜3天脸没垮，全靠这一罐",
          thinking: ["解析抖音分享链接……", "提取 awemeId 与视频地址", "校验可播放性 ✓"],
        },
        {
          id: "transcribe-video",
          label: "提取音频并转写口播",
          detail: "命中转写方案：ffmpeg + 豆包 ASR",
          thinking: ["ffmpeg-static 提取音频 → base64", "调用豆包 ASR 转写口播……", "ASR 返回，时长 46s，置信度 0.95"],
        },
        {
          id: "transcript-ready",
          label: "口播转写完成",
          detail: "已生成原始文案，准备喂给创作 Agent",
          thinking: ["整理转写文本", "构建创作输入：原标题+链接+转写文案", "准备并行调度 4 个 DeepSeek 创作 Agent"],
        },
      ],
      agents: [
        {
          id: "opening-hook",
          name: "开头钩子",
          desc: "提取原文开场 + 二创 3 秒留存开头",
          thinking: ["分析原文开场：'熬夜3天脸没垮'", "提取核心痛点：熬夜垮脸", "二创生成反差型/痛点型/共鸣型", "输出 3 条开头钩子候选"],
        },
        {
          id: "ending-hook",
          name: "结尾钩子",
          desc: "提取 CTA + 二创引导文案",
          thinking: ["定位结尾 CTA", "二创引导：加购/关注/加群", "输出 3 条结尾引导候选"],
        },
        {
          id: "title",
          name: "标题",
          desc: "生成 10 个爆款标题（含类型/技巧标注）",
          thinking: ["分析主题：熬夜护肤急救", "运用悬念/反差/人性弱点等技巧", "前置痛点 + 解决方案", "输出 10 条标题"],
        },
        {
          id: "script",
          name: "二创文案",
          desc: "改写口播文案 + 抽取 SEO 标签",
          thinking: ["理解原文'急救'结构", "口语化改写，相似度<50%", "保留熬夜共鸣与成分背书", "抽取 5 个 SEO 关键词"],
        },
      ],
      output: {
        openingHooks: [
          "熬夜3天脸没垮，我只做了这一件事。",
          "被同事夸皮肤好的那个早上，我全靠这罐续命。",
          "医美太贵？这罐让我省下了三次光子的钱。",
        ],
        endingHooks: [
          "熬夜党闭眼冲，链接在下方，今晚就安排。",
          "点关注，教你把熬夜脸救回来。",
          "评论区扣1，我教你叠涂不搓泥。",
        ],
        titles: [
          { text: "熬夜3天脸没垮，全靠这一罐", type: "代入感型" },
          { text: "成分党亲测｜这罐比贵妇霜还顶", type: "矛盾冲突型" },
          { text: "空了4罐的面膜｜熬夜脸真的稳了", type: "数字型" },
          { text: "医美太贵？这罐救回了我的熬夜脸", type: "悬念猎奇型" },
          { text: "熬夜党必囤｜一觉醒来被夸皮肤好", type: "画龙点睛型" },
        ],
        script:
          "说实话，我上周连续熬了三个大夜，本来以为脸会垮成灾难。结果第二天被同事追着问：你最近做了什么医美？\n\n真没有。全靠这罐多肽睡眠面膜。它牛在哪？成分党看过来——核心是多肽复合物，提亮、紧致、补水，一次到位。睡前抹一层，不用洗，直接睡。\n\n我连续空了四罐。最明显的是法令纹那块，真的嘭起来了，像被人从里面托住一样。\n\n如果你也是熬夜党，又不想花大钱做医美，这罐真的闭眼冲。今晚有35%佣金，链接在下方。",
        hashtags: ["#熬夜救星", "#睡眠面膜", "#成分党护肤", "#熬夜不垮脸", "#多肽面膜"],
      },
    },
  }
  return base[productId] ?? base.p1
}

// Legacy export kept for type compatibility (no longer used by UI)
export type Remake = {
  hook3s: string
  titles: string[]
  script: { time: string; text: string; beat: string }[]
  hashtags: string[]
}

// ====================================================================
// 视频生成 stage
// The "performance" is reverse-engineered FROM the actual videos:
// the system appears to generate storyboards / shot descriptions whose
// visual content matches what the provided mp4 actually shows.
// No voiceover / subtitle nodes (videos may have neither).
// ====================================================================

export type Shot = {
  index: number
  timecode: string
  scene: string // 场景描述 (matches what the video shows)
  shot: string // 景别/运镜
  duration: string
}

export type VideoGenStep = {
  index: string
  title: string
  icon: string
  thinking: string[]
  result: { label: string; value: string }[]
}

export type VideoStyle = {
  tone: string // 色调
  pacing: string // 节奏
  lighting: string // 光影
  composition: string // 构图
}

export type VideoGenPayload = {
  hasVideo: boolean
  videoSrc?: string
  poster?: string
  duration: string
  ratio: string // 竖屏 9:16 等
  steps: VideoGenStep[]
  shots: Shot[]
  style: VideoStyle
  music: string
}

export function videoGenFor(productId: string): VideoGenPayload {
  const map: Record<string, VideoGenPayload> = {
    p1: {
      hasVideo: true,
      videoSrc: "/videos/nail-art.mp4",
      duration: "0:08.8",
      ratio: "5:11 竖屏",
      steps: [
        {
          index: "01",
          title: "二创文案 → 分镜拆解",
          icon: "ListChecks",
          thinking: [
            "读取二创动作脚本，提取视觉叙事……",
            "划分情绪段落：黑甲前态 → 双手遮挡 → 妆造切换 → 紫甲展示",
            "匹配镜头数：8.8 秒成片 → 5 个动作段落",
            "以遮挡峰值作为变装切点，标注每段手势节奏",
          ],
          result: [
            { label: "成片时长", value: "8.8 秒" },
            { label: "分镜数", value: "5 个动作段落，单机位完成" },
            { label: "叙事结构", value: "黑色长甲亮相 → 双手遮挡 → 妆造变装 → 紫镜猫眼双手展示" },
          ],
        },
        {
          index: "02",
          title: "画面风格设定",
          icon: "PaintBrush",
          thinking: [
            "解析 Brief 调性：轻酷、精致、氛围感",
            "前态保留黑甲与白色背心的高对比",
            "后态统一紫色妆造与镜面猫眼甲",
            "构图原则：人物居中，双手持续进入面部前景",
          ],
          result: [
            { label: "色调", value: "中性自然肤色 → 紫灰氛围妆造" },
            { label: "光影", value: "室内正面柔光，甲面镜面高光清晰" },
            { label: "构图", value: "人物正面居中 + 双手近镜前景" },
          ],
        },
        {
          index: "03",
          title: "逐镜头生成",
          icon: "VideoCamera",
          thinking: [
            "段落 1：食指起势，黑色长甲进入前景……",
            "段落 2：双手张开展示十指黑甲……",
            "段落 3：手掌靠近镜头并完成遮挡转场……",
            "段落 4：紫色妆造切入，单手扫镜承接动作……",
            "段落 5：双手展示紫镜猫眼高光并定格……",
          ],
          result: [
            { label: "段落 1", value: "食指节奏起势 + 黑甲近景，0–1.6s" },
            { label: "段落 2", value: "双手正反展示黑色长甲，1.6–3.3s" },
            { label: "段落 3", value: "双掌靠近镜头完成遮挡切点，3.3–4.3s" },
            { label: "段落 4", value: "紫色妆造亮相并以单手扫镜承接，4.3–5.6s" },
            { label: "段落 5", value: "双手动态展示紫镜猫眼，5.6–8.8s" },
          ],
        },
        {
          index: "04",
          title: "成片合成",
          icon: "FilmStrip",
          thinking: [
            "在双手完全遮挡画面时执行无缝变装切换……",
            "匹配原始节奏型 BGM，在遮挡与亮甲动作处卡点",
            "保留原始竖屏比例，输出 1080×2376",
            "成片合成完成 ✓",
          ],
          result: [
            { label: "分辨率", value: "1080 × 2376（竖屏约 5:11）" },
            { label: "配乐", value: "原始节奏型变装 BGM，遮挡处卡点" },
            { label: "成片时长", value: "8.8 秒，单机位 + 1 次遮挡变装" },
          ],
        },
      ],
      shots: [
        { index: 1, timecode: "0:00–0:01.6", scene: "人物正面居中，食指依次起势，黑色长甲进入画面前景", shot: "中近景 / 固定", duration: "1.6s" },
        { index: 2, timecode: "0:01.6–0:03.3", scene: "双手抬至脸前，先展示甲面再翻掌，完整交代黑甲前态", shot: "手部近景 / 固定", duration: "1.7s" },
        { index: 3, timecode: "0:03.3–0:04.3", scene: "双手向镜头合拢并扫过画面，以完全遮挡作为变装切点", shot: "遮挡转场 / 固定", duration: "1.0s" },
        { index: 4, timecode: "0:04.3–0:05.6", scene: "紫色妆造与卷发亮相，单手横向扫镜承接前一动作", shot: "中近景 / 动作衔接", duration: "1.3s" },
        { index: 5, timecode: "0:05.6–0:08.8", scene: "双手交替靠近镜头并张合翻转，展示紫色镜面猫眼长甲的流动高光，笑容定格", shot: "手部特写 / 固定", duration: "3.2s" },
      ],
      style: {
        tone: "中性肤色 → 紫灰氛围妆造",
        pacing: "紧凑 · 5 段/8.8 秒",
        lighting: "室内正面柔光 · 镜面高光",
        composition: "人物居中 + 双手近镜前景",
      },
      music: "节奏型变装 BGM · 遮挡处卡点",
    },
    p3: {
      hasVideo: true,
      videoSrc: "/videos/mask.mp4",
      duration: "0:15",
      ratio: "9:16 竖屏",
      steps: [
        {
          index: "01",
          title: "二创文案 → 分镜拆解",
          icon: "ListChecks",
          thinking: [
            "读取二创文案，提取叙事结构……",
            "划分情绪段落：痛点引入→产品登场→使用演示→效果收尾",
            "匹配镜头数：15 秒成片 → 4 个分镜",
            "为每个分镜标注时长与节奏卡点",
          ],
          result: [
            { label: "成片时长", value: "约 15 秒" },
            { label: "分镜数", value: "4 个镜头，节奏前慢后快" },
            { label: "叙事结构", value: "手持产品 → 镜前护肤 → 涂抹特写 → 闭眼享受" },
          ],
        },
        {
          index: "02",
          title: "画面风格设定",
          icon: "PaintBrush",
          thinking: [
            "解析 Brief 调性：专业、亲切、真实",
            "选择色调：洁净白 + 柔和暖肤",
            "确定光影：浴室柔光，镜前补光",
            "构图原则：镜前自拍视角 + 产品特写",
          ],
          result: [
            { label: "色调", value: "洁净白调 + 柔和暖肤，传递专业感" },
            { label: "光影", value: "浴室柔光 + 镜前补光，无瑕肤色" },
            { label: "构图", value: "镜前第一视角 + 闭眼涂抹特写" },
          ],
        },
        {
          index: "03",
          title: "逐镜头生成",
          icon: "VideoCamera",
          thinking: [
            "镜头 1：手持面膜，准备敷用……",
            "镜头 2：浴室镜前，摸脸护肤……",
            "镜头 3：闭眼涂抹凝露特写……",
            "镜头 4：享受状态收尾……",
            "4 个镜头渲染完成，正在合成",
          ],
          result: [
            { label: "镜头 1", value: "手持睡眠面膜，柔和室内光，0–3s" },
            { label: "镜头 2", value: "浴室镜前摸脸，护肤场景，3–7s" },
            { label: "镜头 3", value: "闭眼涂抹凝露特写，7–11s" },
            { label: "镜头 4", value: "享受状态 + CTA，11–15s" },
          ],
        },
        {
          index: "04",
          title: "成片合成",
          icon: "FilmStrip",
          thinking: [
            "拼接 4 个镜头，添加转场……",
            "匹配配乐节奏（舒缓治愈风）",
            "调色统一洁净白调，输出 576×1024",
            "成片合成完成 ✓",
          ],
          result: [
            { label: "分辨率", value: "576 × 1024（竖屏 9:16）" },
            { label: "配乐", value: "舒缓治愈系 BGM，BPM 70" },
            { label: "成片时长", value: "15.0 秒，4 镜头 + 3 转场" },
          ],
        },
      ],
      shots: [
        { index: 1, timecode: "0:00–0:03", scene: "手持睡眠面膜，柔和室内光，准备敷用", shot: "中景 / 手持", duration: "3.0s" },
        { index: 2, timecode: "0:03–0:07", scene: "浴室镜前摸脸，白色瓷砖背景，护肤场景", shot: "镜前视角 / 固定", duration: "4.0s" },
        { index: 3, timecode: "0:07–0:11", scene: "闭眼涂抹白色凝露特写，肤质细腻", shot: "特写 / 缓推", duration: "4.0s" },
        { index: 4, timecode: "0:11–0:15", scene: "享受状态收尾 + CTA", shot: "中景 / 固定", duration: "4.0s" },
      ],
      style: {
        tone: "洁净白调 + 柔和暖肤",
        pacing: "舒缓 · 4 镜头/15 秒",
        lighting: "浴室柔光 + 镜前补光",
        composition: "镜前第一视角 + 涂抹特写",
      },
      music: "舒缓治愈系 · BPM 70",
    },
    // p2 (咖啡壶) — real video provided (横屏 16:9, 10.5s)
    p2: {
      hasVideo: true,
      videoSrc: "/videos/coffee.mp4",
      duration: "0:10",
      ratio: "16:9 横屏",
      steps: [
        {
          index: "01",
          title: "二创文案 → 分镜拆解",
          icon: "ListChecks",
          thinking: [
            "读取二创文案，提取叙事结构……",
            "划分情绪段落：产品登场→冲煮演示→倒出特写→品味收尾",
            "匹配镜头数：10.5 秒成片 → 4 个分镜",
            "为每个分镜标注时长与节奏卡点",
          ],
          result: [
            { label: "成片时长", value: "约 10.5 秒" },
            { label: "分镜数", value: "4 个镜头，节奏舒缓有质感" },
            { label: "叙事结构", value: "冲煮中 → 蒸汽与互动 → 倒咖啡特写 → 手持品味" },
          ],
        },
        {
          index: "02",
          title: "画面风格设定",
          icon: "PaintBrush",
          thinking: [
            "解析 Brief 调性：实用、清爽、亲切",
            "选择色调：暖光 + 原木桌面",
            "确定光影：柔光侧逆，浅景深",
            "构图原则：产品居中 + 手部互动特写",
          ],
          result: [
            { label: "色调", value: "暖调 · 琥珀咖啡色 + 原木色" },
            { label: "光影", value: "柔光侧逆，浅景深虚化背景" },
            { label: "构图", value: "产品居中 + 手部互动特写交替" },
          ],
        },
        {
          index: "03",
          title: "逐镜头生成",
          icon: "VideoCamera",
          thinking: [
            "镜头 1：玻璃滴漏壶冲煮，咖啡滴入下壶……",
            "镜头 2：蒸汽升腾，手伸向产品……",
            "镜头 3：咖啡倒入玻璃杯特写……",
            "镜头 4：手持咖啡杯，暖光木桌收尾……",
            "4 个镜头渲染完成，正在合成",
          ],
          result: [
            { label: "镜头 1", value: "玻璃滴漏壶冲煮中，咖啡缓缓滴入下壶，0–2.5s" },
            { label: "镜头 2", value: "蒸汽升腾，手伸向产品互动，2.5–5s" },
            { label: "镜头 3", value: "咖啡倒入玻璃杯特写，醇厚色泽，5–7.5s" },
            { label: "镜头 4", value: "手持咖啡杯，暖光木桌收尾，7.5–10.5s" },
          ],
        },
        {
          index: "04",
          title: "成片合成",
          icon: "FilmStrip",
          thinking: [
            "拼接 4 个镜头，添加转场……",
            "匹配配乐节奏（舒缓质感风）",
            "调色统一暖调，输出 1280×716",
            "成片合成完成 ✓",
          ],
          result: [
            { label: "分辨率", value: "1280 × 716（横屏 16:9）" },
            { label: "配乐", value: "舒缓质感系 BGM，BPM 80" },
            { label: "成片时长", value: "10.5 秒，4 镜头 + 3 转场" },
          ],
        },
      ],
      shots: [
        { index: 1, timecode: "0:00–0:02.5", scene: "玻璃滴漏壶冲煮中，咖啡缓缓滴入下壶，暖光木桌", shot: "特写 / 浅景深", duration: "2.5s" },
        { index: 2, timecode: "0:02.5–0:05", scene: "蒸汽升腾，手伸向产品互动", shot: "中景 / 缓推", duration: "2.5s" },
        { index: 3, timecode: "0:05–0:07.5", scene: "咖啡倒入玻璃杯特写，醇厚琥珀色泽", shot: "特写 / 固定", duration: "2.5s" },
        { index: 4, timecode: "0:07.5–0:10.5", scene: "手持咖啡杯，暖光木桌收尾", shot: "中景 / 手持", duration: "3.0s" },
      ],
      style: {
        tone: "暖调 · 琥珀咖啡色 + 原木色",
        pacing: "舒缓 · 4 镜头/10.5 秒",
        lighting: "柔光侧逆 · 浅景深",
        composition: "产品居中 + 手部互动特写",
      },
      music: "舒缓质感系 · BPM 80",
    },
  }
  return map[productId] ?? map.p1
}
