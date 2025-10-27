import { UIControlProps } from '../../types';

export type LoadingProps = {
  size?: 'sm' | 'md';
} & UIControlProps &
  React.HTMLAttributes<HTMLDivElement>;
