import { Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';
import { SERP_DEPTH } from '@asobeast/shared';
import { PrismaService } from '../prisma/prisma.service';
import { DAY_MS, utcToday } from './rankings.support';

const RECHECK_DELAY_MS = 5 * 60_000;

export const RANK_RECHECK_SELECT = {
  rankRecheckAfter: true,
  rankRecheckApps: true,
  rankRecheckHasValidMiss: true,
} as const;

interface RecheckKeyword {
  id: string;
  store: Store;
  rankRecheckAfter: Date | null;
  rankRecheckApps: string[];
  rankRecheckHasValidMiss: boolean;
}

type CaptureDecision = { record: true } | { record: false; retryAt?: Date };

@Injectable()
export class RankRecheck {
  constructor(private readonly prisma: PrismaService) {}

  async assess(
    keyword: RecheckKeyword,
    ownAppIds: ReadonlySet<string>,
    positions: ReadonlyMap<string, number>,
  ): Promise<CaptureDecision> {
    if (keyword.store !== Store.APP_STORE) return { record: true };
    const absent = [...ownAppIds].filter((id) => !positions.has(id));
    if (absent.length === 0) return { record: true };

    const previous = await this.previousTopApps(
      keyword.id,
      keyword.rankRecheckAfter !== null,
    );
    const absentSet = new Set(absent);
    const missing = previous
      .map(({ storeAppId }) => storeAppId)
      .filter((storeAppId) => absentSet.has(storeAppId));
    const pendingMissing = keyword.rankRecheckApps.filter((id) =>
      absentSet.has(id),
    );
    const candidates = [...new Set([...missing, ...pendingMissing])];
    if (candidates.length === 0) return { record: true };

    const valid = positions.size >= Math.max(1, previous.length);
    const alreadyPending = new Set(keyword.rankRecheckApps);
    const sameMiss = candidates.every((id) => alreadyPending.has(id));
    if (keyword.rankRecheckAfter && sameMiss) {
      if (!valid) return { record: false };
      if (keyword.rankRecheckHasValidMiss) return { record: true };
    }

    const retryAt = new Date(Date.now() + RECHECK_DELAY_MS);
    await this.prisma.keyword.updateMany({
      where: { id: keyword.id, rankRecheckAfter: keyword.rankRecheckAfter },
      data: {
        rankRecheckAfter: retryAt,
        rankRecheckApps: candidates,
        rankRecheckHasValidMiss: valid,
      },
    });
    return { record: false, retryAt };
  }

  async resolve(keyword: RecheckKeyword): Promise<void> {
    if (!keyword.rankRecheckAfter) return;
    await this.prisma.keyword.updateMany({
      where: { id: keyword.id, rankRecheckAfter: keyword.rankRecheckAfter },
      data: {
        rankRecheckAfter: null,
        rankRecheckApps: [],
        rankRecheckHasValidMiss: false,
      },
    });
  }

  private async previousTopApps(keywordId: string, pending: boolean) {
    const earliest = new Date(utcToday().getTime() - DAY_MS);
    const latest = await this.prisma.serpEntry.findFirst({
      where: { keywordId, ...(pending ? {} : { date: { gte: earliest } }) },
      orderBy: { date: 'desc' },
      select: { date: true },
    });
    if (!latest) return [];
    return this.prisma.serpEntry.findMany({
      where: { keywordId, date: latest.date, position: { lte: SERP_DEPTH } },
      select: { storeAppId: true },
    });
  }
}
