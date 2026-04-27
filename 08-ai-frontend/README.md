# AI 前端开发（核心差异化）

> 优先级：⭐⭐⭐⭐⭐ | 时间：Week 4-5（5.19 - 6.1）
> **这是简历的差异化武器**。8 年电商前端 + AI 全栈，胜过 8 年纯前端。

---

## 🗺️ 模块全景图

```
                    AI 前端开发
                         │
         ┌───────────────┼───────────────┐
      基础认知         应用模式         全栈实战
         │              │                │
    LLM 原理        Chat / RAG       Chatbot 项目
    Token/Temp      / Agent          (Next.js + 
    Embedding                          Vercel AI SDK +
                                       Claude API)
         │              │                │
         └────── 工具链 ──────┘
              Vercel AI SDK
              LangChain.js
              Supabase pgvector
              Tool Use
```

---

## 🎯 核心概念（6 个必懂）

1. **LLM 基础认知**
   - Token：模型看到的最小单位（≈ 4 字符 / 0.75 个英文单词）
   - Temperature：0=确定性 / 1=平衡 / >1=发散
   - Top-P：核采样，从概率最高的 P% 候选里选
   - **不要研究 Transformer 内部**，知道是"基于注意力的序列生成模型"够用

2. **SSE 流式渲染（必考）**
   - 服务端：`Content-Type: text/event-stream`，按行 push 数据
   - 客户端：`new EventSource()` 或 fetch + ReadableStream
   - 在 Vercel AI SDK 里：`streamText()` 自动处理流式
   - **必出 demo**

3. **Function Calling / Tool Use**
   - 模型识别用户意图 → 选择调用某个函数 → 拿结果再生成回复
   - 流程：用户问 → LLM 输出 tool_use → 你执行函数 → 把结果发回 LLM → LLM 生成最终回复
   - 注意：**LLM 自己不执行函数**，是你的代码执行后给它结果

4. **RAG 完整链路（必考）**
   ```
   离线：文档 → chunking → embedding → 存向量库
   在线：query → embedding → 检索 top-k → 拼 prompt → LLM 生成
   ```
   - chunking 策略：固定长度 / 语义边界 / 递归切分
   - embedding 模型：text-embedding-3-small（OpenAI）/ voyage-2 / 国产
   - 检索 top-k：通常 3-10，越多越准但 token 成本越高

5. **Agent 设计模式**
   - ReAct：Reasoning + Acting 循环（思考 → 调工具 → 看结果 → 继续思考）
   - 关键设计：**循环终止条件**（步数限制 / 自然结束 / 用户中断）

6. **Prompt 模板管理**
   - 不要把 prompt 散在代码里
   - 模板化（类似 i18n）：`prompts/customer-support.md`
   - 版本化（A/B 测试）

---

## 💪 必出 Demo（这是简历核心，必须做）

| Demo | 行数/规模 | 验证什么 | 周次 |
|---|---|---|---|
| `chatbot-mvp/` | Next.js 项目 | SSE 流式 + Markdown 渲染 + 历史对话 | Week 4 |
| `chatbot-rag/` | 在 mvp 基础上加 | Supabase pgvector + 你的真实文档 | Week 5 |
| `chatbot-tool/` | 加 1 个工具 | 一个有用的 Tool（查日程/查股票/查文档） | Week 5 |
| 部署 | Vercel | 一个公开访问 URL（简历里贴） | Week 4 |

---

## 🎤 面试话术（这是高频考点）

### Q: 你的 AI 项目里 SSE 是怎么实现的？
> 后端用 Vercel AI SDK 的 `streamText`，它会返回一个 ReadableStream，response 设 `Content-Type: text/event-stream`。
> 前端用 `useChat` hook（AI SDK 提供），底层是 fetch + ReadableStream + TextDecoder 一段一段读。
> 关键点：**响应不能用 JSON.stringify**，要按 SSE 格式 `data: xxx\n\n`，浏览器才能逐段解析。

### Q: RAG 完整链路？
> 分离线和在线两段：
> 
> **离线**：文档 → chunking（按语义切，每块 500-1000 token）→ 用 embedding 模型转成向量 → 存向量库（Supabase pgvector / Pinecone）
> 
> **在线**：用户 query → 同一个 embedding 模型转向量 → 在向量库做相似度检索（cosine）→ 取 top-k → 把这 k 段文档拼到 prompt 的 context 里 → 调 LLM 生成回答
> 
> 关键调优：**chunking 策略**（影响检索质量）+ **top-k 数量**（精度 vs 成本权衡）+ **embedding 模型选择**

### Q: Function Calling 怎么用？
> 模型不直接执行函数，是**告诉你想调用哪个函数**。
> 流程：
> 1. 你定义工具 schema（JSON Schema 描述函数签名）传给模型
> 2. 用户问问题，模型分析后输出 `{tool_use: 'getWeather', args: {city: 'Beijing'}}`
> 3. 你的代码执行 getWeather('Beijing')，拿到结果
> 4. 把结果作为 tool_result 发回模型，模型生成自然语言回复
> 
> 容易踩的坑：**循环调用**（模型可能连续要调多个工具），要做步数限制。

### Q: Token / Temperature 是什么？
> Token 是 LLM 处理的最小单位，**计费按 token 算**（input 和 output 分别计），所以 prompt 要精炼。
> Temperature 控制随机性：0 完全确定性（适合代码、抽取信息），1 平衡，>1 发散（适合创意写作）。
> 我做客服机器人会用 0.1-0.3，做创意类用 0.7-1。

---

## 📺 视觉学习资源（强烈推荐）

- **视频**：[3Blue1Brown - GPT/Transformer 可视化](https://www.youtube.com/watch?v=wjZofJX0v4M)（必看，视觉化 GOAT）
- **视频**：[Andrej Karpathy - Let's build GPT](https://www.youtube.com/watch?v=kCc8FmEb1nY)（深度但清晰）
- **文档**：[Vercel AI SDK 官方 Quickstart](https://sdk.vercel.ai/docs)（直接照抄能跑）
- **文档**：[Anthropic Tool Use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- **博客**：Simon Willison（AI 实践派，文章很糙但实用）

---

## 🔧 工作痛点联动（最重要的兴趣型驱动）

这是 PAIN-POINTS.md 的主战场。从你的池子里挑：
- Week 4：选一个**简单 Chat 类**痛点（如：让 AI 帮你写每周周报，输入是 git log）
- Week 5：升级成 **RAG 类**痛点（如：把过去几年的工作笔记做成问答系统）
- Week 5 也要加 **Tool Use**（如：自动查日程、自动调内部 API）

**最终产出**：一个对你工作真正有用 + 简历能讲深度的 AI 应用。

---

## ⚠️ 避坑

- ❌ 不要研究 Transformer 数学（短期没用，看 3Blue1Brown 视频建立直觉就够）
- ❌ 不要研究 fine-tuning（生产里很少用，2026 年都是 RAG + Prompt + Tool）
- ❌ 不要做太花哨的 UI（一个能用的 Chat 比花哨界面值钱）
- ✅ 重点：**做出能 demo 的项目** + **能讲清 SSE / RAG / Tool Use 的细节**
- ✅ 项目部署到 Vercel，简历直接贴 URL，**面试官会去点**
