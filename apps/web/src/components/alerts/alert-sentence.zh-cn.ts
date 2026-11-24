import {
  ACTION_RULE_TITLES,
  CHANGE_FIELD_LABELS,
  SERP_DEPTH,
  type AlertEventItem,
} from "@asobeast/shared";
import { storeLabel } from "@/lib/format";
import { uiCountry, uiDate } from "@/lib/ui-formats";
import { uiText } from "@/lib/ui-language";

const market = (country: string | null | undefined) =>
  country ? uiCountry("zh-CN", country) : "";

const place = (position: number | null, depth: number) =>
  position === null ? `前 ${depth} 名之外` : `第 ${position} 名`;

const name = (app: { name: string | null }) => app.name ?? "某个应用";

const keywordIn = (keyword: { text: string; country?: string }) =>
  `${keyword.country ? `在${market(keyword.country)}市场，` : ""}关键词「${keyword.text}」`;

const movement = (direction: "entered" | "left", tier: number) =>
  tier === 1
    ? direction === "entered"
      ? "升至第 1 名"
      : "跌出第 1 名"
    : `${direction === "entered" ? "进入" : "跌出"}前 ${tier} 名`;

const collection = {
  free: "免费榜",
  paid: "付费榜",
  grossing: "畅销榜",
} as const;

const priority = {
  critical: "紧急",
  high: "高",
  medium: "中",
  low: "低",
} as const;

export function alertSentenceZh(item: AlertEventItem): string {
  const payload = item.payload;
  switch (payload.event) {
    case "rank.dropped":
    case "rank.improved": {
      const direction = payload.event === "rank.dropped" ? "下降" : "上升";
      return `${keywordIn(payload.keyword)}中，${name(payload.app)}的排名从${place(payload.from, payload.fromDepth)}${direction}至${place(payload.to, payload.toDepth)}。`;
    }
    case "rank.first":
      return `${keywordIn(payload.keyword)}中，${name(payload.app)}首次获得排名：${place(payload.position, payload.depth)}。`;
    case "rank.milestone":
      return `${keywordIn(payload.keyword)}中，${name(payload.app)}${movement(payload.direction, payload.tier)}：${place(payload.from, payload.fromDepth)} → ${place(payload.to, payload.toDepth)}。`;
    case "rank.overtaken":
      return `${keywordIn(payload.keyword)}中，${name(payload.competitor)}超过了${name(payload.app)}。竞品当前为${place(payload.competitor.to, payload.toDepth)}，你的应用当前为${place(payload.to, payload.toDepth)}。`;
    case "metadata.changed": {
      const fields = [
        ...new Set(
          payload.changes.map(({ field }) =>
            uiText("zh-CN", CHANGE_FIELD_LABELS[field]),
          ),
        ),
      ].join("、");
      return `${name(payload.app)}更新了${fields}。`;
    }
    case "review.negative":
    case "review.new": {
      const body = payload.review.text?.trim() ?? "";
      const quote = body.length > 80 ? `${body.slice(0, 79)}…` : body;
      return `${name(payload.app)}收到一条 ${payload.review.score} 星评论${quote ? `：「${quote}」` : "。"}`;
    }
    case "rating.dropped":
      return `${name(payload.app)}在${market(payload.country)}市场的平均评分从 ${payload.from.toFixed(2)} 降至 ${payload.to.toFixed(2)}。`;
    case "review.spike":
      return `${name(payload.app)}于 ${uiDate("zh-CN", payload.date, "date")} 收到 ${payload.count} 条评论，平时每天的中位数为 ${payload.median} 条。`;
    case "app.delisted":
      return `${name(payload.app)}已从${market(payload.country)} ${storeLabel(payload.store)} 下架。`;
    case "app.unlisted_market":
      return `${name(payload.app)}已从${market(payload.market)} ${storeLabel(payload.store)} 下架。该市场跟踪了 ${payload.trackedKeywords} 个关键词。`;
    case "serp.entrant": {
      const titles = payload.entrants
        .map((entrant) => `第 ${entrant.position} 名 ${entrant.title}`)
        .join("、");
      return `${keywordIn(payload.keyword)}中，新进入前 ${SERP_DEPTH} 名的应用：${titles}。`;
    }
    case "action.opened": {
      const { priority: level, rule, impact, reopened } = payload.action;
      return `${name(payload.app)}${reopened ? "重新打开" : "新增"}了${priority[level]}优先级的行动：${uiText("zh-CN", ACTION_RULE_TITLES[rule])}，影响评分 ${impact}。`;
    }
    case "chart.entered":
    case "chart.left":
    case "chart.milestone": {
      const chart = `${market(payload.chart.country)}·${uiText("zh-CN", payload.chart.genreName)}${collection[payload.chart.collection]}`;
      if (payload.event === "chart.entered")
        return `${name(payload.app)}进入${chart}，排名第 ${payload.to}。`;
      if (payload.event === "chart.left")
        return `${name(payload.app)}从${chart}第 ${payload.from} 名掉出榜单。`;
      return `${name(payload.app)}在${chart}${movement(payload.direction, payload.tier)}：${place(payload.from, payload.depth)} → ${place(payload.to, payload.depth)}。`;
    }
    case "digest.weekly":
      return `每周摘要，包含 ${payload.apps.length} 个应用：${uiDate("zh-CN", payload.window.from, "date")}至${uiDate("zh-CN", payload.window.to, "date")}。`;
  }
}
