/* 喜茶手绘本插图。
   版式约定：标题 (36,40)；朱砂印 (655,50)，图元 x<=600，不进印；
   手写体只写在 text.h 上。 */
(function illus() {
  const ink = "#17382C";
  const stamp = "#A33B32";
  const foam = "#F7F2E7";
  const soft = "rgba(31,74,58,.12)";

  function cup(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 40c1 18 5 34 22 35 18 0 26-14 28-35" stroke-width="1.7"/>
      <ellipse cx="36" cy="40" rx="22" ry="6.5" stroke-width="1.5"/>
      <path d="M16 40c0-10 7-18 20-19 4-7 18-8 24 0 6-2 14 4 12 14-1 4-6 7-13 6" fill="${foam}" stroke-width="1.4"/>
      <path d="M46 10l5 30" stroke-width="1.6"/>
      <path d="M18 58c6 5 32 6 40-1" stroke-width="1" opacity=".4"/>
    </g>`;
  }
  function seal(x, y, word) {
    return `<g transform="translate(${x} ${y})" fill="none">
      <ellipse cx="0" cy="0" rx="36" ry="34" stroke="${stamp}" stroke-width="2"/>
      <ellipse cx="0" cy="0" rx="29" ry="27" stroke="${stamp}" stroke-width="0.9" opacity=".65"/>
      <text class="h" x="0" y="10" text-anchor="middle" font-size="26" fill="${stamp}">${word}</text>
    </g>`;
  }
  function arrow(x1, y1, x2, y2) {
    return `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${ink}" stroke-width="1.3" stroke-dasharray="5 6" stroke-linecap="round"/>`;
  }
  function title(t) {
    return `<text class="h" x="36" y="40" font-size="22" fill="${ink}">${t}</text>`;
  }

  const sketches = {
    journey: `<svg viewBox="0 0 720 520" role="img" aria-label="今天天气真，写出下一个字好">
      ${title("今天天气真 ？")}
      ${seal(655, 50, "见")}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <rect x="36" y="86" width="168" height="210" rx="10" fill="${foam}"/>
        <rect x="216" y="86" width="128" height="210" rx="10" fill="${soft}"/>
        <rect x="356" y="86" width="128" height="210" rx="10" fill="${foam}"/>
        <rect x="496" y="86" width="104" height="210" rx="10" fill="${soft}"/>
      </g>
      <text class="h" x="120" y="118" text-anchor="middle" font-size="16" fill="${stamp}">1</text>
      <text class="h" x="280" y="118" text-anchor="middle" font-size="16" fill="${stamp}">2</text>
      <text class="h" x="420" y="118" text-anchor="middle" font-size="16" fill="${stamp}">3</text>
      <text class="h" x="548" y="118" text-anchor="middle" font-size="16" fill="${stamp}">4</text>
      <g fill="none" stroke="${ink}" stroke-width="1.4">
        <rect x="46" y="148" width="24" height="36" rx="4"/>
        <rect x="74" y="148" width="24" height="36" rx="4"/>
        <rect x="102" y="148" width="24" height="36" rx="4"/>
        <rect x="130" y="148" width="24" height="36" rx="4"/>
        <rect x="158" y="148" width="24" height="36" rx="4"/>
        <text class="h" x="58" y="174" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">今</text>
        <text class="h" x="86" y="174" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">天</text>
        <text class="h" x="114" y="174" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">天</text>
        <text class="h" x="142" y="174" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">气</text>
        <text class="h" x="170" y="174" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">真</text>
      </g>
      <text class="h" x="120" y="268" text-anchor="middle" font-size="16" fill="${ink}">先读这一句</text>
      <g fill="none" stroke="${ink}" stroke-width="1.4">
        <circle cx="248" cy="168" r="3.2" fill="${ink}" stroke="none"/>
        <circle cx="280" cy="168" r="3.2" fill="${ink}" stroke="none"/>
        <circle cx="312" cy="168" r="3.2" fill="${ink}" stroke="none"/>
        <circle cx="248" cy="198" r="3.2" fill="${ink}" stroke="none"/>
        <circle cx="280" cy="198" r="3.2" fill="${ink}" stroke="none"/>
        <circle cx="312" cy="198" r="3.2" fill="${ink}" stroke="none"/>
        <circle cx="248" cy="228" r="3.2" fill="${ink}" stroke="none"/>
        <circle cx="280" cy="228" r="3.2" fill="${ink}" stroke="none"/>
        <circle cx="312" cy="228" r="3.2" fill="${ink}" stroke="none"/>
      </g>
      <text class="h" x="280" y="268" text-anchor="middle" font-size="16" fill="${ink}">每个字变成数</text>
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <text class="h" x="420" y="168" text-anchor="middle" font-size="20" fill="${ink}" stroke="none">天气</text>
        <text class="h" x="420" y="228" text-anchor="middle" font-size="20" fill="${ink}" stroke="none">真</text>
        <path d="M420 204 C 420 176, 420 168, 420 168" stroke-width="2"/>
        <path d="M414 176 l6 -8 6 8" stroke-width="1.6"/>
      </g>
      <text class="h" x="420" y="268" text-anchor="middle" font-size="16" fill="${ink}">「真」去问「天气」</text>
      <g fill="none" stroke="${ink}" stroke-width="1.6">
        <rect x="518" y="156" width="60" height="60" rx="8" fill="${foam}"/>
        <text class="h" x="548" y="198" text-anchor="middle" font-size="28" fill="${ink}" stroke="none">好</text>
      </g>
      <text class="h" x="548" y="268" text-anchor="middle" font-size="16" fill="${ink}">写出下一个</text>
      ${arrow(204, 190, 216, 190)}
      ${arrow(344, 190, 356, 190)}
      ${arrow(484, 190, 496, 190)}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <path d="M90 390 A28 28 0 1 1 62 390"/>
        <path d="M86 374 l4 16 12-6"/>
      </g>
      <text class="h" x="130" y="398" font-size="18" fill="${ink}">不够就再走一圈</text>
      <text class="h" x="36" y="488" font-size="18" fill="${ink}">「今」是这句话的头。「好」是它补上的下一个字。</text>
    </svg>`,
    valley: `<svg viewBox="0 0 720 340" role="img" aria-label="蒙眼顺着坡走到谷底">
      ${title("往低处走")}
      ${seal(655, 50, "试")}
      <g fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round">
        <path d="M70 90 C 180 90, 250 250, 380 250 S 520 110, 600 120"/>
      </g>
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <circle cx="210" cy="118" r="8"/>
        <path d="M210 126 v22"/>
        <path d="M210 140 l-11 12 M210 140 l12 10"/>
        <path d="M210 148 l-8 16 M210 148 l10 16"/>
      </g>
      <text class="h" x="228" y="114" font-size="16" fill="${ink}">蒙着眼，顺着坡</text>
      <text class="h" x="300" y="300" font-size="18" fill="${ink}">谷底 = 错得最少的地方</text>
    </svg>`,
    layers: `<svg viewBox="0 0 720 340" role="img" aria-label="ReLU：原点左侧归零，右侧沿 y=x">
      ${title("一条直线不够")}
      ${seal(655, 50, "叠")}
      <g fill="none" stroke="${ink}" stroke-linecap="round">
        <path d="M56 210 L270 210" stroke-width="1.2"/>
        <path d="M265 206 l8 4 -8 4" stroke-width="1.2"/>
        <path d="M150 292 L150 78" stroke-width="1.2"/>
        <path d="M146 86 l4 -8 4 8" stroke-width="1.2"/>
        <path d="M70 290 L230 130" stroke-width="1.2" opacity=".35"/>
        <path d="M70 210 L150 210 L230 130" stroke-width="2.2"/>
        <circle cx="150" cy="210" r="4.5" fill="${ink}" stroke="none"/>
      </g>
      <text class="h" x="136" y="228" font-size="14" fill="${ink}">O</text>
      <text class="h" x="258" y="228" font-size="14" fill="${ink}">x</text>
      <text class="h" x="160" y="92" font-size="14" fill="${ink}">y</text>
      <text class="h" x="188" y="148" font-size="14" fill="${ink}">y = x</text>
      <text class="h" x="150" y="318" text-anchor="middle" font-size="16" fill="${ink}">ReLU：原点左边贴横轴</text>
      <g fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M330 230 L590 230" stroke-width="1.2" opacity=".4"/>
        <path d="M330 230 L370 230 L410 150 L455 185 L510 125 L555 165 L590 145" stroke-width="2.2"/>
      </g>
      <text class="h" x="460" y="318" text-anchor="middle" font-size="16" fill="${ink}">叠几次就能画出弯的</text>
    </svg>`,
    tokens: `<svg viewBox="0 0 720 340" role="img" aria-label="把字切成块再变成坐标">
      ${title("把字变成坐标")}
      ${seal(655, 50, "切")}
      ${arrow(150, 180, 210, 180)}
      ${arrow(390, 180, 450, 180)}
      <g fill="none" stroke="${ink}" stroke-width="1.7" stroke-linecap="round">
        <circle cx="90" cy="180" r="42"/>
        <text class="h" x="90" y="190" text-anchor="middle" font-size="28" fill="${ink}" stroke="none">注</text>
      </g>
      <text class="h" x="90" y="248" text-anchor="middle" font-size="18" fill="${ink}">单字</text>
      <g fill="none" stroke="${ink}" stroke-width="1.5">
        <rect x="226" y="136" width="140" height="88" rx="8" fill="${soft}"/>
        <text class="h" x="296" y="190" text-anchor="middle" font-size="24" fill="${ink}" stroke="none">注意力</text>
      </g>
      <text class="h" x="296" y="248" text-anchor="middle" font-size="18" fill="${ink}">常见词整块留着</text>
      <g fill="none" stroke="${ink}" stroke-width="1.5">
        <rect x="468" y="136" width="96" height="88" rx="8" fill="${foam}"/>
        <circle cx="492" cy="160" r="3" fill="${ink}" stroke="none"/>
        <circle cx="516" cy="160" r="3" fill="${ink}" stroke="none"/>
        <circle cx="540" cy="160" r="3" fill="${ink}" stroke="none"/>
        <circle cx="492" cy="182" r="3" fill="${ink}" stroke="none"/>
        <circle cx="516" cy="182" r="3" fill="${ink}" stroke="none"/>
        <circle cx="540" cy="182" r="3" fill="${ink}" stroke="none"/>
        <circle cx="492" cy="204" r="3" fill="${ink}" stroke="none"/>
        <circle cx="516" cy="204" r="3" fill="${ink}" stroke="none"/>
        <circle cx="540" cy="204" r="3" fill="${ink}" stroke="none"/>
      </g>
      <text class="h" x="516" y="248" text-anchor="middle" font-size="18" fill="${ink}">生词再拆开</text>
    </svg>`,

    attn: `<svg viewBox="0 0 720 340" role="img" aria-label="它回头去看小猫">
      ${title("每个字去问所有字")}
      ${seal(655, 50, "看")}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <text class="h" x="90" y="150" font-size="28" fill="${ink}" stroke="none">小</text>
        <text class="h" x="160" y="150" font-size="28" fill="${ink}" stroke="none">猫</text>
        <text class="h" x="90" y="250" font-size="28" fill="${ink}" stroke="none">它</text>
        <text class="h" x="160" y="250" font-size="28" fill="${ink}" stroke="none">饿</text>
        <text class="h" x="230" y="250" font-size="28" fill="${ink}" stroke="none">了</text>
        <path d="M104 218 C 104 180, 168 168, 176 158" stroke-width="2"/>
        <path d="M168 154l8 2 -2 8" stroke-width="1.6"/>
      </g>
      <text class="h" x="360" y="150" font-size="20" fill="${ink}">「它」在问：我是谁？</text>
      <text class="h" x="360" y="190" font-size="20" fill="${ink}">Q 提问 · K 标签 · V 内容</text>
      <text class="h" x="360" y="250" font-size="18" fill="${ink}">箭头越粗，看得越紧</text>
    </svg>`,

    stack: `<svg viewBox="0 0 720 340" role="img" aria-label="同样形状的一层层叠上去">
      ${title("同一副模具，叠九十六层")}
      ${seal(655, 50, "层")}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <rect x="80" y="230" width="200" height="48" rx="5" fill="${soft}"/>
        <rect x="100" y="178" width="200" height="48" rx="5" fill="${foam}"/>
        <rect x="120" y="126" width="200" height="48" rx="5" fill="${soft}"/>
        <rect x="140" y="74" width="200" height="48" rx="5" fill="${foam}"/>
      </g>
      <text class="h" x="400" y="160" font-size="18" fill="${ink}">每一层进出同一个形状</text>
      <text class="h" x="400" y="200" font-size="18" fill="${ink}">所以能往上无限砌</text>
    </svg>`,

    sample: `<svg viewBox="0 0 720 340" role="img" aria-label="从一堆分数里挑一个字">
      ${title("今天天气真 ____")}
      ${seal(655, 50, "挑")}
      <g fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round">
        <rect x="70" y="220" width="32" height="60" fill="${soft}"/>
        <rect x="118" y="170" width="32" height="110" fill="${soft}"/>
        <rect x="166" y="100" width="32" height="180" fill="${ink}" opacity=".16"/>
        <rect x="214" y="200" width="32" height="80" fill="${soft}"/>
        <rect x="262" y="240" width="32" height="40" fill="${soft}"/>
      </g>
      <text class="h" x="182" y="90" text-anchor="middle" font-size="22" fill="${stamp}">好</text>
      <text class="h" x="86" y="304" text-anchor="middle" font-size="16" fill="${ink}">的</text>
      <text class="h" x="134" y="304" text-anchor="middle" font-size="16" fill="${ink}">很</text>
      <text class="h" x="182" y="304" text-anchor="middle" font-size="16" fill="${ink}">好</text>
      <text class="h" x="230" y="304" text-anchor="middle" font-size="16" fill="${ink}">差</text>
      <text class="h" x="278" y="304" text-anchor="middle" font-size="16" fill="${ink}">啊</text>
      <text class="h" x="380" y="150" font-size="18" fill="${ink}">温度低：总挑最高的，死板</text>
      <text class="h" x="380" y="190" font-size="18" fill="${ink}">温度高：什么都可能，胡来</text>
      <text class="h" x="380" y="230" font-size="18" fill="${ink}">Top-P：只从够格的里面抽</text>
    </svg>`,

    corpus: `<svg viewBox="0 0 720 340" role="img" aria-label="海量文本上预测下一个词">
      ${title("一件最简单的事，做几万亿次")}
      ${seal(655, 50, "学")}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <rect x="70" y="110" width="72" height="96" rx="4" fill="${foam}"/>
        <rect x="160" y="100" width="72" height="106" rx="4" fill="${soft}"/>
        <rect x="250" y="108" width="72" height="98" rx="4" fill="${foam}"/>
        <rect x="340" y="96" width="72" height="110" rx="4" fill="${soft}"/>
        <path d="M86 132 h40 M86 148 h28 M86 164 h44" opacity=".55"/>
        <path d="M176 124 h40 M176 140 h44 M176 156 h24" opacity=".55"/>
        <path d="M266 130 h40 M266 146 h36" opacity=".55"/>
        <path d="M356 118 h40 M356 134 h28 M356 150 h44" opacity=".55"/>
      </g>
      <text class="h" x="70" y="250" font-size="18" fill="${ink}">语法、常识、推理，都从「下一个词是什么」里挤出来</text>
    </svg>`,

    lora: `<svg viewBox="0 0 720 340" role="img" aria-label="瘦矩阵代替胖矩阵">
      ${title("原权重冻住，旁边加两片薄的")}
      ${seal(655, 50, "瘦")}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <rect x="70" y="90" width="150" height="150" fill="${soft}"/>
        <text class="h" x="145" y="176" text-anchor="middle" font-size="28" fill="${ink}" stroke="none">W</text>
        <text class="h" x="250" y="176" font-size="28" fill="${ink}" stroke="none">+</text>
        <rect x="310" y="90" width="32" height="150" fill="${foam}"/>
        <rect x="366" y="152" width="150" height="32" fill="${foam}"/>
        <text class="h" x="326" y="176" font-size="18" fill="${ink}" stroke="none">B</text>
        <text class="h" x="430" y="174" font-size="18" fill="${ink}" stroke="none">A</text>
      </g>
      <text class="h" x="70" y="280" font-size="18" fill="${ink}">训练的只是 BA。推理时再焊回 W，不拖慢。</text>
    </svg>`,

    prefer: `<svg viewBox="0 0 720 340" role="img" aria-label="两份回答里留下更好的那份">
      ${title("说得出话，还要说得合心意")}
      ${seal(655, 50, "选")}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <rect x="80" y="100" width="190" height="140" rx="6" fill="${foam}"/>
        <rect x="330" y="100" width="190" height="140" rx="6" fill="${soft}"/>
        <path d="M104 140 h140 M104 164 h108 M104 188 h128" opacity=".45"/>
        <path d="M354 140 h140 M354 164 h88 M354 188 h120" opacity=".45"/>
        <ellipse cx="236" cy="128" rx="22" ry="20" stroke="${stamp}" stroke-width="1.6"/>
        <text class="h" x="236" y="134" text-anchor="middle" font-size="16" fill="${stamp}" stroke="none">好</text>
      </g>
      <text class="h" x="175" y="270" text-anchor="middle" font-size="18" fill="${ink}">留下的</text>
      <text class="h" x="425" y="270" text-anchor="middle" font-size="18" fill="${ink}">淘汰的</text>
    </svg>`,

    graph: `<svg viewBox="0 0 720 340" role="img" aria-label="想、做、看，不行就回头">
      ${title("链走到底，图可以回头")}
      ${seal(655, 50, "办")}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <circle cx="120" cy="170" r="34" fill="${soft}"/>
        <circle cx="300" cy="170" r="34" fill="${foam}"/>
        <circle cx="480" cy="170" r="34" fill="${soft}"/>
        <path d="M154 170 h112"/>
        <path d="M334 170 h112"/>
        <path d="M480 204 C 480 268, 120 268, 120 204"/>
        <path d="M132 216 l-14 8 16 4"/>
      </g>
      <text class="h" x="120" y="176" text-anchor="middle" font-size="18" fill="${ink}" stroke="none">想</text>
      <text class="h" x="300" y="176" text-anchor="middle" font-size="18" fill="${ink}" stroke="none">做</text>
      <text class="h" x="480" y="176" text-anchor="middle" font-size="18" fill="${ink}" stroke="none">看</text>
      <text class="h" x="300" y="310" text-anchor="middle" font-size="18" fill="${ink}">不行就重来。循环在链里画不出来。</text>
    </svg>`,

    lookback: `<svg viewBox="0 0 720 340" role="img" aria-label="回头看这一条线">
      ${title("从头到尾只有一条线")}
      ${seal(655, 50, "收")}
      <text class="h" x="230" y="150" font-size="20" fill="${ink}">猜错了就改一点</text>
      <text class="h" x="230" y="190" font-size="20" fill="${ink}">看见别人，写下下一个</text>
      <text class="h" x="230" y="230" font-size="20" fill="${ink}">不够合心意，就再对齐</text>
      <text class="h" x="230" y="270" font-size="20" fill="${ink}">一件事办不完，就循环</text>
    </svg>`,

    mathhero: `<svg viewBox="0 0 720 520" role="img" aria-label="向量、谷底、概率">
      ${title("符号是路标，不是墙")}
      ${seal(655, 50, "算")}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <path d="M80 340 L80 140"/>
        <path d="M80 340 L280 340"/>
        <path d="M80 340 L210 180" stroke-width="2"/>
        <path d="M210 180 l-16 20 M210 180 l-22 4"/>
      </g>
      <text class="h" x="222" y="170" font-size="18" fill="${ink}">向量</text>
      <g fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round">
        <path d="M320 330 C 370 160, 490 160, 560 330"/>
        <circle cx="422" cy="198" r="7" fill="${ink}" stroke="none"/>
      </g>
      <text class="h" x="430" y="360" text-anchor="middle" font-size="18" fill="${ink}">往低处走</text>
      <g fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round">
        <rect x="80" y="400" width="22" height="50" fill="${soft}"/>
        <rect x="112" y="380" width="22" height="70" fill="${soft}"/>
        <rect x="144" y="360" width="22" height="90" fill="${ink}" opacity=".16"/>
        <rect x="176" y="390" width="22" height="60" fill="${soft}"/>
      </g>
      <text class="h" x="230" y="430" font-size="18" fill="${ink}">分数变成概率</text>
    </svg>`,

    mvec: `<svg viewBox="0 0 720 340" role="img" aria-label="向量是有方向的箭头">
      ${title("向量：既有方向，也有长短")}
      ${seal(655, 50, "向")}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <path d="M80 260 L80 80"/>
        <path d="M80 260 L300 260"/>
        <path d="M80 260 L240 120" stroke-width="2.1"/>
        <path d="M240 120 l-18 18 M240 120 l-22 2"/>
        <circle cx="80" cy="260" r="4" fill="${ink}" stroke="none"/>
      </g>
      <text class="h" x="250" y="112" font-size="18" fill="${ink}">箭头指向哪里</text>
      <text class="h" x="330" y="200" font-size="18" fill="${ink}">两个箭头越像，内积越大</text>
      <text class="h" x="80" y="310" font-size="18" fill="${ink}">词向量就是把意思放进这种箭头里</text>
    </svg>`,

    mprob: `<svg viewBox="0 0 720 340" role="img" aria-label="分数经过 softmax 变成概率">
      ${title("分数要加成一，才叫概率")}
      ${seal(655, 50, "率")}
      <g fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round">
        <rect x="80" y="150" width="36" height="120" fill="${soft}"/>
        <rect x="130" y="110" width="36" height="160" fill="${ink}" opacity=".16"/>
        <rect x="180" y="180" width="36" height="90" fill="${soft}"/>
        <text class="h" x="98" y="290" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">2</text>
        <text class="h" x="148" y="290" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">5</text>
        <text class="h" x="198" y="290" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">1</text>
      </g>
      ${arrow(240, 200, 300, 200)}
      <text class="h" x="248" y="186" font-size="16" fill="${ink}">softmax</text>
      <g fill="none" stroke="${ink}" stroke-width="1.4">
        <rect x="320" y="170" width="36" height="100" fill="${soft}"/>
        <rect x="370" y="120" width="36" height="150" fill="${ink}" opacity=".16"/>
        <rect x="420" y="200" width="36" height="70" fill="${soft}"/>
        <text class="h" x="338" y="290" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">.12</text>
        <text class="h" x="388" y="290" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">.84</text>
        <text class="h" x="438" y="290" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">.04</text>
      </g>
      <text class="h" x="80" y="322" font-size="16" fill="${ink}">三根加起来是 1。模型写下一个字，就是在这上面抽。</text>
    </svg>`,

    mgrad: `<svg viewBox="0 0 720 340" role="img" aria-label="梯度指向最陡的下坡">
      ${title("梯度：脚下哪边更陡")}
      ${seal(655, 50, "导")}
      <g fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round">
        <path d="M70 110 C 180 110, 250 250, 380 250 S 520 120, 600 130"/>
        <circle cx="250" cy="168" r="7" fill="${ink}" stroke="none"/>
        <path d="M250 168 L 330 230" stroke-width="1.5"/>
        <path d="M330 230 l-16 -4 4 16"/>
      </g>
      <text class="h" x="256" y="150" font-size="16" fill="${ink}">现在这里</text>
      <text class="h" x="340" y="250" font-size="16" fill="${ink}">顺着最陡的坡走一步</text>
    </svg>`,

    mchain: `<svg viewBox="0 0 720 340" role="img" aria-label="链式法则一层一层往回传">
      ${title("链式法则：一层一层往回传")}
      ${seal(655, 50, "链")}
      ${arrow(190, 170, 240, 170)}
      ${arrow(370, 170, 420, 170)}
      <g fill="none" stroke="${ink}" stroke-width="1.5">
        <rect x="70" y="130" width="110" height="80" rx="8" fill="${soft}"/>
        <rect x="250" y="130" width="110" height="80" rx="8" fill="${foam}"/>
        <rect x="430" y="130" width="110" height="80" rx="8" fill="${soft}"/>
        <text class="h" x="125" y="178" text-anchor="middle" font-size="22" fill="${ink}" stroke="none">x</text>
        <text class="h" x="305" y="178" text-anchor="middle" font-size="22" fill="${ink}" stroke="none">f</text>
        <text class="h" x="485" y="178" text-anchor="middle" font-size="22" fill="${ink}" stroke="none">g</text>
      </g>
      <path d="M485 214 C 485 270, 125 270, 125 214" fill="none" stroke="${ink}" stroke-width="1.4" stroke-dasharray="5 6"/>
      <path d="M137 226 l-14 8 16 4"/>
      <text class="h" x="70" y="310" font-size="18" fill="${ink}">前面错了，误差顺着箭头往回乘回去</text>
    </svg>`,

    basichero: `<svg viewBox="0 0 720 520" role="img" aria-label="目录、命令、代码、箱子">
      ${title("先把机器打通")}
      ${seal(655, 50, "通")}
      ${arrow(150, 220, 200, 220)}
      ${arrow(330, 220, 380, 220)}
      ${arrow(510, 220, 545, 220)}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <path d="M60 180 h70 l12 14 h-82z" fill="${soft}"/>
        <path d="M60 194 h82 v70 h-82z"/>
        <path d="M72 208 h40 M72 224 h28"/>
      </g>
      <text class="h" x="100" y="292" text-anchor="middle" font-size="18" fill="${ink}">目录</text>
      <g fill="none" stroke="${ink}" stroke-width="1.6">
        <rect x="214" y="176" width="100" height="90" rx="8" fill="${foam}"/>
        <text class="h" x="236" y="230" font-size="26" fill="${ink}" stroke="none">$</text>
        <path d="M268 222 h28"/>
      </g>
      <text class="h" x="264" y="292" text-anchor="middle" font-size="18" fill="${ink}">命令</text>
      <g fill="none" stroke="${ink}" stroke-width="1.5">
        <rect x="396" y="176" width="96" height="90" rx="8"/>
        <path d="M412 204 h64 M412 222 h44"/>
      </g>
      <text class="h" x="444" y="292" text-anchor="middle" font-size="18" fill="${ink}">代码</text>
      <g fill="none" stroke="${ink}" stroke-width="1.6">
        <path d="M560 176 l36 14 v70 l-36-14z" fill="${soft}"/>
        <path d="M560 176 v70 l36 14 v-70"/>
        <path d="M560 212 h36"/>
      </g>
      <text class="h" x="586" y="292" text-anchor="middle" font-size="18" fill="${ink}">箱子</text>
      <text class="h" x="36" y="488" font-size="18" fill="${ink}">目录 → 命令 → 代码 → 装箱带走</text>
    </svg>`,

    btree: `<svg viewBox="0 0 720 340" role="img" aria-label="Linux 是一棵从根长出来的树">
      ${title("没有盘符，只有一棵树")}
      ${seal(655, 50, "根")}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <circle cx="200" cy="90" r="22" fill="${soft}"/>
        <text class="h" x="200" y="96" text-anchor="middle" font-size="18" fill="${ink}" stroke="none">/</text>
        <path d="M200 112 L90 170 M200 112 L200 170 M200 112 L330 170"/>
        <rect x="50" y="170" width="80" height="36" rx="4" fill="${foam}"/>
        <rect x="160" y="170" width="80" height="36" rx="4" fill="${foam}"/>
        <rect x="290" y="170" width="80" height="36" rx="4" fill="${foam}"/>
        <text class="h" x="90" y="194" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">home</text>
        <text class="h" x="200" y="194" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">etc</text>
        <text class="h" x="330" y="194" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">opt</text>
      </g>
      <text class="h" x="50" y="250" font-size="18" fill="${ink}">home 是书桌，etc 是开关，opt 是后来搬进来的大家电</text>
    </svg>`,

    bpipe: `<svg viewBox="0 0 720 340" role="img" aria-label="管道把左边的输出送给右边">
      ${title("左边吐出的，变成右边吃的")}
      ${seal(655, 50, "管")}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <rect x="70" y="130" width="120" height="70" rx="8" fill="${soft}"/>
        <rect x="280" y="130" width="120" height="70" rx="8" fill="${foam}"/>
        <rect x="490" y="130" width="100" height="70" rx="8" fill="${soft}"/>
        <text class="h" x="130" y="172" text-anchor="middle" font-size="18" fill="${ink}" stroke="none">ps</text>
        <text class="h" x="340" y="172" text-anchor="middle" font-size="18" fill="${ink}" stroke="none">grep</text>
        <text class="h" x="540" y="172" text-anchor="middle" font-size="18" fill="${ink}" stroke="none">结果</text>
        <path d="M190 165 h90"/>
        <path d="M400 165 h90"/>
        <text class="h" x="220" y="156" font-size="18" fill="${ink}" stroke="none">|</text>
        <text class="h" x="430" y="156" font-size="18" fill="${ink}" stroke="none">|</text>
      </g>
      <text class="h" x="70" y="250" font-size="18" fill="${ink}">Shell 不是语言课，是把命令串成一条线</text>
    </svg>`,

    bpy: `<svg viewBox="0 0 720 340" role="img" aria-label="闭包把外层的变量装进口袋">
      ${title("外层走了，口袋还在")}
      ${seal(655, 50, "袋")}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <rect x="80" y="90" width="280" height="180" rx="10"/>
        <text class="h" x="100" y="122" font-size="18" fill="${ink}" stroke="none">外层函数</text>
        <rect x="120" y="140" width="200" height="100" rx="8" fill="${soft}"/>
        <text class="h" x="140" y="178" font-size="18" fill="${ink}" stroke="none">内层还记得 n</text>
        <text class="h" x="140" y="210" font-size="16" fill="${ink}" stroke="none">这就是闭包</text>
      </g>
      <text class="h" x="400" y="160" font-size="18" fill="${ink}">装饰器、生成器</text>
      <text class="h" x="400" y="200" font-size="18" fill="${ink}">都是在这个口袋上做文章</text>
    </svg>`,

    bbox: `<svg viewBox="0 0 720 340" role="img" aria-label="镜像是模板，容器是跑起来的进程">
      ${title("镜像是模子，容器是倒出来的")}
      ${seal(655, 50, "箱")}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <rect x="80" y="110" width="160" height="120" rx="6" fill="${soft}"/>
        <text class="h" x="160" y="178" text-anchor="middle" font-size="20" fill="${ink}" stroke="none">镜像</text>
        <path d="M240 170 h70"/>
        <path d="M310 110 l50 18 v90 l-50-18z" fill="${foam}"/>
        <path d="M310 110 v90 l50 18 v-90"/>
        <text class="h" x="390" y="178" font-size="20" fill="${ink}" stroke="none">容器</text>
      </g>
      <text class="h" x="80" y="270" font-size="18" fill="${ink}">模子可以复印很多次。数据要另放，箱子扔了盘还在。</text>
    </svg>`,

    mmat: `<svg viewBox="0 0 720 340" role="img" aria-label="一行对一列，乘完加起来">
      ${title("一行对一列，乘完加起来")}
      ${seal(655, 50, "乘")}
      <g fill="none" stroke="${ink}" stroke-width="1.4">
        <rect x="70" y="110" width="54" height="54" fill="${soft}"/>
        <rect x="124" y="110" width="54" height="54"/>
        <rect x="70" y="164" width="54" height="54"/>
        <rect x="124" y="164" width="54" height="54" fill="${soft}"/>
        <text class="h" x="97" y="144" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">1</text>
        <text class="h" x="151" y="144" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">2</text>
        <text class="h" x="97" y="198" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">3</text>
        <text class="h" x="151" y="198" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">4</text>
      </g>
      <text class="h" x="200" y="176" font-size="22" fill="${ink}">×</text>
      <g fill="none" stroke="${ink}" stroke-width="1.4">
        <rect x="240" y="110" width="54" height="54" fill="${soft}"/>
        <rect x="294" y="110" width="54" height="54"/>
        <rect x="240" y="164" width="54" height="54"/>
        <rect x="294" y="164" width="54" height="54" fill="${soft}"/>
        <text class="h" x="267" y="144" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">5</text>
        <text class="h" x="321" y="144" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">6</text>
        <text class="h" x="267" y="198" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">7</text>
        <text class="h" x="321" y="198" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">8</text>
      </g>
      <text class="h" x="368" y="176" font-size="22" fill="${ink}">=</text>
      <g fill="none" stroke="${ink}" stroke-width="1.4">
        <rect x="410" y="110" width="70" height="54" fill="${ink}" opacity=".12"/>
        <rect x="480" y="110" width="70" height="54"/>
        <rect x="410" y="164" width="70" height="54"/>
        <rect x="480" y="164" width="70" height="54"/>
        <text class="h" x="445" y="144" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">19</text>
      </g>
      <text class="h" x="70" y="270" font-size="18" fill="${ink}">亮着的那一行，对亮着的那一列。前向传播就是这一下，反复做。</text>
    </svg>`,

    meig: `<svg viewBox="0 0 720 340" role="img" aria-label="有些方向被拉长，但方向不变">
      ${title("有些箭头，转完还朝同一边")}
      ${seal(655, 50, "征")}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <circle cx="200" cy="180" r="78" opacity=".35"/>
        <path d="M200 180 L 200 102" stroke-width="2.1"/>
        <path d="M200 102 l-8 12 16 0"/>
        <path d="M200 180 L 278 180" opacity=".45"/>
        <path d="M200 180 L 255 235" opacity=".45"/>
        <path d="M200 180 L 145 235" opacity=".45"/>
        <path d="M200 180 L 122 180" stroke-width="2.1"/>
        <path d="M122 180 l12 -8 0 16"/>
      </g>
      <text class="h" x="210" y="96" font-size="16" fill="${ink}">方向没变，只是变长了</text>
      <text class="h" x="360" y="170" font-size="18" fill="${ink}">这些就是特征向量</text>
      <text class="h" x="360" y="210" font-size="18" fill="${ink}">拉长的倍数，叫特征值</text>
    </svg>`,

    msvd: `<svg viewBox="0 0 720 340" role="img" aria-label="旋转、拉伸、再旋转">
      ${title("转一下，拉一下，再转一下")}
      ${seal(655, 50, "折")}
      ${arrow(175, 180, 215, 180)}
      ${arrow(355, 180, 395, 180)}
      <g fill="none" stroke="${ink}" stroke-width="1.6">
        <circle cx="110" cy="180" r="52"/>
        <ellipse cx="285" cy="180" rx="70" ry="28"/>
        <ellipse cx="500" cy="180" rx="52" ry="52" transform="rotate(28 500 180)"/>
      </g>
      <text class="h" x="110" y="260" text-anchor="middle" font-size="18" fill="${ink}">U 旋转</text>
      <text class="h" x="285" y="260" text-anchor="middle" font-size="18" fill="${ink}">Σ 拉伸</text>
      <text class="h" x="500" y="260" text-anchor="middle" font-size="18" fill="${ink}">V 再转</text>
      <text class="h" x="70" y="310" font-size="18" fill="${ink}">任意矩阵都能这样拆。LoRA 的「瘦」，就藏在中间那一下拉伸里。</text>
    </svg>`,

    ment: `<svg viewBox="0 0 720 340" role="img" aria-label="分布越平，越不确定">
      ${title("越平均，越难猜")}
      ${seal(655, 50, "熵")}
      <g fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round">
        <rect x="80" y="90" width="36" height="160" fill="${ink}" opacity=".16"/>
        <rect x="128" y="200" width="36" height="50" fill="${soft}"/>
        <rect x="176" y="220" width="36" height="30" fill="${soft}"/>
      </g>
      <text class="h" x="146" y="280" text-anchor="middle" font-size="18" fill="${ink}">尖的：好猜</text>
      <g fill="none" stroke="${ink}" stroke-width="1.4">
        <rect x="340" y="150" width="36" height="100" fill="${soft}"/>
        <rect x="388" y="150" width="36" height="100" fill="${soft}"/>
        <rect x="436" y="150" width="36" height="100" fill="${soft}"/>
      </g>
      <text class="h" x="406" y="280" text-anchor="middle" font-size="18" fill="${ink}">平的：难猜</text>
      <text class="h" x="80" y="320" font-size="16" fill="${ink}">熵就是「难猜的程度」。KL 是两座山差了多少。</text>
    </svg>`,

    bboxes: `<svg viewBox="0 0 720 340" role="img" aria-label="四只盒子">
      ${title("先分清四只盒子")}
      ${seal(655, 50, "盒")}
      <g fill="none" stroke="${ink}" stroke-width="1.5">
        <rect x="60" y="100" width="120" height="110" rx="8" fill="${soft}"/>
        <rect x="200" y="100" width="120" height="110" rx="8"/>
        <rect x="340" y="100" width="120" height="110" rx="8" fill="${soft}"/>
        <rect x="480" y="100" width="110" height="110" rx="8"/>
        <text class="h" x="120" y="150" text-anchor="middle" font-size="22" fill="${ink}" stroke="none">list</text>
        <text class="h" x="260" y="150" text-anchor="middle" font-size="22" fill="${ink}" stroke="none">tuple</text>
        <text class="h" x="400" y="150" text-anchor="middle" font-size="22" fill="${ink}" stroke="none">dict</text>
        <text class="h" x="535" y="150" text-anchor="middle" font-size="22" fill="${ink}" stroke="none">set</text>
        <text class="h" x="120" y="186" text-anchor="middle" font-size="14" fill="${ink}" stroke="none">能改 · 有序</text>
        <text class="h" x="260" y="186" text-anchor="middle" font-size="14" fill="${ink}" stroke="none">不能改 · 有序</text>
        <text class="h" x="400" y="186" text-anchor="middle" font-size="14" fill="${ink}" stroke="none">键对着值</text>
        <text class="h" x="535" y="186" text-anchor="middle" font-size="14" fill="${ink}" stroke="none">不重复</text>
      </g>
      <text class="h" x="60" y="260" font-size="18" fill="${ink}">tokenizer、batch、配置，全是这四只的组合。</text>
    </svg>`,

    bnum: `<svg viewBox="0 0 720 340" role="img" aria-label="列表零散，数组整齐">
      ${title("一排整齐的格子")}
      ${seal(655, 50, "阵")}
      <g fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round">
        <rect x="70" y="120" width="40" height="52" rx="4"/>
        <rect x="118" y="108" width="48" height="64" rx="4"/>
        <rect x="174" y="128" width="36" height="44" rx="4"/>
        <rect x="218" y="116" width="44" height="56" rx="4"/>
      </g>
      <text class="h" x="164" y="210" text-anchor="middle" font-size="16" fill="${ink}">list：各过各的</text>
      ${arrow(280, 150, 330, 150)}
      <g fill="none" stroke="${ink}" stroke-width="1.5">
        <rect x="350" y="118" width="48" height="48" fill="${soft}"/>
        <rect x="398" y="118" width="48" height="48"/>
        <rect x="446" y="118" width="48" height="48" fill="${soft}"/>
        <rect x="494" y="118" width="48" height="48"/>
        <rect x="350" y="166" width="48" height="48"/>
        <rect x="398" y="166" width="48" height="48" fill="${soft}"/>
        <rect x="446" y="166" width="48" height="48"/>
        <rect x="494" y="166" width="48" height="48" fill="${soft}"/>
      </g>
      <text class="h" x="446" y="250" text-anchor="middle" font-size="16" fill="${ink}">ndarray：同一类型，连续内存</text>
      <text class="h" x="70" y="300" font-size="18" fill="${ink}">Pandas 再给格子贴上标签，就成了表。</text>
    </svg>`,

    bsql: `<svg viewBox="0 0 720 340" role="img" aria-label="一张带类型的表">
      ${title("库是文件夹，表是带类型的格子")}
      ${seal(655, 50, "表")}
      <g fill="none" stroke="${ink}" stroke-width="1.4">
        <rect x="80" y="90" width="480" height="160"/>
        <path d="M80 130 h480 M200 90 v160 M360 90 v160 M500 90 v160"/>
        <text class="h" x="140" y="118" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">id</text>
        <text class="h" x="280" y="118" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">name</text>
        <text class="h" x="430" y="118" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">city</text>
        <text class="h" x="140" y="168" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">1</text>
        <text class="h" x="280" y="168" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">茶</text>
        <text class="h" x="430" y="168" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">深圳</text>
        <text class="h" x="140" y="218" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">2</text>
        <text class="h" x="280" y="218" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">松</text>
        <text class="h" x="430" y="218" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">杭州</text>
      </g>
      <text class="h" x="80" y="290" font-size="18" fill="${ink}">SQL 不写怎么走，只写想要什么。JOIN 是按键把两张表对齐。</text>
    </svg>`,

    bapi: `<svg viewBox="0 0 720 340" role="img" aria-label="函数挂到门口变成接口">
      ${title("函数挂到门口")}
      ${seal(655, 50, "口")}
      <g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <rect x="80" y="110" width="160" height="100" rx="8" fill="${soft}"/>
        <text class="h" x="160" y="170" text-anchor="middle" font-size="20" fill="${ink}" stroke="none">def chat()</text>
        <path d="M240 160 h70"/>
        <rect x="330" y="110" width="220" height="100" rx="8" fill="${foam}"/>
        <text class="h" x="440" y="155" text-anchor="middle" font-size="18" fill="${ink}" stroke="none">POST /chat</text>
        <text class="h" x="440" y="186" text-anchor="middle" font-size="16" fill="${ink}" stroke="none">JSON 进，JSON 出</text>
      </g>
      <text class="h" x="80" y="260" font-size="18" fill="${ink}">FastAPI 做的事：按路径找到函数，拆参数，校验，再送回去。</text>
    </svg>`,

    blook: `<svg viewBox="0 0 720 340" role="img" aria-label="机器到箱子的一条线">
      ${title("地板是这条线")}
      ${seal(655, 50, "通")}
      <text class="h" x="230" y="140" font-size="20" fill="${ink}">目录让你站住</text>
      <text class="h" x="230" y="178" font-size="20" fill="${ink}">命令写成脚本</text>
      <text class="h" x="230" y="216" font-size="20" fill="${ink}">数组和表对齐再算</text>
      <text class="h" x="230" y="254" font-size="20" fill="${ink}">接口对外，箱子带走</text>
    </svg>`

  };

  document.querySelectorAll("[data-illus]").forEach(el => {
    const name = el.getAttribute("data-illus");
    el.innerHTML = sketches[name] || "";
  });
})();