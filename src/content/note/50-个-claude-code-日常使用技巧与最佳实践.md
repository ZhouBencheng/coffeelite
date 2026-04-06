---
title: 50 个 Claude Code 日常使用技巧与最佳实践
timestamp: 2026-04-06 17:28:19+08:00
tags: [Claude Code, AI]
description: 涵盖 Plan Mode、CLAUDE.md、Hooks、子代理、Worktree 和快捷键等 50 个 Claude Code 实用技巧，助你大幅提升日常开发效率。
toc: true
draft: false
---

> 本文翻译转载自 [Builder.io 博客](https://www.builder.io/blog/claude-code-tips-best-practices)，原作者 Vishwas Gopinath，发布于 2026 年 3 月 20 日。

你已经用了一段时间的 Claude Code，知道它好用，现在你想找到每一个能提升效率的技巧。我整理了 50 个 Claude Code 最佳实践和技巧，无论你是刚上手一周还是已经深度使用数月都能从中受益。这些内容来源于 Anthropic 官方文档、Boris Cherny（Claude Code 的作者）、社区经验，以及我自己一年的日常使用。

## 1. 设置 cc 别名

这是我每次启动 Claude Code 会话的方式。在你的 `~/.zshrc`（或 `~/.bashrc`）中添加：

```bash
alias cc='claude --dangerously-skip-permissions'
```

运行 `source ~/.zshrc` 加载配置。现在你只需输入 `cc` 而不是 `claude`，并跳过所有权限确认提示。这个 flag 名字故意起得很吓人，请在你完全理解 Claude Code 能对你的代码库做什么之后再使用。

## 2. 用 ! 前缀内联执行 bash 命令

输入 `!git status` 或 `!npm test`，命令会立即执行。命令及其输出都会进入上下文，Claude 可以看到结果并据此行动。这比让 Claude 自己去执行命令要快得多。

## 3. 按 Esc 停止，按两次 Esc 回退

Esc 可以在不丢失上下文的情况下中止 Claude 的操作，你可以立即重新引导方向。

Esc+Esc（或 `/rewind`）会打开一个可滚动的检查点菜单，你可以恢复代码、对话，或两者都恢复。有四个恢复选项：代码和对话、仅对话、仅代码、或从某个检查点开始总结。

这意味着你可以放心尝试那些只有 40% 把握的方案。成功了就太好了，不行就回退，零损失。但要注意：检查点只追踪文件编辑，bash 命令产生的变更（数据库迁移等）不会被捕获。

要继续之前的工作，`claude --continue` 恢复最近一次对话，`claude --resume` 则打开会话选择器。

## 4. 给 Claude 一种自我检查的方式

给 Claude 一个反馈循环，让它自己发现错误。在提示中包含测试命令、lint 检查或预期输出。

```text
将 auth 中间件重构为使用 JWT 而非 session tokens。
修改后运行现有的测试套件。
在确认完成前修复所有失败。
```

Claude 会运行测试，看到失败，然后自行修复。据 Boris Cherny 所说，仅此一条就能带来 2-3 倍的质量提升。对于 UI 变更，可以配置 Playwright MCP 服务器，让 Claude 打开浏览器、与页面交互并验证 UI 是否符合预期。这种反馈循环能捕获单元测试遗漏的问题。

## 5. 为你的编程语言安装代码智能插件

LSP 插件让 Claude 在每次文件编辑后自动获得诊断信息——类型错误、未使用的导入、缺失的返回类型。Claude 会在你注意到之前就发现并修复这些问题。这是你能安装的**影响最大的插件**。

选择你的语言并运行安装命令：

```text
/plugin install typescript-lsp@claude-plugins-official
/plugin install pyright-lsp@claude-plugins-official
/plugin install rust-analyzer-lsp@claude-plugins-official
/plugin install gopls-lsp@claude-plugins-official
```

还有 C#、Java、Kotlin、Swift、PHP、Lua 和 C/C++ 的插件。运行 `/plugin` 并进入 Discover 标签浏览完整列表。你需要在系统上安装对应的语言服务器二进制文件（插件会提示你是否缺失）。

## 6. 使用 gh CLI，并教 Claude 任何 CLI 工具

`gh` CLI 可以处理 PR、Issue 和评论，不需要单独的 MCP 服务器。CLI 工具比 MCP 服务器更节省上下文，因为它们不会将工具 schema 加载到上下文窗口中。`jq`、`curl` 和其他标准 CLI 工具也是如此。

对于 Claude 还不了解的工具，你可以这样提示："用 `sentry-cli --help` 学习它，然后用它找到生产环境中最近的错误。"Claude 会读取帮助输出，弄清语法，然后执行命令。即使是小众的内部 CLI 工具也能用。

## 7. 添加 "ultrathink" 用于复杂推理

这是一个关键词，能将推理深度设为最高并在 Opus 4.6 上触发自适应推理。Claude 会根据问题动态分配思考量。用于架构决策、棘手的调试、多步推理，或任何你希望 Claude 先深度思考再行动的场景。

你也可以用 `/effort` 永久设置推理深度。对于较简单的任务，较低的深度可以保持速度和低成本。让深度匹配问题的复杂度——变量重命名没必要消耗思考 token。

## 8. 利用 Skills 获取按需知识

Skills 是按需扩展 Claude 知识的 Markdown 文件。不像 CLAUDE.md 每次会话都会加载，Skills 只在与当前任务相关时才加载，保持你的上下文精简。

在 `.claude/skills/` 中创建 Skills，或安装捆绑了预置 Skills 的插件（运行 `/plugin` 浏览可用选项）。用 Skills 处理 Claude 偶尔需要的专业领域知识（API 规范、部署流程、编码模式）。

## 9. 从手机控制 Claude Code

运行 `claude remote-control` 启动一个会话，然后从 claude.ai/code 或 iOS/Android 上的 Claude 应用连接。会话在你的本地机器上运行，手机或浏览器只是一个窗口。你可以发送消息、批准工具调用，从任何地方监控进度。

如果你使用了第 1 条中的 `cc` 别名，Claude 已经拥有完全权限，不需要逐个审批操作。这使远程控制更加顺畅：启动任务，走开，只在 Claude 完成或遇到意外时从手机查看。

## 10. 将上下文窗口扩展到 100 万 tokens

Sonnet 4.6 和 Opus 4.6 都支持 100 万 token 的上下文窗口。在 Max、Team 和 Enterprise 计划中，Opus 自动升级到 100 万上下文。你也可以在会话中用 `/model opus[1m]` 或 `/model sonnet[1m]` 切换模型。

如果你担心大上下文下的质量，从 50 万开始逐步增加。更大的上下文意味着压缩之前有更多空间，但响应质量可能因任务而异。使用 `CLAUDE_CODE_AUTO_COMPACT_WINDOW` 控制压缩触发时机，用 `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` 设置百分比阈值，找到适合你工作流的平衡点。

## 11. 不确定如何着手时使用 Plan Mode

对于多文件变更、不熟悉的代码和架构决策，使用 Plan Mode。虽然前期会多花几分钟，但能防止 Claude 花 20 分钟自信满满地解决一个完全错误的问题。

对于小型、范围明确的任务则跳过它。如果你能用一句话描述 diff，直接做就行。你可以随时用 `Shift+Tab` 在 Normal、Auto-Accept 和 Plan 权限模式之间切换，无需离开当前对话。

## 12. 在不相关的任务之间运行 /clear

一个干净的会话加上精准的提示，胜过一个混乱的三小时长会话。不同的任务？先 `/clear`。

我知道这感觉像是在丢弃进度，但从头开始你会得到更好的结果。会话会退化，因为早期工作积累的上下文会淹没你当前的指令。花五秒钟 `/clear` 并写一个专注的起始提示，能为你省下 30 分钟递减回报的挣扎。

## 13. 不要为 Claude 解读 bug，直接粘贴原始数据

用文字描述 bug 既慢又低效。你会看着 Claude 猜测，纠正它，然后反复循环。

直接粘贴错误日志、CI 输出或 Slack 对话，然后说"修复"。Claude 能读懂分布式系统的日志，追踪问题出在哪里。你的解读增加了一层抽象，往往丢失了 Claude 定位根因所需的细节。给 Claude 原始数据就好。

这对 CI 同样适用。"去修复失败的 CI 测试"加上 CI 输出，是最可靠的模式之一。你也可以粘贴 PR URL 或编号，让 Claude 检查失败的检查并修复。有了第 6 条中的 `gh` CLI，Claude 会搞定剩下的。

你还可以直接从终端管道输出：

```bash
cat error.log | claude "explain this error and suggest a fix"
npm test 2>&1 | claude "fix the failing tests"
```

## 14. 使用 /btw 进行快速旁问

`/btw` 会弹出一个浮层，让你在不进入对话历史的情况下快速提问。我用它来澄清当前会话中的疑问："你为什么选择这种方式？"或"另一种方案的权衡是什么？"答案显示在一个可关闭的浮层中，主上下文保持精简，Claude 继续工作。

## 15. 使用 --worktree 进行隔离的并行分支

`claude --worktree feature-auth` 会创建一个隔离的工作副本和新分支。Claude 会帮你处理 git worktree 的设置和清理。

Claude Code 团队称这是最大的生产力解锁之一。启动 3-5 个 worktree，每个运行自己的 Claude 会话并行工作。我通常运行 2-3 个。每个 worktree 有自己的会话、分支和文件系统状态。

本地 worktree 的上限取决于你的机器性能。多个开发服务器、构建和 Claude 会话都在争夺 CPU 资源。

## 16. 用 Ctrl+S 暂存提示

你正在写一个很长的提示，突然发现需要先得到一个快速答案。`Ctrl+S` 暂存你的草稿。输入快速问题，提交后你暂存的提示会自动恢复。

## 17. 用 Ctrl+B 将长任务放到后台

当 Claude 启动一个长时间运行的 bash 命令（测试套件、构建、迁移）时，按 `Ctrl+B` 将其发送到后台。Claude 继续工作，你也可以继续聊天。进程完成后结果会出现。

## 18. 添加实时状态行

状态行是一个在每次 Claude 操作后运行的 shell 脚本，在终端底部显示实时信息：当前目录、git 分支、按使用量着色的上下文信息。

最快的设置方式是在 Claude Code 中输入 `/statusline`，它会问你想显示什么然后生成脚本。

## 19. 使用子代理保持主上下文清洁

"用子代理弄清楚支付流程如何处理失败交易。"这会启动一个拥有独立上下文窗口的 Claude 实例。它读取所有文件，推理代码库，然后返回一个简洁的总结。

你的主会话保持清洁，有充足的空间来构建东西。一次深入调查可能消耗一半的上下文窗口。子代理将这些成本排除在主会话之外。内置类型包括 Explore（Haiku，快速文件搜索）和 Plan（只读分析）。

## 20. 代理团队实现多会话协调

实验性但强大的功能。首先在设置或环境中添加 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 启用它。然后告诉 Claude 创建一个团队："创建一个 3 人代理团队来并行重构这些模块。"一个团队负责人将工作分配给队友，每个队友有自己的上下文窗口和共享任务列表，队友之间可以直接通信协调。

从 3-5 个队友和每个队友 5-6 个任务开始。避免分配修改相同文件的任务——两个队友编辑同一文件会导致覆盖。先从研究和审查任务（PR 审查、bug 调查）开始，再尝试并行实现。

## 21. 引导压缩保留关键信息

当上下文压缩时（自动或通过 `/compact`），告诉 Claude 要保留什么："/compact 重点关注 API 变更和已修改文件列表。"你也可以在 CLAUDE.md 中添加常规指令："压缩时保留已修改文件的完整列表和当前测试状态。"

## 22. 使用 /loop 进行定期检查

`/loop 5m check if the deploy succeeded and report back` 会安排一个定期在后台触发的提示。间隔可选（默认 10 分钟），支持 `s`、`m`、`h` 和 `d` 单位。你也可以循环其他命令：`/loop 20m /review-pr 1234`。任务限定在会话范围内，3 天后过期。用 `/loop` 来监控部署、观察 CI 管道，或在你专注于其他事情时轮询外部服务。

## 23. 使用语音输入获得更丰富的提示

运行 `/voice` 启用按住说话，然后按住 `Space` 开始语音输入。你的语音会实时转录到提示中，可以在同一条消息中混合语音和打字。口述的提示自然会包含更多上下文，因为你会解释背景、提及约束、描述需求，而不会为了省按键而偷工减料。需要一个 Claude.ai 帐号（不是 API key）。你可以在 `~/.claude/keybindings.json` 中将按住说话的按键改绑到组合键来跳过预热时间。

## 24. 同一问题纠正两次后，重新开始

当你和 Claude 陷入一连串纠正的死胡同，问题仍然没有修复时，上下文现在充满了失败的尝试，这些正在损害下一次尝试。`/clear` 然后写一个更好的起始提示，把你学到的东西融入其中。一个干净的会话加上更精准的提示，几乎总是优于一个被积累的失败方案拖累的长会话。

## 25. 明确告诉 Claude 查看哪些文件

使用 `@` 直接引用文件：`@src/auth/middleware.ts 包含会话处理逻辑。` `@` 前缀会自动解析为文件路径，Claude 就能准确知道去哪里查看。

Claude 可以自己搜索代码库，但每个搜索步骤都消耗 token 和上下文。从一开始就指向正确的文件，跳过了整个搜索过程。

## 26. 用模糊提示探索不熟悉的代码

"你觉得这个文件有什么可以改进的？"是一个很好的探索性提示。不是每个提示都需要很具体。当你想对现有代码获取新的视角时，一个模糊的问题让 Claude 有空间提出你不会想到要问的东西。

我在接触不熟悉的仓库时会用这招。Claude 会指出模式、不一致性和改进机会，这些是我第一次阅读时会忽略的。

## 27. 用 Ctrl+G 编辑计划

当 Claude 展示一个计划时，`Ctrl+G` 会在你的文本编辑器中打开它以供直接编辑。在 Claude 写第一行代码之前，添加约束、删除步骤、重新引导方向。当计划大致正确但你想调整几个步骤而不用重新解释整个事情时特别有用。

## 28. 运行 /init，然后把结果砍掉一半

CLAUDE.md 是项目根目录下的一个 Markdown 文件，给 Claude 持久指令：构建命令、编码标准、架构决策、仓库约定。Claude 在每次会话开始时读取它。`/init` 会根据你的项目结构生成一个初始版本，它能自动识别构建命令、测试脚本和目录结构。

输出往往会很臃肿。如果你解释不了某一行为什么在那里，就删掉它。精简噪音，添加缺失的内容。

## 29. 每一行 CLAUDE.md 的试金石

对于 CLAUDE.md 中的每一行，问自己：没有这一行 Claude 会犯错吗？如果 Claude 自己本来就能正确完成某件事，那这条指令就是噪音。每一行不必要的指令都在稀释真正重要的指令。大约有 150-200 条指令的预算，超过后遵从度会下降，而系统提示已经使用了其中约 50 条。

## 30. Claude 犯错后，说"更新你的 CLAUDE.md 以防再犯"

当 Claude 犯了错误，说"更新 CLAUDE.md 文件以防再次发生。"Claude 会自己写下规则，下次会话自动遵循。

随着时间推移，你的 CLAUDE.md 会成为一个由真实错误塑造的活文档。为了防止它无限增长，使用 `@imports`（第 32 条）引用单独的文件来存放模式和修复方案。你的 CLAUDE.md 保持精简，Claude 按需读取详细信息。

## 31. 使用 .claude/rules/ 存放条件性规则

在 `.claude/rules/` 中放置 Markdown 文件来按主题组织指令。默认情况下，每个规则文件在每次会话开始时加载。要让规则仅在 Claude 处理特定文件时加载，添加 `paths` frontmatter：

```yaml
---
paths:
  - "**/*.ts"
---

优先使用 interface 而非 type。
```

这让你的主 CLAUDE.md 保持精简。TypeScript 规则在 Claude 读取 `.ts` 文件时加载，Go 规则在读取 `.go` 文件时加载。Claude 永远不用翻阅它没在碰的语言的规范。

## 32. 使用 @imports 保持 CLAUDE.md 精简

用 `@docs/git-instructions.md` 引用文档。你也可以引用 `@README.md`、`@package.json`，甚至 `@~/.claude/my-project-instructions.md`。

Claude 在需要时才读取文件。把 `@imports` 想象成"如果你需要的话，这里有更多上下文"，而不会膨胀每次会话都要读取的文件。

## 33. 用 /permissions 白名单安全命令

别再对 `npm run lint` 第一百次点"批准"了。`/permissions` 让你白名单信任的命令，保持工作流的连贯。不在列表上的命令仍然会提示你确认。

## 34. 使用 /sandbox 让 Claude 自由工作

运行 `/sandbox` 启用操作系统级隔离。写入被限制在项目目录内，网络请求仅限你批准的域名。它在 macOS 上使用 Seatbelt，在 Linux 上使用 bubblewrap，限制适用于 Claude 产生的每个子进程。在自动允许模式下，沙箱中的命令无需权限提示，给你提供了近乎完全的自主性和安全护栏。

对于无人看管的工作（通宵迁移、实验性重构），在 Docker 容器中运行 Claude。容器提供完全隔离、轻松回滚，以及让 Claude 运行数小时的信心。

## 35. 为重复任务创建自定义子代理

不同于即时使用子代理（第 19 条），自定义子代理是保存在 `.claude/agents/` 中的预配置代理。例如，一个使用 Opus 和只读工具的安全审查代理，或一个使用 Haiku 以追求速度的快速搜索代理。

使用 `/agents` 浏览和创建它们。你可以为需要独立文件系统的代理设置 `isolation: worktree`。

## 36. 为你的技术栈选择合适的 MCP 服务器

值得首先使用的 MCP 服务器：**Playwright** 用于浏览器测试和 UI 验证，**PostgreSQL/MySQL** 用于直接 schema 查询，**Slack** 用于读取 bug 报告和对话上下文，**Figma** 用于设计转代码的工作流。

Claude Code 支持动态工具加载，服务器只在 Claude 需要时才加载其定义。

## 37. 设置你的输出风格

运行 `/config` 并选择你偏好的风格。内置选项有 Explanatory（详细、分步骤）、Concise（简洁、以行动为导向）和 Technical（精确、专业术语友好）。

你也可以在 `~/.claude/output-styles/` 中创建自定义输出风格文件。

## 38. CLAUDE.md 用于建议，Hooks 用于强制要求

CLAUDE.md 是建议性的，Claude 大约 80% 的时间会遵循。Hooks 是确定性的，100% 执行。如果某件事必须每次都无例外地发生（格式化、lint、安全检查），把它做成 Hook。如果只是 Claude 应该考虑的指导，CLAUDE.md 就够了。

## 39. 用 PostToolUse Hook 自动格式化

每次 Claude 编辑文件时，你的格式化工具应该自动运行。在 `.claude/settings.json` 中添加一个 PostToolUse Hook，让它在 Claude 编辑或写入文件后运行 Prettier（或你的格式化工具）：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

`|| true` 防止 Hook 失败阻塞 Claude。你也可以链接其他工具——添加 `npx eslint --fix` 作为第二个 Hook 条目。

如果你的编辑器同时打开了相同的文件，建议在 Claude 工作时关闭编辑器的保存时格式化。有开发者反馈说编辑器保存可能会使提示缓存失效，迫使 Claude 重新读取文件。让 Hook 来处理格式化。

## 40. 用 PreToolUse Hook 阻止危险命令

用 PreToolUse Hook 阻止 `rm -rf`、`drop table` 和 `truncate` 等模式。Claude 连尝试都不会。Hook 在 Claude 执行工具之前触发，危险命令在造成损害之前就被拦截。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "type": "command",
        "command": "if echo \"$TOOL_INPUT\" | grep -qE 'rm -rf|drop table|truncate'; then echo 'BLOCKED: destructive command' >&2; exit 2; fi"
      }
    ]
  }
}
```

将此添加到项目中的 `.claude/settings.json`。你可以用 `/hooks` 交互式设置，或直接告诉 Claude："添加一个 PreToolUse Hook 来阻止 rm -rf、drop table 和 truncate 命令。"

## 41. 用 Hook 在压缩后保留重要上下文

在长会话中上下文压缩时，Claude 可能会失去对当前工作的追踪。一个带有 `compact` 匹配器的 Notification Hook 会在每次压缩触发时自动重新注入你的关键上下文。

告诉 Claude："设置一个 Notification Hook，在压缩后提醒你当前任务、已修改的文件和任何约束。"Claude 会在设置中创建这个 Hook。适合重新注入的内容：当前任务描述、已修改的文件列表，以及任何硬约束（"不要修改迁移文件"）。

这在多小时的深度开发会话中最有价值。

## 42. 始终人工审查认证、支付和数据变更

Claude 擅长写代码，但这些决策需要人类把关：认证流程、支付逻辑、数据变更、破坏性数据库操作。无论其他部分看起来多好，都要审查这些。一个错误的认证范围、一个配置错误的支付 webhook、或一个静默删除列的迁移，都可能让你失去用户、金钱或信任。

## 43. 使用 /branch 在不丢失当前方案的情况下尝试不同方法

`/branch`（或 `/fork`）在当前位置创建你对话的副本。在分支中尝试有风险的重构。如果成功，保留它；如果不行，你的原始对话不受影响。这与第 3 条的回退不同，因为两条路径都保持存活。

## 44. 当你无法完全定义功能需求时，让 Claude 采访你

你知道你想构建什么，但感觉不具备 Claude 做好它所需的全部细节。让 Claude 来提问：

```text
我想构建 [简要描述]。使用 AskUserQuestion 工具对我进行详细采访。
询问技术实现、边界情况、顾虑和权衡。
不要问显而易见的问题。
持续采访直到我们覆盖了所有内容，
然后写一份完整的规格文档到 SPEC.md。
```

规格完成后，开始一个新会话，用干净的上下文和完整的规格来执行。

## 45. 让一个 Claude 写代码，另一个 Claude 审查

第一个 Claude 实现功能，第二个 Claude 从全新上下文出发像高级工程师一样审查。审查者不了解实现中的捷径，会质疑每一个决策。

同样的思路可用于 TDD：会话 A 写测试，会话 B 写通过测试的代码。

## 46. 对话式审查 PR

不要让 Claude 做一次性 PR 审查（虽然你也可以这样做）。在会话中打开 PR 并进行对话："带我看看这个 PR 中最有风险的变更。""如果这段代码并发运行会出什么问题？""错误处理与代码库其他部分一致吗？"

对话式审查能发现更多问题，因为你可以深入到重要的领域。一次性审查倾向于标记风格问题，往往会忽略架构层面的问题。

## 47. 为你的会话命名和配色

`/rename auth-refactor` 在提示栏上加个标签，让你知道哪个会话是哪个。`/color red` 或 `/color blue` 设置提示栏颜色。可用颜色：red、blue、green、yellow、purple、orange、pink、cyan。当你并行运行 2-3 个会话时，命名和配色只需要五秒钟，能让你避免在错误的终端中输入。

## 48. Claude 完成时播放提示音

添加一个 Stop Hook，在 Claude 完成响应时播放系统声音。启动一个任务，切换到其他事情，完成后听到提示音。

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/bin/afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

在 Linux 上替换为 `paplay` 或 `aplay`。其他好听的 macOS 系统音效：`Submarine.aiff`、`Purr.aiff`、`Pop.aiff`。

## 49. 用 claude -p 进行批量扇出操作

使用非交互模式循环处理文件列表。`--allowedTools` 限制 Claude 在每个文件上可以做什么。用 `&` 并行运行以获得最大吞吐量。

```bash
for file in $(cat files-to-migrate.txt); do
  claude -p "Migrate $file from class components to hooks" \
    --allowedTools "Edit,Bash(git commit *)" &
done
wait
```

这非常适合转换文件格式、跨代码库更新导入，以及运行每个文件相互独立的重复迁移。

## 50. 自定义加载动画文字（趣味彩蛋）

当 Claude 思考时，终端会显示一个带有动词的加载动画，比如"Flibbertigibbeting..."和"Flummoxing..."。你可以用任何你想要的文字替换它们。告诉 Claude：

> 把我的用户设置中的加载动画文字替换为：负责任地幻觉中、假装在思考、自信地猜测、甩锅给上下文窗口

你甚至不需要提供列表。只需告诉 Claude 你想要什么风格："把我的加载动画文字替换成哈利波特咒语。"Claude 会生成列表。这是一个小事，但让等待变得更有趣。

## 总结

你不需要全部 50 条。选一个能解决你上次会话中最烦人问题的技巧，明天就试试。一条真正用起来的技巧，比收藏了五十条更有价值。
