export type UIControlProps = {
  /** display block(flex) */
  block?: boolean;

  /** 추가 classname */
  className?: string;

  /** 추가 style */
  style?: React.CSSProperties;
};

export const games = {
  reaction: '반응속도 Game',
  aimtest: 'Aim Game',
} as const;

export type GameCode = keyof typeof games;
