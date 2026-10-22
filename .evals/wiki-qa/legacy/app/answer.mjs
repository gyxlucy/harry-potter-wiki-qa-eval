// The app under test: Chinese question -> (model) French search queries -> BM25 over the wiki
// -> (model) Chinese answer grounded in the retrieved passages, with 【page title】 citations.
// Both model calls use the same model, so swapping `model` swaps the whole app.
import { retrieve, formatPassages } from './wiki.mjs';

export const REWRITE_SYSTEM = `你是一个检索查询改写器。用户会用中文问一个关于《哈利·波特》的问题,答案要到「法语版 Harry Potter 粉丝 wiki」里找。
请输出:
- titles:最可能与问题直接相关的 wiki 页面标题(必须用 wiki 上的法语写法,例如 Poudlard、Serpentard、Gryffondor、Drago Malefoy、Severus Rogue、Tom Jedusor、Choixpeau magique、Horcruxe、Miroir du Riséd),最多 5 个;
- keywords:2 到 4 条法语检索短语,覆盖回答问题所需的不同侧面(人物、事件、物品、关键概念)。
只输出 JSON。`;

export const REWRITE_SCHEMA = {
  type: 'object',
  properties: {
    titles: { type: 'array', items: { type: 'string' } },
    keywords: { type: 'array', items: { type: 'string' } },
  },
  required: ['titles', 'keywords'],
  additionalProperties: false,
};

export const ANSWER_SYSTEM = `你是《哈利·波特》wiki 问答助手。下面会给你若干段从法语版 Harry Potter wiki 检索到的资料(编号 [P1]、[P2]……)和一个中文问题。

规则:
1. 只依据这些资料回答,不要使用资料之外的知识。资料里没有的内容,明确说「资料中没有记载」,不要猜,不要编。
2. 如果问题的前提与资料不符(例如把别人的经历安在另一个人身上,或问到并不存在的人和事),先指出前提不对,再说资料里实际是怎样的。
3. 如果问题需要解释原因或动机,可以在资料事实的基础上做合理推理,但要把「资料写明的事实」和「你的推断」区分开。
4. 用中文回答,专有名词第一次出现时括注法语原文。
5. 每个关键事实后面用【页面标题】标出出处,页面标题必须是资料里出现过的页面标题,原样照抄。
6. 回答要简洁、有条理,不要重复问题。`;

function textOf(res) {
  return (res.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
}

function addUsage(a, u = {}) {
  for (const k of ['input_tokens', 'output_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens'])
    a[k] = (a[k] || 0) + (u[k] || 0);
  return a;
}

function assertServed(requested, served, stage) {
  // The runner re-checks the final response's model; this also covers the rewrite call.
  if (served !== requested) {
    const base = requested.replace(/-latest$|-0$/, '');
    const rest = String(served).startsWith(base) ? String(served).slice(base.length) : null;
    if (!(rest != null && /^[-@](\d{8}|\d{4}-\d{2}-\d{2})$/.test(rest))) {
      const e = new Error(`${stage}: served model ${served} != requested ${requested}`);
      e.failure_class = 'serving_substitution';
      throw e;
    }
  }
}

/**
 * Run the whole app on one question.
 * Returns { output, passages, titlesRetrieved, transcript, model, usage, stop_reason, status? }
 */
// Retrieval settings. The shipped default is the round-1 design. HP_EVAL_RETRIEVAL=baseline restores the original
// design (matched page -> its first 2 chunks, 12 chunks) so the baseline variant can be re-run / extended faithfully.
export const RETRIEVAL = {
  within: { maxChunks: 14, titleMode: 'within', withinK: 2 },
  baseline: { maxChunks: 12, titleChunks: 2, titleMode: 'first' },
};
export async function answerQuestion(question, { model, client, index, effort = 'medium', retrieval = RETRIEVAL[process.env.HP_EVAL_RETRIEVAL] ?? RETRIEVAL.within }) {
  const usage = {};

  // 1) query rewrite (small, structured)
  const rw = await client.messages.create({
    model,
    max_tokens: 4000,
    system: REWRITE_SYSTEM,
    messages: [{ role: 'user', content: question }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: REWRITE_SCHEMA } },
  });
  addUsage(usage, rw.usage);
  assertServed(model, rw.model, 'rewrite');
  let queries;
  try { queries = JSON.parse(textOf(rw)); } catch {
    const e = new Error('query rewrite did not return valid JSON'); e.failure_class = 'parse_error'; throw e;
  }
  const titles = (queries.titles || []).map(String).slice(0, 5);
  const keywords = (queries.keywords || []).map(String).slice(0, 4);

  // 2) retrieval (deterministic, no model)
  // Round-1 design (default): a guessed page contributes its opening (infobox) plus the 2 chunks of that page that best
  // match the query, instead of always its first 2 chunks: the paragraph that answers the question is often deep in a long page.
  const chunks = retrieve(index, { titles, keywords }, retrieval);
  const passages = formatPassages(chunks);

  // 3) grounded answer
  const userMsg = `资料:\n\n${passages}\n\n=====\n问题:${question}`;
  const res = await client.messages.create({
    model,
    max_tokens: 8000,
    system: ANSWER_SYSTEM,
    messages: [{ role: 'user', content: userMsg }],
    output_config: { effort },
  });
  addUsage(usage, res.usage);
  const answer = textOf(res);

  const transcript = [
    { role: 'system', content: ANSWER_SYSTEM },
    { role: 'user', content: question },
    { role: 'tool_call', name: 'search_wiki', content: JSON.stringify({ titles, keywords }, null, 2) },
    { role: 'tool_result', name: 'search_wiki', content: passages },
    { role: 'assistant', content: answer },
  ];
  return {
    output: answer,
    passages,
    retrievedTitles: [...new Set(chunks.map(c => c.title))],
    transcript,
    model: res.model,
    usage,
    stop_reason: res.stop_reason,
    queries: { titles, keywords },
  };
}
