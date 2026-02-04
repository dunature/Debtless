# Deep Internalizer: 项目演进与逻辑合成 (Evolution & Logic Synthesis)

> "知道‘为什么’而活的人，便能生存于任何‘如何’之中。" —— 尼采
> 本文档记录了将一个“学习工具”转化为语言习得“认知义肢”的代谢过程。

---

## 0. 第一性原理：感官完整性 (The First Principle: Sensory Integrity)
项目的起点并非 UI，而是 **Audio (音频)**。如果声音失真，思维模型便会存在缺陷。
- **关键转折 (The Pivot)**: 在 Qwen3-TTS 输出静电杂音时进行了重新对齐。
- **逻辑 (The Logic)**: 音频不仅是“输出”，更是通往语音记忆 (Phonological Memory) 的桥梁。

## 1. 第一阶段：构建骨架 (Phase I: Foundations)
建立处理高频语言数据的技术架构。
- **架构清理**: 系统性地解决了 P0-P2 级的质量问题（ESLint、React Hook 反模式）。
- **去冗余 (DRY)**: 将重复逻辑整合至共享组件与工具类中。
- **双语核心**: 全局集成 `isBilingual` 状态，确保翻译在各个层级间的一致性。

## 2. 第二阶段：代谢优化 (Phase II: Metabolic Optimization)
从“可用”转向“无缝”。
- **TTS 缓存策略**: 
    - **单词 (Words)**: 存储于 IndexedDB（高复用率）。
    - **句子 (Sentences)**: 不缓存（独特语境）。
    - **音节 (Syllables)**: 缓存常用后缀（如 -tion, -ing）以降低延迟。
- **思维 UI (Thinking UI)**: 将 7 秒的“死等”转化为互动的“思考进程”，实时暴露 AI 的推理步骤。
- **请求合并**: 将关键词提取与语境生成合并为单个 LLM 流，极大降低了往返时延 (RTT)。

## 3. 第三阶段：美学即功能 (Phase III: Magazine UX)
设计并非装饰，而是信息的等级制度。
- **杂志化布局 (Magazine Layout)**: 从通用的 Web 表单转向高对比度、杂志风格的视觉架构。
- **排版缩放**: 提升了基础字号并更新了全局 CSS 变量，优先平衡易读性与视觉密度。
- **视觉反馈**: 实现音节级慢速播放 (0.7x)，并伴随实时高亮，同步视觉与听觉感知。

## 4. 当前状态：发布加固 (Current State)
- **内部版本**: 实现了自动版本化与 GitHub 部署流水线。
- **文档体系**: 为技术实现与缓存策略建立了详尽的演示文档。
- **健壮性**: 修复了 `ReferenceError` 崩溃及边缘状态管理问题。

---

## 5. 用户指南：认知内化之旅 (User Guide: The Cognitive Journey)

本节详细说明如何使用 Deep Internalizer 将碎片化的信息转化为深层的认知资产。

### 5.1 开启旅程：导入与分析 (Ingestion & AI Processing)
在首页点击 `+ New` 或直接进入导入界面。你可以粘贴纯文本，或上传 PDF/DOCX 文件。
- **AI 实时推理**: 导入后，你会看到“思维 UI”，实时展示 AI 如何对文章进行语义切片和论点合成。

![导入界面](./docs/images/img_import.png)
*图 1: 支持多种格式的内容导入*

![思维 UI](./docs/images/img_thinking.png)
*图 2: 实时展示 AI 的认知处理过程*

### 5.2 全局地图：逻辑锚定 (Layer 0: Logic Mapping)
分析完成后，你将进入 **Logic Map**。这里通过“漏斗”将全文浓缩为唯一的“核心论点”，并将其拆分为多个逻辑块。
- **操作**: 点击任意一个逻辑卡片，即可进入该环节的深度内化循环。

![逻辑地图](./docs/images/img_layer0.png)
*图 3: 基于语义的逻辑导图*

### 5.3 深度内化循环 (Layer 1: The 4-Step Loop)
每一个逻辑块都包含以下四个步骤，旨在通过多感官协同完成知识“代谢”：

#### Step 1: 宏观语境 (Macro Context)
在详细阅读前，AI 会先为你提供该片段的宏观总结。这有助于大脑建立初步的语义支架。

![Step 1](./docs/images/img_step1.png)
*图 4: 建立认知支架*

#### Step 2: 词汇构建 (Vocabulary Build)
不仅是单词，更是语境。系统会自动提取核心术语。
- **X-Ray 语境**: 长按单词卡片可直接查看该词在原文中的具体出处。

![Step 2](./docs/images/img_step2.png)
*图 5: 交互式词汇深度学习*

#### Step 3: 发音训练 (Articulation)
通过 IPA 音标和高保真 TTS，训练你的“内耳”。关注意群 (Thought Groups) 和语感。

![Step 3](./docs/images/img_step3.png)
*图 6: 听觉与视觉的同步训练*

#### Step 4: 心流练习 (Flow Practice)
最后，你将尝试以自然的节奏完整读出该片段。系统会追踪你的 WPM（每分钟词数），确保达到内化标准的流利度。

![Step 4](./docs/images/img_step4.png)
*图 7: 追求极致的认知流利度*

---

### #ActionPlan: 下一步计划
1. **[ ]** 增加“遗忘曲线”进度跟踪面板。
2. **[ ]** 优化移动端在 Step 3 的录音对比功能。
3. **[ ]** 集成更深层的双语对比视图（支持逐句对齐）。

---

### #InternalLogic: 演进背后的“为什么”
项目的演进揭示了一个从 **Complexity (复杂性)** 到 **Simplicity via Optimization (通过优化实现简洁)** 的必然过程。系统现在承担了“繁重的工作”（切词、TTS、缓存），以便用户能专注于“深层的思考”（内化）。

### 苏格拉底式提问 (Socratic Depth)
*当我们的技术手段（如音节缓存与自动化流程）不断逼近“零延迟”时：*

1. **认知处理 (Cognitive Processing)**: 语言习得的瓶颈究竟是音频的 *交付速度*，还是学习者的 *认知处理速度*？如果是后者，我们的架构应如何演进以适应差异化的步频？
2. **机械感 vs. 韵律 (Prosody)**: 如果我们完美缓存了每一个音素单元，是否会因丢失自然语流而产生“机械感”，从而破坏深层听觉习得所需的韵律？
3. **逆向思维 (Inversion)**: 这种“保姆式”的学习流程是否会削弱学习者在处理真实、杂乱信息时的*抗挫折能力 (Desirability of Difficulty)*？

---
*创建日期: 2026-02-03 | 状态: Internal v1.0.x*
