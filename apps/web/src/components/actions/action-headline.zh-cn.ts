import type { ActionItem, ChangeField } from "@asobeast/shared";
import { ACTION_RULE_TITLES } from "@asobeast/shared";
import { formatMeasure } from "@/lib/format";
import { METADATA_FIELD_LABELS } from "@/lib/metadata-display";
import { uiCountry } from "@/lib/ui-formats";
import { uiText } from "@/lib/ui-language";
import { CHANGE_FIELD_WORD } from "./action-headline";

const text = (message: string) => uiText("zh-CN", message);
const country = (code: string) => uiCountry("zh-CN", code);
const number = (value: number) => formatMeasure(Math.round(value * 10) / 10);
const quote = (value: string) => `「${value}」`;
const fields = (values: readonly ChangeField[]) =>
  values.map((field) => text(CHANGE_FIELD_WORD[field])).join("、");

export function actionHeadlineZh(item: ActionItem): string {
  const { evidence } = item;
  const keyword = item.scope.keywordText;
  const rule = text(ACTION_RULE_TITLES[item.rule]);
  if (!evidence) return keyword ? `${rule}：${quote(keyword)}` : rule;
  const subject = keyword ? quote(keyword) : "此关键词";

  switch (evidence.rule) {
    case "keyword.add_uncovered":
      return `将${subject}添加到元数据`;
    case "keyword.defend":
      return `守住${subject}的前 10 名${evidence.entrants.length ? `，已有 ${evidence.entrants.length} 个新应用进入前 10` : ""}`;
    case "keyword.prune":
      return `考虑停止跟踪${subject}：${evidence.checkedDays} 天内只有 ${evidence.rankedDays} 天有排名`;
    case "rank.investigate_drop":
      return evidence.visibilityDelta
        ? `调查更改${fields(evidence.fields)}后可见度下降 ${number(Math.abs(evidence.visibilityDelta))} 分的原因`
        : `调查更改${fields(evidence.fields)}后 ${evidence.droppedKeywords.length} 个关键词排名下降的原因`;
    case "serp.hold_volatile":
      return `等${subject}的搜索结果稳定后再更改`;
    case "audit.fix_factor":
      return `改进${text(evidence.factorLabel)}，当前评分为 ${number(evidence.score)}/10`;
    case "reviews.investigate_theme":
      return `调查${evidence.version ?? "最新版本"}的评论中与${quote(evidence.theme)}相关的问题`;
    case "market.improve_country":
      return `缩小${country(evidence.country)}市场 ${number(evidence.gap)} 分的可见度差距`;
    case "keyword.push_to_top10":
      return `把${subject}从第 ${evidence.latestPosition} 名提升到前 10 名`;
    case "rank.investigate_unexplained_drop":
      return evidence.visibilityDelta < 1 && evidence.droppedKeywords.length
        ? `调查${country(evidence.country)}市场 ${evidence.droppedKeywords.length} 个关键词排名下降的原因`
        : `调查${country(evidence.country)}市场可见度下降 ${number(evidence.visibilityDelta)} 分的原因`;
    case "competitor.investigate_overtake":
      return `${evidence.competitorName ?? "某个竞品"}更改了${fields(evidence.fields)}，并在 ${evidence.keywords.length} 个关键词上超过了你的应用`;
    case "reviews.investigate_rating_decline":
      return `最近 ${evidence.recentDays} 天，评论评分从 ${number(evidence.baselineAverage)} 降至 ${number(evidence.recentAverage)}`;
    case "reviews.reply_negative":
      return `回复 ${evidence.unanswered} 条尚未回复的低分评论`;
    case "listing.ship_update":
      return `发布更新：商店详情页已 ${formatMeasure(evidence.daysSinceUpdate)} 天未更新`;
    case "conversion.investigate_drop":
      return `${country(evidence.country)}市场页面访问量持平，但获取点击次数下降`;
    case "listing.cpp_underperforms":
      return `${quote(evidence.pageTitle)}的转化率低于默认产品页`;
    case "metadata.fix_lint":
      return `修正${text(METADATA_FIELD_LABELS[evidence.field])}中的 ${evidence.issues.length} 个商店规则问题`;
  }
}
