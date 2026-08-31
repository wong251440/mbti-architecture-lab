/* MBTI Architecture Lab — versioned measurement prototype */
const SCORING_VERSION = "1.0";
const QUESTION_BANK_VERSION = "DCA-v1";
const STORAGE_KEY = "mbti-architecture-lab-v1";

const axisMeta = {
  EI: { positive: "E", negative: "I", title: "External / Internal Orientation", labels: ["外部導向", "內部導向"] },
  SN: { positive: "N", negative: "S", title: "Abstract / Concrete Information", labels: ["抽象導向", "具體導向"] },
  TF: { positive: "T", negative: "F", title: "Analytical / Value Decision", labels: ["分析導向", "價值／人本導向"] },
  JP: { positive: "J", negative: "P", title: "Structure / Adaptive Exploration", labels: ["結構導向", "適應探索導向"] }
};

const poleMeta = {
  E: { name: "External Orientation", zh: "外部導向", axis: "EI" },
  I: { name: "Internal Orientation", zh: "內部導向", axis: "EI" },
  S: { name: "Concrete Orientation", zh: "具體資訊導向", axis: "SN" },
  N: { name: "Abstract Orientation", zh: "抽象資訊導向", axis: "SN" },
  T: { name: "Analytical Orientation", zh: "分析決策導向", axis: "TF" },
  F: { name: "Value / Human Orientation", zh: "價值／人本導向", axis: "TF" },
  J: { name: "Structure Orientation", zh: "結構導向", axis: "JP" },
  P: { name: "Adaptive Orientation", zh: "適應探索導向", axis: "JP" }
};

const facetMeta = [
  { code: "E1", pole: "E", axis: "EI", name: "Social Initiation", zh: "社交啟動", desc: "沒有外在要求時，自然開始互動的傾向。" },
  { code: "E2", pole: "E", axis: "EI", name: "External Processing", zh: "外部思考", desc: "互動與說話是否本身就是思考的一部分。" },
  { code: "E3", pole: "E", axis: "EI", name: "External Stimulation", zh: "外部刺激", desc: "透過環境變化和即時互動提升活躍程度。" },
  { code: "I1", pole: "I", axis: "EI", name: "Solitary Recovery", zh: "獨處恢復", desc: "獨處是否自然恢復精神資源。" },
  { code: "I2", pole: "I", axis: "EI", name: "Internal Processing", zh: "內部形成", desc: "先在內部形成完整想法再表達的傾向。" },
  { code: "I3", pole: "I", axis: "EI", name: "Internal Absorption", zh: "內部沉浸", desc: "長時間沉浸於內部思想、興趣或分析。" },
  { code: "S1", pole: "S", axis: "SN", name: "Concrete Evidence Priority", zh: "具體證據優先", desc: "面對未知問題時，先尋找可直接確認資訊。" },
  { code: "S2", pole: "S", axis: "SN", name: "Detail Registration", zh: "細節登錄", desc: "自然注意具體差異、細節、異常與實際資訊。" },
  { code: "S3", pole: "S", axis: "SN", name: "Experience Anchoring", zh: "經驗錨定", desc: "從已知案例、方法與實證開始理解問題。" },
  { code: "N1", pole: "N", axis: "SN", name: "Abstraction", zh: "抽象化", desc: "把大量資訊濃縮成原理、模型或概念。" },
  { code: "N2", pole: "N", axis: "SN", name: "Pattern Linking", zh: "模式連結", desc: "跨資訊建立關聯與模式。" },
  { code: "N3", pole: "N", axis: "SN", name: "Possibility Generation", zh: "可能性生成", desc: "資訊不足時自然產生多種解釋與未來情境。" },
  { code: "T1", pole: "T", axis: "TF", name: "Logical Consistency", zh: "邏輯一致性", desc: "判斷時高度重視推理前後一致。" },
  { code: "T2", pole: "T", axis: "TF", name: "Impersonal Criteria", zh: "一般性標準", desc: "先以可普遍適用的標準檢驗方案。" },
  { code: "T3", pole: "T", axis: "TF", name: "Trade-off Analysis", zh: "取捨分析", desc: "把問題拆成成本、收益、因果與取捨。" },
  { code: "F1", pole: "F", axis: "TF", name: "Value Alignment", zh: "價值一致", desc: "確認方案是否與個人或團隊重視的價值一致。" },
  { code: "F2", pole: "F", axis: "TF", name: "Human Impact Weighting", zh: "人際影響權重", desc: "把不同人受到的實際影響放入主要模型。" },
  { code: "F3", pole: "F", axis: "TF", name: "Perspective Integration", zh: "觀點整合", desc: "模擬不同人的感受、需求與觀點後再判斷。" },
  { code: "J1", pole: "J", axis: "JP", name: "Closure Preference", zh: "收束偏好", desc: "資訊足夠時自然希望形成決定，結束懸而未決。" },
  { code: "J2", pole: "J", axis: "JP", name: "Pre-structuring", zh: "事前結構化", desc: "行動前建立框架、順序或安排。" },
  { code: "J3", pole: "J", axis: "JP", name: "Commitment Stability", zh: "承諾穩定", desc: "合理決定後穩定執行而非持續重開選項。" },
  { code: "P1", pole: "P", axis: "JP", name: "Option Preservation", zh: "保留選項", desc: "自然保留替代方案與未來改變的可能。" },
  { code: "P2", pole: "P", axis: "JP", name: "Live Updating", zh: "即時更新", desc: "新資訊出現時自然調整原有安排。" },
  { code: "P3", pole: "P", axis: "JP", name: "Exploratory Action", zh: "探索行動", desc: "資訊未完整時先探索、嘗試，再形成方向。" }
];

const behaviorTexts = {
  E1: [
    ["當你到了新的工作或學習場合，回想最近三次類似經驗，你多常在沒有被介紹以前就主動開啟一段互動？", "過去一個月，當你和一群不太熟的人一起等待時，你多常自然找人交換看法或資訊？"],
  ],
  E2: [["最近幾次遇到還沒想清楚的問題時，你多常先找人談一輪，讓想法在對話中成形？", "回想最近一次複雜的決定，在寫下完整結論以前，你多常用討論來測試自己的推理？"]],
  E3: [["過去一個月需要恢復精神時，你多常刻意走到有活動或人聲的地方？", "回想最近十次低能量的時段，你多常透過換環境、參加活動或即時互動讓自己重新活躍？"]],
  I1: [["回想最近三次忙碌後的晚上，你多常透過獨處而不是找人互動恢復精神？", "過去一個月，行程突然空下來時，你多常把這段時間留給自己而感到能量回來？"]],
  I2: [["最近幾次要表達重要意見時，你多常先在心裡整理到相對完整才開口？", "回想最近一次會議，別人正在討論時，你多常先暫不發言，等自己的理解成形？"]],
  I3: [["過去一個月，你多常在沒有外部要求時，連續一段時間沉浸於自己的研究、想像或分析？", "回想最近十次休息時，你多常不知不覺投入內在思考而忘了時間？"]],
  S1: [["第一次遇到陌生問題時，回想最近五次，你多常先找能直接核對的資料再提出解釋？", "過去一個月開始新任務前，你多常先確認實際限制、規格或已發生的事？"]],
  S2: [["回想最近十次檢查工作或物件，你多常先注意到具體差異、遺漏或異常？", "過去一個月在熟悉的環境中，你多常記得別人忽略的小變化或實際細節？"]],
  S3: [["最近幾次學習新方法時，你多常先找過往案例或已驗證步驟作為起點？", "回想最近一次需要提出方案的任務，你多常先參考自己曾用過且有效的方法？"]],
  N1: [["遇到大量零散資訊時，回想最近五次，你多常在資料整理完以前就先抓出背後的原理？", "過去一個月讀完一組材料後，你多常把它濃縮成一個可以反覆使用的模型或概念？"]],
  N2: [["最近幾次接觸不同來源的資訊時，你多常很快看出它們之間可能共享的模式？", "回想過去一個月的一個新主題，你多常把看似無關的例子連到更大的脈絡？"]],
  N3: [["過去一個月，遇到資訊不完整的新問題時，你多常在查完所有資料以前就想到數種可能解釋？", "回想最近一次規劃未來，你多常同時提出幾條不同方向，而不是只延伸一個方案？"]],
  T1: [["最近幾次比較兩個說法時，你多常先檢查它們的前提和結論是否彼此一致？", "回想過去一個月的一次討論，你多常因為論證中有矛盾而回頭重整判斷？"]],
  T2: [["最近幾次做重要選擇時，你多常先把自己的關係與情緒放到一旁，尋找大家都能套用的標準？", "回想過去一個月評估方案時，你多常問『換成另一個人也會用同一規則嗎？』？"]],
  T3: [["面對兩個都有優點的方案時，回想最近五次，你多常主動拆出成本、收益和長期取捨？", "過去一個月處理複雜問題時，你多常先畫出因果鏈，再決定要犧牲什麼？"]],
  F1: [["最近幾次要在兩個可行方案中選一個時，你多常先確認哪個更符合自己或團隊真正重視的價值？", "回想過去一個月的一次決定，你多常因為方案與核心原則不一致而放棄它？"]],
  F2: [["最近幾次評估會影響其他人的方案時，你多常把每個人可能承受的實際後果列為主要資訊？", "回想過去一個月的團隊決定，你多常調整效率較高的做法，以降低某些人長期的負擔？"]],
  F3: [["在形成重要判斷前，回想最近三次，你多常刻意模擬不同人會怎麼理解或感受？", "過去一個月處理分歧時，你多常先把對方的需求說到對方也認可，再提出自己的結論？"]],
  J1: [["當資訊已經足夠作決定時，回想最近五次，你多常主動把討論收束成一個明確選項？", "過去一個月遇到懸而未決的事項，你多常因為想結束不確定而設定最後決定點？"]],
  J2: [["回想最近幾次沒有明確流程的重要任務，在開始以前你多常先決定主要步驟或順序？", "過去一個月安排一個新專案時，你多常先建立框架，再把細節填進去？"]],
  J3: [["形成合理決定後，回想最近三次，你多常按照原定方向執行而不再反覆打開選項？", "過去一個月開始執行一項計畫後，你多常維持承諾，即使還有其他可能做法？"]],
  P1: [["最近幾次還不必定案時，你多常刻意保留兩三個替代方案？", "過去一個月安排未來行程時，你多常留下可以臨時改變的空間？"]],
  P2: [["新資訊出現時，回想最近五次，你多常立即重新調整已排好的順序或計畫？", "過去一個月執行任務途中，你多常因為新發現而改用另一條路徑？"]],
  P3: [["資訊尚未完整時，回想最近五次，你多常先做一個小實驗或試用，再決定正式方向？", "過去一個月遇到陌生任務，你多常透過先動手探索來找出問題，而不是先寫完整計畫？"]]
};

const behaviorOptions = [
  { key: "1", label: "幾乎沒有", value: -2 },
  { key: "2", label: "少數情況", value: -1 },
  { key: "3", label: "約一半", value: 0 },
  { key: "4", label: "多數情況", value: 1 },
  { key: "5", label: "幾乎每次", value: 2 }
];
const agreementOptions = [
  { key: "A", label: "明顯偏 A", value: 2 },
  { key: "B", label: "稍微偏 A", value: 1 },
  { key: "C", label: "沒有明顯偏好", value: 0 },
  { key: "D", label: "稍微偏 B", value: -1 },
  { key: "E", label: "明顯偏 B", value: -2 }
];

const forcedGroups = [
  { axis: "EI", pole: "E", context: "free", a: "先找一個人交換現場資訊，邊說邊讓想法成形。", b: "先離開互動，自己整理好理解後再決定要說什麼。", stem: "你剛加入一個沒有固定流程的協作小組，只能先做一件事。" },
  { axis: "EI", pole: "E", context: "pressure", a: "召集相關的人快速同步，透過即時反應找到下一步。", b: "先獨自整理關鍵資訊，形成短結論後再通知其他人。", stem: "時間只剩半小時，但團隊對問題的理解仍不一致。" },
  { axis: "EI", pole: "E", context: "responsibility", a: "先和受影響的人談，讓互動本身成為方案的一部分。", b: "先在內部把方案推演完整，再帶著清楚版本去溝通。", stem: "一個決定會影響其他人的工作方式，你還有一天可以準備。" },
  { axis: "EI", pole: "E", context: "uncertainty", a: "到現場看看不同人的反應，從外部刺激中找到方向。", b: "把問題帶回自己的思考空間，先讓內在模型變得清楚。", stem: "你面對一個沒有標準答案的新問題，而且暫時沒有風險。" },
  { axis: "SN", pole: "N", context: "free", a: "先收集幾個真實案例，了解實際發生過什麼。", b: "先建立一個能解釋整體問題的模型，再決定收集什麼。", stem: "你剛接手一個完全陌生的問題，而且只能先進行其中一件事。" },
  { axis: "SN", pole: "N", context: "pressure", a: "先列出已確認的數據與限制，避免猜測拖慢決定。", b: "先抓出最可能的模式，直接用它推導快速方案。", stem: "你必須在十多分鐘內對一份不完整的資料做出回應。" },
  { axis: "SN", pole: "N", context: "responsibility", a: "從過往相似案例與已驗證做法開始，降低未知風險。", b: "先想像幾種未來情境，再挑能應付變化的方向。", stem: "你的方案會影響一個團隊接下來半年的工作。" },
  { axis: "SN", pole: "N", context: "uncertainty", a: "先逐項確認眼前的觀察與細節，再往外推論。", b: "先把零散線索連成幾個可能解釋，允許暫時沒有證據。", stem: "你有很多線索，但沒有一條完整資訊可以直接依靠。" },
  { axis: "TF", pole: "T", context: "free", a: "先固定可重複套用的判準，再比較各方案。", b: "先確認哪個方案和大家重視的價值及感受一致。", stem: "兩個方案都可行，你有充裕時間慢慢形成判斷。" },
  { axis: "TF", pole: "T", context: "pressure", a: "先算出影響最大的成本、收益與必要取捨。", b: "先確認哪些人會承受什麼後果，避免忽略不可接受的影響。", stem: "你必須很快選一個方案，資訊只有七成完整。" },
  { axis: "TF", pole: "T", context: "responsibility", a: "先檢查方案的因果與效率是否真的成立。", b: "先把受影響者的觀點納入，再判斷結果是否值得。", stem: "效率更高的方案會讓兩名成員承受長期額外壓力。" },
  { axis: "TF", pole: "T", context: "uncertainty", a: "先把假設拆開，找出哪個推理環節最需要驗證。", b: "先理解不同人如何看待問題，讓判斷不脫離真實脈絡。", stem: "你面對一個資訊不完整且各方說法不同的爭議。" },
  { axis: "JP", pole: "J", context: "free", a: "先排出一個順序，讓接下來的行動有清楚框架。", b: "先保留幾個方向，邊探索邊決定哪個最值得投入。", stem: "你開始一個沒有截止日期的個人專案。" },
  { axis: "JP", pole: "J", context: "pressure", a: "快速選定可執行版本，讓團隊知道現在照什麼走。", b: "保留調整空間，先做最小嘗試再依結果更新。", stem: "剩下的時間不多，但關鍵資訊可能很快改變。" },
  { axis: "JP", pole: "J", context: "responsibility", a: "先把責任、步驟和檢查點定清楚，穩定交付。", b: "先設計能吸收新資訊的流程，讓方案保有彈性。", stem: "你的決定會成為其他人接下來的工作依據。" },
  { axis: "JP", pole: "J", context: "uncertainty", a: "先訂一個暫時結論，讓未知變成可以管理的下一步。", b: "先進行幾個小實驗，讓方向從現場回饋中浮現。", stem: "沒有標準答案，也沒有足夠資料做長期計畫。" }
];

const scenarioGroups = [
  { axis: "EI", pole: "E", context: "free", stem: "自由探索：你有一個下午整理新主題，沒有交付壓力。", a: "找一兩個人對談，從來回反應中整理思路。", b: "留出安靜時間，讓自己先形成完整脈絡。" },
  { axis: "EI", pole: "E", context: "responsibility", stem: "責任環境：你的做法會影響新加入的成員。", a: "先邀請他們一起討論，從互動中調整做法。", b: "先把流程想清楚，再用明確版本和他們溝通。" },
  { axis: "EI", pole: "E", context: "pressure", stem: "時間壓力：十分鐘後要向大家說明下一步。", a: "先快速找人同步，利用即時問題補齊理解。", b: "先獨自寫出重點，再用短訊息一次說清楚。" },
  { axis: "EI", pole: "E", context: "uncertainty", stem: "不確定環境：你不知道誰掌握了關鍵線索。", a: "主動和不同的人接觸，讓外部線索帶出方向。", b: "先自己消化已知訊息，再決定要向誰提問。" },
  { axis: "SN", pole: "N", context: "free", stem: "自由探索：你可以用一天研究一個陌生領域。", a: "先整理實際案例、數字與可觀察細節。", b: "先畫出可能的概念框架，再決定深入哪些資料。" },
  { axis: "SN", pole: "N", context: "responsibility", stem: "責任環境：你的分析會被用來分配資源。", a: "先核對已發生的事和可驗證的限制。", b: "先推演幾種情境，避免方案只適用於現在。" },
  { axis: "SN", pole: "N", context: "pressure", stem: "時間壓力：你必須立刻判讀一個異常結果。", a: "先確認最直接的數據與具體變化。", b: "先提出最可能的整體模式，再快速驗證。" },
  { axis: "SN", pole: "N", context: "uncertainty", stem: "不確定環境：線索互相矛盾，暫時沒有標準答案。", a: "先逐條確認什麼是實際發生過的。", b: "先保留多個解釋，觀察它們能否連成更大模式。" },
  { axis: "TF", pole: "T", context: "free", stem: "自由探索：你可以慢慢比較兩個都不錯的方案。", a: "先建立一致的評估標準與因果假設。", b: "先確認兩個方案各自守護的價值與人際意義。" },
  { axis: "TF", pole: "T", context: "responsibility", stem: "責任環境：效率較高的配置會增加兩人的長期負擔。", a: "先量化效率差異，以及是否有第三種配置。", b: "先了解額外負擔的實際影響與可接受程度。" },
  { axis: "TF", pole: "T", context: "pressure", stem: "時間壓力：你只有五分鐘決定是否上線。", a: "先抓住最關鍵的風險、成本和可逆性。", b: "先確認使用者和團隊會承受的具體後果。" },
  { axis: "TF", pole: "T", context: "uncertainty", stem: "不確定環境：每個人都帶著不同的經驗進入討論。", a: "先拆開各說法的推理，找出能共同檢驗的部分。", b: "先聽懂每個人真正關心的需求，再形成判斷。" },
  { axis: "JP", pole: "J", context: "free", stem: "自由探索：你有一週時間完成一個小型創作。", a: "先排出里程碑和主要步驟。", b: "先試幾個方向，讓作品在過程中自然成形。" },
  { axis: "JP", pole: "J", context: "responsibility", stem: "責任環境：其他人要依照你的安排投入時間。", a: "先定義交付、責任與檢查點。", b: "先保留可以因回饋而改動的工作方式。" },
  { axis: "JP", pole: "J", context: "pressure", stem: "時間壓力：今天必須交出一個可用版本。", a: "先選定範圍並把執行順序固定下來。", b: "先做最小可行嘗試，讓結果決定下一步。" },
  { axis: "JP", pole: "J", context: "uncertainty", stem: "不確定環境：每次嘗試都可能改變你對問題的理解。", a: "先設一個暫時框架，避免探索失去方向。", b: "先讓選項保持開放，隨新資訊即時更新。" }
];

const probeGroups = [
  { axis: "EI", pole: "E", context: "social", stem: "和非常熟悉的三、四個人在一起數小時後，你通常比較接近哪個狀態？", a: "互動讓我更有精神，還想繼續交換想法。", b: "我需要離開互動，獨處後才真正恢復。" },
  { axis: "EI", pole: "E", context: "social", stem: "換成不熟悉的十多人、且現場持續變化時，你通常比較接近哪個狀態？", a: "我會被現場刺激帶動，主動加入不同互動。", b: "我會先觀察，保留自己的能量和想法。" },
  { axis: "SN", pole: "N", context: "uncertainty", stem: "當資料只到六成、但必須先開始時，你通常先做什麼？", a: "把已知細節逐一確認，找出最可靠的起點。", b: "先提出數個整體假設，讓探索有方向。" },
  { axis: "SN", pole: "N", context: "future", stem: "面對半年後仍很模糊的目標，你通常先做什麼？", a: "找相似案例，拆出已知的實際步驟。", b: "想像幾種可能終局，再回推需要的路徑。" },
  { axis: "TF", pole: "T", context: "tradeoff", stem: "兩個方案都會犧牲某些東西時，你通常先找哪種資訊？", a: "可比較、可重複的標準與代價。", b: "不同人對犧牲的感受、價值與需求。" },
  { axis: "TF", pole: "T", context: "conflict", stem: "團隊對同一件事有不同解讀時，你通常先做什麼？", a: "把假設和推理拆開，找出矛盾所在。", b: "先理解每個人的觀點從何而來，再找交集。" },
  { axis: "JP", pole: "J", context: "planning", stem: "有一個重要任務但資訊還會變動時，你通常先做什麼？", a: "訂出暫時順序和決定點，穩定推進。", b: "先保留替代方案，用小步驟探索。" },
  { axis: "JP", pole: "J", context: "updating", stem: "原定計畫突然收到新資訊時，你通常比較接近哪個反應？", a: "先完成目前承諾，再安排下一個調整點。", b: "立刻重排方案，讓新資訊直接進入行動。" }
];

function makeItems() {
  const behaviorItems = [];
  let behaviorIndex = 0;
  facetMeta.forEach((facet) => {
    const pair = behaviorTexts[facet.code]?.[0] || [];
    pair.forEach((text, index) => {
      behaviorIndex += 1;
      behaviorItems.push({
        item_id: `${facet.code}_B_0${index + 1}`,
        format: "behavior",
        axis: facet.axis,
        primary_pole: facet.pole,
        facet: facet.code,
        context: ["free", "responsibility", "pressure", "uncertainty"][behaviorIndex % 4],
        direction: 1,
        mirror_group: behaviorIndex <= 8 ? `M${Math.ceil(behaviorIndex / 2)}` : null,
        scoring_key: "behavior_likert_5",
        active: true,
        stem: text,
        anchor: index === 0 ? "回想最近十次類似情況，選擇最接近的頻率。" : "回想過去一個月的實際經驗，不用回答理想中的自己。",
        options: behaviorOptions
      });
    });
  });
  const forcedItems = forcedGroups.map((group, index) => ({
    item_id: `${group.axis}_FC_${String(index + 1).padStart(2, "0")}`,
    format: "forced_choice", axis: group.axis, primary_pole: group.pole, facet: null, context: group.context, direction: 1,
    stem: group.stem, optionA: group.a, optionB: group.b, anchor: "兩種方法都合理，請選擇在取捨時更自然優先的那一種。", mirror_group: null, scoring_key: "forced_tradeoff_5", active: true, options: agreementOptions
  }));
  const scenarioItems = scenarioGroups.map((group, index) => ({
    item_id: `${group.axis}_SC_${String(index + 1).padStart(2, "0")}`,
    format: "scenario", axis: group.axis, primary_pole: group.pole, facet: null, context: group.context, direction: 1,
    stem: group.stem, optionA: group.a, optionB: group.b, anchor: "不是選出正確答案，而是指出你形成決策時最先加入的資訊。", mirror_group: null, scoring_key: "scenario_context_5", active: true, options: agreementOptions
  }));
  const probes = probeGroups.map((group, index) => ({
    item_id: `${group.axis}_DP_${String(index + 1).padStart(2, "0")}`,
    format: "probe", axis: group.axis, primary_pole: group.pole, facet: null, context: group.context, direction: 1,
    stem: group.stem, optionA: group.a, optionB: group.b, anchor: "這是釐清情境差異的確認題，不會單獨改寫你的整體結果。", mirror_group: null, scoring_key: "dynamic_probe_5", active: true, options: agreementOptions
  }));
  return { behaviorItems, forcedItems, scenarioItems, probes };
}

let ITEM_BANK = makeItems();

function stripItemTag(text) {
  return String(text || "").replace(/\s*（\s*(?:`?(?:function|facet|Pole|Tag)\b)[\s\S]*?）\s*$/, "").trim();
}

function contextBucket(meta) {
  const source = `${meta.context_type || meta.context || ""} ${meta.pressure_level || ""}`.toLowerCase();
  if (/responsibility|high_responsibility|interpersonal_conflict|high_responsibility/.test(source)) return "responsibility";
  if (/pressure_time|pressure_social|crisis|environment_change|sunk_cost|conflict/.test(source) || meta.pressure_level === "high") return "pressure";
  if (/free|baseline|peer_review|ideation|exploration|low/.test(source) && meta.pressure_level !== "high") return "free";
  if (/responsibility|conflict|impact|social|energy/.test(source)) return "responsibility";
  if (/uncertainty|unknown|ambiguous|change|pressure/.test(source)) return "uncertainty";
  return meta.pressure_level === "high" ? "pressure" : "free";
}

function parseQuestionBank(markdown) {
  const matches = [...markdown.matchAll(/```json\s*([\s\S]*?)\s*```/g)];
  const records = matches.map((match, index) => {
    const meta = JSON.parse(match[1]);
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    return { meta, section: markdown.slice(start, end) };
  });
  const behaviorItems = [];
  const forcedItems = [];
  const scenarioItems = [];
  const costItems = [];
  const probes = [];
  records.forEach(({ meta, section }) => {
    const base = {
      item_id: meta.item_id,
      module: meta.module,
      axis: meta.axis || poleMeta[meta.pole]?.axis || null,
      primary_pole: meta.pole || meta.pole_B || null,
      facet: meta.facet || null,
      context: contextBucket(meta),
      context_type: meta.context_type || meta.context || meta.cost_type || meta.probe_type || null,
      direction: 1,
      mirror_group: null,
      scoring_key: meta.scoring_key || null,
      active: true,
      raw_metadata: meta
    };
    if (meta.module === "A") {
      const stem = section.match(/\*\*題目\*\*：([^\n]+)/)?.[1]?.trim() || "";
      behaviorItems.push({ ...base, format: "behavior", direction: 1, stem, anchor: "請根據最近真實經驗作答；[NA] 不計入分母與平均。", options: [
        { key: "NA", label: "不適用 / 無相關經驗", value: null },
        { key: "0", label: "幾乎沒有", value: 0 },
        { key: "1", label: "少數情況", value: 1 },
        { key: "2", label: "約一半情況", value: 2 },
        { key: "3", label: "多數情況", value: 3 },
        { key: "4", label: "幾乎每次", value: 4 }
      ] });
      return;
    }
    if (meta.module === "B") {
      const stem = section.match(/\*\*情境\*\*：([^\n]+)/)?.[1]?.trim() || "";
      const options = [...section.matchAll(/^\*\s+\*\*選項\s+([AB])\*\*：([^\n]+)/gm)].map((match) => ({ key: match[1], label: stripItemTag(match[2]), value: match[1] === "A" ? -2 : 2 }));
      const axis = meta.axis;
      const direction = axisMeta[axis]?.positive === meta.pole_B ? 1 : -1;
      forcedItems.push({ ...base, format: "forced_choice", primary_pole: meta.pole_B, pole_A: meta.pole_A, pole_B: meta.pole_B, direction, stem, optionA: options[0]?.label || "", optionB: options[1]?.label || "", anchor: "兩種方法都有優點，請以自然的取捨優先順序作答。", options: [
        { key: "A", label: "強烈偏向 A", value: -2 },
        { key: "B", label: "稍微偏向 A", value: -1 },
        { key: "C", label: "無明顯偏向 / 兩者平衡", value: 0 },
        { key: "D", label: "稍微偏向 B", value: 1 },
        { key: "E", label: "強烈偏向 B", value: 2 }
      ] });
      return;
    }
    if (meta.module === "C") {
      const stem = section.match(/\*\*情境主幹\*\*：([^\n]+)/)?.[1]?.trim() || "";
      const stepOneText = section.split(/#####\s*Step 1：[^\n]*\n/)[1]?.split(/#####\s*Step 2：/)[0] || "";
      const stepTwoText = section.split(/#####\s*Step 2：[^\n]*\n/)[1] || "";
      const step1Options = [...stepOneText.matchAll(/^\*\s+\*\*([A-D])\*\*：([^\n]+)/gm)].map((match) => ({ key: match[1], label: stripItemTag(match[2]), function_tag: (match[2].match(/`function:\s*([^`]+)`/) || [])[1] || null }));
      const step2Options = [...stepTwoText.matchAll(/^\*\s+\*\*([A-D])\*\*：([^\n]+)/gm)].map((match) => {
        const facetMatch = match[2].match(/`facet:\s*([^`,]+)[^`]*`/);
        const poleMatch = match[2].match(/`(?:facet:[^`]+,\s*)?pole:\s*([EIFSTJPN])`/);
        return { key: match[1], label: stripItemTag(match[2]), facet: facetMatch?.[1]?.trim() || null, pole: poleMatch?.[1] || null };
      });
      const axis = meta.axis;
      scenarioItems.push({ ...base, format: "micro_sim", primary_pole: axisMeta[axis]?.positive || meta.axis, direction: 1, stem, step1Options, step2Options, anchor: "先選第一個行動，再選最主要原因；兩個步驟都會納入測量。", options: [] });
      return;
    }
    if (meta.module === "D") {
      const stem = section.match(/\*\*題目\*\*：([^\n]+)/)?.[1]?.trim() || "";
      const axis = poleMeta[meta.pole]?.axis;
      costItems.push({ ...base, axis, format: "cost", primary_pole: meta.pole, direction: 1, stem, anchor: "得分越高，代表這個心理歷程對你而言認知成本越低。", options: [
        { key: "1", label: "非常不符合", value: 1 },
        { key: "2", label: "大致不符合", value: 2 },
        { key: "3", label: "普通 / 視情況而定", value: 3 },
        { key: "4", label: "大致符合", value: 4 },
        { key: "5", label: "非常符合", value: 5 }
      ] });
      return;
    }
    if (meta.module === "PROBE") {
      const stem = section.match(/\*\*題目\*\*：([^\n]+)/)?.[1]?.trim() || "";
      const options = [...section.matchAll(/^\*\s+`\[([A-D])\]`\s+([^\n]+)/gm)].map((match) => {
        const tagText = match[2];
        const poleMatch = tagText.match(/`Pole:\s*([EIFSTJPN])/);
        return { key: match[1], label: stripItemTag(tagText), pole: poleMatch?.[1] || null };
      });
      probes.push({ ...base, format: "probe", stem, anchor: "這是用來釐清情境依賴的確認題，不會單獨改寫你的整體結果。", options });
    }
  });
  return { behaviorItems, forcedItems, scenarioItems, costItems, probes, coreItems: [...behaviorItems, ...forcedItems, ...scenarioItems, ...costItems], allItems: [...behaviorItems, ...forcedItems, ...scenarioItems, ...costItems, ...probes] };
}

async function hydrateQuestionBank() {
  try {
    const response = await fetch("題庫.txt", { cache: "no-store" });
    if (!response.ok) throw new Error(`題庫載入失敗：${response.status}`);
    const parsed = parseQuestionBank(await response.text());
    if (parsed.behaviorItems.length !== 48 || parsed.forcedItems.length !== 12 || parsed.scenarioItems.length !== 12 || parsed.costItems.length !== 8 || parsed.probes.length !== 8) throw new Error("題庫數量不完整");
    ITEM_BANK = parsed;
    if (!state.itemOrder.length || state.questionBankVersion !== QUESTION_BANK_VERSION) {
      state.itemOrder = [];
      state.currentIndex = 0;
      state.responses = {};
      state.result = null;
      state.initialScoring = null;
      state.view = "intro";
      state.probeMode = false;
    }
    state.questionBankVersion = QUESTION_BANK_VERSION;
    render();
  } catch (error) {
    console.warn(error);
  }
}

function seededShuffle(list, seed = 17) {
  const result = [...list];
  let value = seed;
  for (let i = result.length - 1; i > 0; i -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const j = Math.floor((value / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildInitialOrder() {
  const behavior = seededShuffle(ITEM_BANK.behaviorItems, 29);
  const forced = seededShuffle(ITEM_BANK.forcedItems, 43);
  const scenario = seededShuffle(ITEM_BANK.scenarioItems, 71);
  const cost = seededShuffle(ITEM_BANK.costItems || [], 89);
  const order = [];
  let f = 0; let s = 0; let d = 0;
  behavior.forEach((item, index) => {
    order.push(item);
    if ((index + 1) % 4 === 3 && f < forced.length) order.push(forced[f++]);
    if ((index + 1) % 4 === 2 && s < scenario.length) order.push(scenario[s++]);
    if ((index + 1) % 6 === 1 && d < cost.length) order.push(cost[d++]);
  });
  while (f < forced.length) order.push(forced[f++]);
  while (s < scenario.length) order.push(scenario[s++]);
  while (d < cost.length) order.push(cost[d++]);
  return order;
}

const state = {
  view: "intro",
  sessionId: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  questionBankVersion: QUESTION_BANK_VERSION,
  itemOrder: [],
  currentIndex: 0,
  responses: {},
  startedAt: null,
  questionStartedAt: null,
  initialScoring: null,
  result: null,
  probeMode: false
};

const app = document.getElementById("app");
const savedStateEl = document.getElementById("savedState");

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const avg = (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
const fmt = (value) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
const responseValue = (response) => {
  if (!response) return null;
  const raw = Object.prototype.hasOwnProperty.call(response, "value") ? response.value : response.answer;
  return raw === null || raw === undefined ? null : Number(raw);
};
const isCompleteResponse = (item, response) => Boolean(response) && (item?.format !== "micro_sim" || (response.step1 && response.step2));

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, view: state.view === "result" ? "result" : state.view }));
  updateSavedState();
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !saved.itemOrder?.length) return;
    if (saved.questionBankVersion !== QUESTION_BANK_VERSION) return;
    Object.assign(state, saved);
    if (state.view === "quiz" && state.currentIndex >= state.itemOrder.length) state.currentIndex = state.itemOrder.length - 1;
  } catch (_) { /* ignore malformed local data */ }
}

function updateSavedState() {
  const count = state.itemOrder.filter((item) => isCompleteResponse(item, state.responses[item.item_id])).length;
  savedStateEl.textContent = count ? `${count} 題已保存` : "尚未開始";
}

function resetState() {
  state.view = "intro";
  state.sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  state.itemOrder = [];
  state.currentIndex = 0;
  state.responses = {};
  state.startedAt = null;
  state.questionStartedAt = null;
  state.initialScoring = null;
  state.result = null;
  state.probeMode = false;
  localStorage.removeItem(STORAGE_KEY);
  render();
}

function startTest(resume = false) {
  if (!resume || !state.itemOrder.length) {
    state.sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    state.itemOrder = buildInitialOrder();
    state.responses = {};
    state.currentIndex = 0;
    state.startedAt = Date.now();
    state.initialScoring = null;
    state.result = null;
    state.probeMode = false;
  }
  state.view = "quiz";
  state.questionStartedAt = Date.now();
  persist();
  render();
}

function fillDemo() {
  state.itemOrder = buildInitialOrder();
  state.startedAt = Date.now() - 1000 * 60 * 18;
  state.responses = {};
  state.itemOrder.forEach((item, index) => {
    const response = { user_id: state.sessionId, item_id: item.item_id, responseTime: 5100 + (index % 5) * 740, timestamp: Date.now() - (state.itemOrder.length - index) * 9000, scoring_version: SCORING_VERSION };
    if (item.format === "micro_sim") {
      response.step1 = item.step1Options[0]?.key || "A";
      response.step2 = item.step2Options[0]?.key || "A";
    } else if (item.format === "probe") {
      response.answer = response.value = item.options[0]?.key || "A";
    } else if (item.format === "cost") {
      response.answer = response.value = 4;
    } else if (item.format === "behavior") {
      const demoValue = item.options[1 + (index % 5)]?.value ?? 2;
      response.answer = response.value = demoValue;
    } else {
      const demoValue = index % 3 === 0 ? -2 : 2;
      response.answer = response.value = demoValue;
    }
    state.responses[item.item_id] = response;
  });
  state.initialScoring = scoreAll(state.itemOrder, state.responses);
  state.result = state.initialScoring;
  state.view = "result";
  state.probeMode = false;
  persist();
  render();
}

function answerCurrent(value, step = null) {
  const item = state.itemOrder[state.currentIndex];
  if (!item) return;
  const responseTime = Date.now() - (state.questionStartedAt || Date.now());
  const previous = state.responses[item.item_id] || { user_id: state.sessionId, item_id: item.item_id, responseTime: 0, timestamp: Date.now(), scoring_version: SCORING_VERSION };
  if (item.format === "micro_sim") {
    const key = step === 1 ? "step1" : "step2";
    state.responses[item.item_id] = { ...previous, [key]: value, responseTime: responseTime || previous.responseTime, timestamp: Date.now() };
  } else {
    state.responses[item.item_id] = { ...previous, answer: value, value, responseTime, timestamp: Date.now() };
  }
  persist();
  render();
}

function moveNext() {
  const item = state.itemOrder[state.currentIndex];
  if (!isCompleteResponse(item, state.responses[item?.item_id])) return;
  if (state.currentIndex < state.itemOrder.length - 1) {
    state.currentIndex += 1;
    state.questionStartedAt = Date.now();
    persist();
    render();
    return;
  }
  finishCoreOrResult();
}

function movePrevious() {
  if (state.currentIndex <= 0) return;
  state.currentIndex -= 1;
  state.questionStartedAt = Date.now();
  persist();
  render();
}

function finishCoreOrResult() {
  const scored = scoreAll(state.itemOrder, state.responses);
  if (!state.probeMode) {
    state.initialScoring = scored;
    const neededAxes = scored.dynamicAxes;
    if (neededAxes.length) {
      const probeItems = neededAxes.flatMap((axis) => ITEM_BANK.probes.filter((item) => item.axis === axis).slice(0, 2));
      state.itemOrder = [...state.itemOrder, ...probeItems];
      state.probeMode = true;
      state.currentIndex += 1;
      state.questionStartedAt = Date.now();
      persist();
      render();
      return;
    }
  }
  state.result = scoreAll(state.itemOrder, state.responses);
  state.view = "result";
  persist();
  render();
}

function scoreAll(items, responses) {
  const facetScores = {};
  facetMeta.forEach((facet) => {
    const values = items.filter((item) => item.active && item.format === "behavior" && item.facet === facet.code && responses[item.item_id] && responseValue(responses[item.item_id]) !== null).map((item) => responseValue(responses[item.item_id]));
    facetScores[facet.code] = values.length ? Math.round(clamp((avg(values) / 4) * 100, 0, 100)) : 50;
  });
  const poleScores = {};
  Object.keys(poleMeta).forEach((pole) => {
    const facets = facetMeta.filter((facet) => facet.pole === pole).map((facet) => facetScores[facet.code]);
    const costItems = items.filter((item) => item.active && item.format === "cost" && item.primary_pole === pole && responses[item.item_id]);
    const costScore = costItems.length ? avg(costItems.map((item) => responseValue(responses[item.item_id]) * 20)) : null;
    const facetScore = avg(facets);
    poleScores[pole] = Math.round(costScore === null ? facetScore : facetScore * 0.85 + costScore * 0.15);
  });
  const channels = {};
  Object.keys(axisMeta).forEach((axis) => {
    const fc = items.filter((item) => item.active && item.axis === axis && item.format === "forced_choice" && responses[item.item_id]).map((item) => responseValue(responses[item.item_id]) * item.direction / 2);
    const scenarioItems = items.filter((item) => item.active && item.axis === axis && item.format === "micro_sim" && isCompleteResponse(item, responses[item.item_id]));
    const sc = scenarioItems.map((item) => microScenarioScore(item, responses[item.item_id]));
    const probeItems = items.filter((item) => item.active && item.axis === axis && item.format === "probe" && responses[item.item_id]);
    const probe = probeItems.map((item) => probeScore(item, responses[item.item_id]));
    channels[axis] = { relative: (poleScores[axisMeta[axis].positive] - poleScores[axisMeta[axis].negative]) / 100, forced: avg(fc), scenario: avg(sc), probe: avg(probe), scenarioWithProbe: avg(sc) };
  });
  const axes = {};
  Object.keys(axisMeta).forEach((axis) => {
    const channel = channels[axis];
    const scenarioChannel = channel.probe ? (channel.scenario * 0.7 + channel.probe * 0.3) : channel.scenario;
    axes[axis] = clamp(0.5 * channel.relative + 0.3 * channel.forced + 0.2 * scenarioChannel, -1, 1);
  });
  const profiles = {};
  const architecture = {};
  Object.keys(axisMeta).forEach((axis) => {
    const meta = axisMeta[axis];
    const a = poleScores[meta.positive]; const b = poleScores[meta.negative];
    const integration = Math.min(a, b);
    const polarization = Math.abs(a - b);
    const activity = Math.round((a + b) / 2);
    const profile = integration >= 65 ? "Dual High" : Math.max(a, b) <= 40 ? "Dual Low" : polarization <= 15 ? "Balanced" : "Polarized";
    profiles[axis] = profile;
    architecture[axis] = { a, b, integration, polarization, activity, profile, relative: (a - b) / 100 };
  });
  const scenarioContext = {};
  Object.keys(axisMeta).forEach((axis) => {
    scenarioContext[axis] = {};
    ["free", "responsibility", "pressure", "uncertainty"].forEach((context) => {
      const values = items.filter((item) => item.active && item.axis === axis && item.format === "micro_sim" && item.context === context && isCompleteResponse(item, responses[item.item_id])).map((item) => microScenarioScore(item, responses[item.item_id]));
      scenarioContext[axis][context] = values.length ? avg(values) : 0;
    });
  });
  const contextSensitivity = {};
  Object.keys(axisMeta).forEach((axis) => {
    const values = Object.values(scenarioContext[axis]);
    contextSensitivity[axis] = Math.round((Math.max(...values) - Math.min(...values)) * 50);
  });
  const dynamicAxes = Object.keys(axisMeta).filter((axis) => {
    const channel = channels[axis];
    const signs = [Math.sign(channel.relative), Math.sign(channel.forced), Math.sign(channel.scenario)].filter((value) => value !== 0);
    const disagreement = signs.length >= 2 && new Set(signs).size > 1;
    const contextShift = Math.max(...Object.values(scenarioContext[axis])) - Math.min(...Object.values(scenarioContext[axis])) > 0.4;
    return Math.abs(axes[axis]) < 0.15 || disagreement || contextShift;
  });
  const quality = responseQuality(items, responses);
  const confidence = dynamicAxes.length >= 3 || quality.consistency < 55 ? "Low" : dynamicAxes.length || quality.consistency < 78 ? "Medium" : "High";
  const precisionType = Object.keys(axisMeta).map((axis) => axes[axis] > 0.15 ? axisMeta[axis].positive : axes[axis] < -0.15 ? axisMeta[axis].negative : "X").join("");
  const bestFit = Object.keys(axisMeta).map((axis) => axes[axis] >= 0 ? axisMeta[axis].positive : axisMeta[axis].negative).join("");
  return { facetScores, poleScores, channels, axes, profiles, architecture, scenarioContext, contextSensitivity, dynamicAxes, quality, confidence, precisionType, bestFit, scoringVersion: SCORING_VERSION, cognitiveFunctions: cognitiveFunctionScores(items, responses), cognitiveFacets: cognitiveFacetScores(items, responses) };
}

function microScenarioScore(item, response) {
  const selected = item.step2Options?.find((option) => option.key === response?.step2);
  if (!selected?.pole) return 0;
  return selected.pole === axisMeta[item.axis]?.positive ? 1 : selected.pole === axisMeta[item.axis]?.negative ? -1 : 0;
}

function probeScore(item, response) {
  const selected = item.options?.find((option) => option.key === response?.value);
  if (!selected?.pole) return 0;
  return selected.pole === axisMeta[item.axis]?.positive ? 1 : selected.pole === axisMeta[item.axis]?.negative ? -1 : 0;
}

function cognitiveFunctionScores(items, responses) {
  const points = {};
  items.filter((item) => item.format === "micro_sim" && isCompleteResponse(item, responses[item.item_id])).forEach((item) => {
    const selected = item.step1Options.find((option) => option.key === responses[item.item_id].step1);
    if (selected?.function_tag) points[selected.function_tag] = (points[selected.function_tag] || 0) + 2;
  });
  return points;
}

function cognitiveFacetScores(items, responses) {
  const points = {};
  items.filter((item) => item.format === "micro_sim" && isCompleteResponse(item, responses[item.item_id])).forEach((item) => {
    const selected = item.step2Options.find((option) => option.key === responses[item.item_id].step2);
    if (selected?.facet) points[selected.facet] = (points[selected.facet] || 0) + 1;
  });
  return points;
}

function responseQuality(items, responses) {
  const completed = items.filter((item) => item.active && responses[item.item_id]);
  const repeatCounts = {};
  completed.forEach((item) => { const key = responseValue(responses[item.item_id]); repeatCounts[key] = (repeatCounts[key] || 0) + 1; });
  const maxRepeat = completed.length ? Math.max(...Object.values(repeatCounts)) : 0;
  const attention = completed.length ? Math.round(clamp(100 - Math.max(0, maxRepeat / completed.length * 100 - 28) * 1.2, 45, 100)) : 0;
  const mirrors = {};
  items.filter((item) => item.active && item.mirror_group && responses[item.item_id]).forEach((item) => { (mirrors[item.mirror_group] ||= []).push(responseValue(responses[item.item_id]) * item.direction); });
  const mirrorValues = Object.values(mirrors).filter((pair) => pair.length === 2).map((pair) => 100 - Math.abs(pair[0] - pair[1]) * 25);
  const consistency = Math.round(avg(mirrorValues.length ? mirrorValues : [attention]));
  const averageResponse = avg(completed.map((item) => responses[item.item_id].responseTime || 0));
  const speedAnomaly = averageResponse < 1300;
  return { completed: completed.length, attention, consistency, averageResponse: Math.round(averageResponse), speedAnomaly };
}

function formatName(format) {
  return ({ behavior: "Behavioral evidence", forced_choice: "Forced choice", micro_sim: "Micro-simulation", cost: "Cognitive cost", probe: "Dynamic confirmation" }[format] || format);
}
function axisLabel(value, axis) {
  const meta = axisMeta[axis];
  return value > 0.15 ? meta.positive : value < -0.15 ? meta.negative : "X";
}
function contextLabel(value, axis) {
  const meta = axisMeta[axis];
  if (Math.abs(value) < 0.12) return `${meta.positive}/${meta.negative}`;
  return value > 0 ? meta.positive : meta.negative;
}
function contextZh(context) { return ({ free: "自由探索", responsibility: "責任環境", pressure: "時間壓力", uncertainty: "高度不確定" }[context] || context); }
function scoreText(value) { return `${value}/100`; }

function renderOptionButtons(options, selected, step = null) {
  return (options || []).map((option) => {
    const keyMode = step !== null || option.pole !== undefined;
    const optionValue = keyMode ? option.key : option.value;
    const isSelected = selected === optionValue;
    return `<button class="option-btn ${isSelected ? "is-selected" : ""}" data-value="${escapeHtml(optionValue)}" data-mode="${keyMode ? "key" : "number"}" ${step !== null ? `data-step="${step}"` : ""}><span class="option-label">${escapeHtml(option.label)}</span><span class="option-key">${escapeHtml(option.key)}</span></button>`;
  }).join("");
}

function renderIntro() {
  const hasProgress = !state.result && state.itemOrder.length && Object.keys(state.responses).length && state.view !== "result";
  app.innerHTML = `<section class="view intro-view">
    <div class="intro-grid">
      <div>
        <div class="eyebrow">A measurement system for people</div>
        <h1 class="intro-title">Read the <em>architecture</em><br />behind your type.</h1>
        <p class="intro-lede">這不是把你塞進四個二分字母的快問快答。系統先從 24 個人格機制觀察你的實際行為，再比較取捨與情境，最後才給出一個可保留不確定性的結果。</p>
        <div class="intro-actions">
          <button class="btn-primary" id="startButton">${hasProgress ? "繼續測驗" : "開始 80 題測量"} <span aria-hidden="true">→</span></button>
          ${hasProgress ? `<button class="btn-secondary" id="restartButton">重新開始</button>` : ""}
          <button class="btn-quiet" id="demoButton">查看示範報告</button>
        </div>
        <p class="intro-note" style="margin-top:14px">約 12–18 分鐘 · 可隨時返回 · 回覆會自動保存於此裝置</p>
      </div>
      <div class="intro-metric-panel">
        <div class="metric-panel-head"><strong>Measurement layers</strong><span>從行為到類型</span></div>
        <div class="metric-stack">
          <div class="metric-row"><label>24</label><div class="metric-track"><div class="metric-fill" style="width:100%"></div></div><small>facets</small></div>
          <div class="metric-row"><label>08</label><div class="metric-track"><div class="metric-fill" style="width:74%"></div></div><small>poles</small></div>
          <div class="metric-row"><label>04</label><div class="metric-track"><div class="metric-fill" style="width:48%"></div></div><small>axes</small></div>
          <div class="metric-row"><label>∞</label><div class="metric-track"><div class="metric-fill" style="width:29%"></div></div><small>context</small></div>
        </div>
      </div>
    </div>
    <div class="intro-divider">
      <div class="intro-stat"><b>80</b><span>核心題目</span></div>
      <div class="intro-stat"><b>+8</b><span>最多動態確認題</span></div>
      <div class="intro-stat"><b>08</b><span>獨立 pole strength</span></div>
      <div class="intro-stat"><b>v1.0</b><span>可重新計算的 scoring</span></div>
    </div>
  </section>`;
  document.getElementById("startButton").addEventListener("click", () => startTest(Boolean(hasProgress)));
  document.getElementById("demoButton").addEventListener("click", fillDemo);
  document.getElementById("restartButton")?.addEventListener("click", resetState);
}

function renderQuiz() {
  const item = state.itemOrder[state.currentIndex];
  if (!item) return renderIntro();
  const response = state.responses[item.item_id];
  const answered = state.itemOrder.filter((entry) => isCompleteResponse(entry, state.responses[entry.item_id])).length;
  const total = state.itemOrder.length;
  const format = formatName(item.format);
  const selectedValue = response?.value ?? response?.answer;
  const options = renderOptionButtons(item.options, selectedValue);
  const optionIntro = item.format === "forced_choice" ? `<span class="choice-a">A</span> ${escapeHtml(item.optionA)}<br /><span class="choice-b">B</span> ${escapeHtml(item.optionB)}` : "";
  const optionBlock = item.format === "micro_sim" ? `<div class="sim-step"><div class="sim-step-label"><b>Step 1</b><span>First Action · 第一個行動</span></div><div class="options" role="group" aria-label="Step 1 選項">${renderOptionButtons(item.step1Options, response?.step1, 1)}</div></div><div class="sim-step"><div class="sim-step-label"><b>Step 2</b><span>Primary Rationale · 最主要原因</span></div><div class="options" role="group" aria-label="Step 2 選項">${renderOptionButtons(item.step2Options, response?.step2, 2)}</div></div>` : `<div class="options" role="group" aria-label="回答選項">${options}</div>`;
  app.innerHTML = `<section class="view quiz-view">
    ${state.probeMode && state.currentIndex === state.itemOrder.length - ITEM_BANK.probes.filter((probe) => state.itemOrder.some((i) => i.item_id === probe.item_id)).length ? `<div class="welcome-banner"><span class="banner-mark">NEW</span><div><strong>加入少量確認題</strong><p>你的初步證據在部分軸向接近邊界或呈現不同情境反應，接下來最多 8 題只用來釐清這些差異。</p></div></div>` : ""}
    <div class="quiz-head"><div><h1>Core measurement</h1><p>${state.probeMode ? "Dynamic confirmation · 情境差異釐清" : "Behavioral + trade-off + context evidence"}</p></div><div class="quiz-count">${String(state.currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</div></div>
    <div class="progress-shell"><div class="progress-bar" style="width:${(answered / total) * 100}%"></div></div>
    <div class="quiz-layout">
      <article class="question-card">
        <div class="question-meta"><span class="question-format">${escapeHtml(format)}</span><span>evidence · ${String(state.currentIndex + 1).padStart(2, "0")}</span></div>
        <p class="question-context">${item.format === "behavior" ? "請以最近真實行為回答" : item.format === "forced_choice" ? "兩種方法都有優點" : item.format === "micro_sim" ? "先選第一個行動，再選最主要原因" : item.format === "cost" ? "請評估這個心理歷程對你的自然程度" : "釐清你的情境敏感度"}</p>
        <h2 class="question-title">${escapeHtml(item.stem)}</h2>
        ${item.format === "forced_choice" ? `<p class="question-anchor choice-copy">${optionIntro}</p>` : item.format === "micro_sim" ? `<p class="question-anchor">${escapeHtml(item.anchor)}</p>` : `<p class="question-anchor">${escapeHtml(item.anchor)}</p>`}
        ${optionBlock}
        <div class="quiz-foot"><button class="btn-quiet" id="prevButton" ${state.currentIndex === 0 ? "disabled" : ""}>← 上一題</button><span class="keyboard-note">可使用 1–5 選擇 · Enter 下一題</span><button class="btn-primary" id="nextButton">${state.currentIndex === total - 1 ? (state.probeMode ? "查看結果" : "完成核心測量") : "下一題 →"}</button></div>
      </article>
      <aside class="quiz-side">
        <div class="side-panel"><h2>Evidence mix</h2><p>每一軸都由三種證據組成。完成後系統才會計算 relative preference，不會由單題決定類型。</p></div>
        <div class="side-panel"><h2>Progress</h2><div class="side-progress"><div><span>已回答</span><strong>${answered} / ${total}</strong></div><div><span>核心題</span><strong>${Math.min(answered, 80)} / 80</strong></div><div><span>保存狀態</span><strong>LOCAL</strong></div></div></div>
        <div class="side-panel"><h2>Axis signal</h2><div class="axis-list">${renderLiveAxes()}</div></div>
      </aside>
    </div>
  </section>`;
  app.querySelectorAll(".option-btn").forEach((button) => button.addEventListener("click", () => {
    const raw = button.dataset.value;
    const value = button.dataset.mode === "key" ? raw : raw === "NA" ? null : Number(raw);
    answerCurrent(value, button.dataset.step ? Number(button.dataset.step) : null);
  }));
  document.getElementById("nextButton").addEventListener("click", moveNext);
  document.getElementById("prevButton").addEventListener("click", movePrevious);
  setTimeout(() => app.focus(), 0);
}

function renderLiveAxes() {
  const scores = state.initialScoring?.axes || {};
  return Object.keys(axisMeta).map((axis) => `<div class="axis-mini"><span>${axis}</span><span>${scores[axis] !== undefined ? fmt(scores[axis]) : "—"}</span></div>`).join("");
}

function renderResults() {
  const result = state.result || scoreAll(state.itemOrder, state.responses);
  const topFacets = facetMeta.map((facet) => ({ ...facet, score: result.facetScores[facet.code] })).sort((a, b) => b.score - a.score).slice(0, 3);
  const bestLabel = result.bestFit;
  const confidenceCopy = result.confidence === "High" ? "三種主要證據方向大致一致，且沒有顯著的邊界軸。" : result.confidence === "Medium" ? "部分證據來源或軸向仍接近邊界；請把情境差異一起讀。" : "多條軸出現邊界或證據分歧，這份結果更適合作為探索起點。";
  app.innerHTML = `<section class="view result-view">
    <div class="result-hero">
      <div><div class="result-kicker">Your measurement profile · ${escapeHtml(result.scoringVersion)}</div><h1 class="result-title">${escapeHtml(bestLabel)}</h1><p class="result-subtitle">Best-fit MBTI 是 <b>${escapeHtml(bestLabel)}</b>。更精確的 profile 是 <b>${escapeHtml(result.precisionType)}</b>；X 表示該軸在目前證據下沒有明顯單側偏好。</p><div class="result-actions"><button class="btn-primary" id="restartResult">重新測量</button><button class="btn-secondary" id="printResult">列印報告</button></div></div>
      <div class="confidence-box"><div><div class="confidence-label">Measurement confidence</div><div class="confidence-value">${escapeHtml(result.confidence)}</div></div><p>${escapeHtml(confidenceCopy)}<br />這不是準確率，也不代表人格優劣。</p></div>
    </div>
    <section class="result-section"><div class="section-heading"><h2>Architecture layer · 8 poles</h2><p>八個分數彼此獨立，不假設對立兩端相加等於 100。</p></div><div class="poles-grid">${renderPoleCards(result)}</div></section>
    <section class="result-section"><div class="section-heading"><h2>Facet layer · 24 mechanisms</h2><p>展開每一條軸，查看形成 pole strength 的底層機制。</p></div>${renderFacetGroups(result)}</section>
    <section class="result-section"><div class="section-heading"><h2>Axis architecture</h2><p>Relative preference、integration、polarization 與 activity 同時保留。</p></div><div class="architecture-grid">${renderArchitecture(result)}</div></section>
    <section class="result-section"><div class="section-heading"><h2>Context map</h2><p>同一條軸在不同約束下可能採取不同表現。</p></div><div class="context-wrap"><table class="context-table"><thead><tr><th>Environment</th><th>EI</th><th>SN</th><th>TF</th><th>JP</th></tr></thead><tbody>${["free", "responsibility", "pressure", "uncertainty"].map((context) => `<tr><td>${contextZh(context)}</td>${Object.keys(axisMeta).map((axis) => `<td><span class="context-badge ${Math.abs(result.scenarioContext[axis][context]) < .12 ? "" : result.scenarioContext[axis][context] > 0 ? "accent" : "coral"}">${contextLabel(result.scenarioContext[axis][context], axis)}</span></td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="intro-note" style="margin-top:11px">Context sensitivity：${Object.entries(result.contextSensitivity).map(([axis, value]) => `${axis} ${value}`).join(" · ")}（數值越高，情境差異越明顯）</p></section>
    <section class="result-section"><div class="section-heading"><h2>Most distinctive patterns</h2><p>由你的 facet 分數生成，不套用 generic type stereotype。</p></div><div class="distinctive"><div class="trait-list">${topFacets.map((facet, index) => `<div class="trait-item"><span class="trait-index">0${index + 1}</span><div><strong>${escapeHtml(facet.zh)}</strong><p>${escapeHtml(facet.desc)} 目前分數為 ${facet.score}/100，這個模式在你的回覆中出現得相對突出。</p></div></div>`).join("")}</div><div class="method-note"><h3>How to read this report</h3><p>先看八個 pole 的高低，再看每組軸的 profile。Dual High 代表兩種模式都很強；Balanced 只是接近，不代表低活躍。你的回覆顯示的是目前測量到的模式，不是固定身份。</p><p><code>Behavior 40% · Forced choice 30% · Scenario 30%</code></p></div></div></section>
    <section class="result-section"><div class="section-heading"><h2>Response quality</h2><p>只影響 Measurement Confidence，不直接改寫人格分數。</p></div><div class="architecture-grid"><div class="architecture-card"><h3>Consistency</h3><div class="arch-score"><b>${result.quality.consistency}</b> / 100</div><p class="arch-summary">相同機制的不同表述是否大致一致。</p></div><div class="architecture-card"><h3>Attention</h3><div class="arch-score"><b>${result.quality.attention}</b> / 100</div><p class="arch-summary">是否出現大量完全相同的選項。</p></div><div class="architecture-card"><h3>Response time</h3><div class="arch-score"><b>${(result.quality.averageResponse / 1000).toFixed(1)}s</b></div><p class="arch-summary">${result.quality.speedAnomaly ? "速度偏快，僅降低結果信心。" : "沒有極端快速作答訊號。"}</p></div><div class="architecture-card"><h3>Scoring record</h3><div class="arch-score"><b>${result.scoringVersion}</b></div><p class="arch-summary">每一題回答與時間戳都保留，可在未來重新計算。</p></div></div></section>
  </section>`;
  document.getElementById("restartResult").addEventListener("click", resetState);
  document.getElementById("printResult").addEventListener("click", () => window.print());
}

function renderPoleCards(result) {
  return Object.keys(poleMeta).map((pole) => `<div class="pole-card"><div class="pole-code">${pole}</div><div class="pole-name">${escapeHtml(poleMeta[pole].name)}<br /><span style="color:#7c887c">${escapeHtml(poleMeta[pole].zh)}</span></div><div class="pole-score">${result.poleScores[pole]}<small> / 100</small></div></div>`).join("");
}

function renderFacetGroups(result) {
  return Object.keys(axisMeta).map((axis) => {
    const meta = axisMeta[axis];
    const facets = facetMeta.filter((facet) => facet.axis === axis);
    return `<details class="facet-axis" ${axis === "SN" ? "open" : ""}><summary><span class="facet-axis-code">${axis}</span><span class="facet-axis-title">${escapeHtml(meta.title)}</span><span class="facet-axis-total">${result.poleScores[meta.positive]} / ${result.poleScores[meta.negative]}</span></summary><div class="facet-list">${facets.map((facet) => `<div class="facet-row"><span>${escapeHtml(facet.zh)}<br /><small style="color:#899287">${escapeHtml(facet.name)}</small></span><strong>${result.facetScores[facet.code]}</strong><div class="facet-bar"><i style="width:${result.facetScores[facet.code]}%"></i></div></div>`).join("")}</div></details>`;
  }).join("");
}

function renderArchitecture(result) {
  return Object.keys(axisMeta).map((axis) => {
    const meta = axisMeta[axis]; const arch = result.architecture[axis]; const axisScore = result.axes[axis];
    const activeSegments = Math.round(Math.abs(axisScore) * 5);
    const meter = Array.from({ length: 5 }, (_, index) => `<span class="${index < activeSegments ? (axisScore >= 0 ? "active-a" : "active-b") : ""}"></span>`).join("");
    const mode = arch.profile === "Dual High" ? "兩種模式都高" : arch.profile === "Dual Low" ? "兩種模式都低" : arch.profile === "Balanced" ? "接近且平衡" : "單側較突出";
    return `<div class="architecture-card"><h3>${axis} · ${escapeHtml(meta.title)}</h3><div class="arch-score"><b>${escapeHtml(axisLabel(axisScore, axis))}</b> ${fmt(axisScore)} relative</div><div class="arch-meter" aria-label="relative preference">${meter}</div><div class="arch-details"><div><small>${meta.positive}</small><strong>${arch.a}</strong></div><div><small>${meta.negative}</small><strong>${arch.b}</strong></div><div><small>integration</small><strong>${arch.integration}</strong></div></div><p class="arch-summary">${mode} · polarization ${arch.polarization} · activity ${arch.activity}</p></div>`;
  }).join("");
}

function render() {
  updateSavedState();
  if (state.view === "quiz") renderQuiz();
  else if (state.view === "result") renderResults();
  else renderIntro();
}

document.getElementById("brandButton").addEventListener("click", () => { state.view = "intro"; persist(); render(); });
document.addEventListener("keydown", (event) => {
  if (state.view !== "quiz") return;
  if (/^[1-5]$/.test(event.key)) {
    const item = state.itemOrder[state.currentIndex];
    if (item?.options[Number(event.key) - 1]) answerCurrent(item.options[Number(event.key) - 1].value);
  }
  if (event.key === "Enter") moveNext();
  if (event.key === "ArrowLeft") movePrevious();
});

restore();
render();
hydrateQuestionBank();
