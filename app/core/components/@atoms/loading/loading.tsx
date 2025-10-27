import clsx from 'clsx';

import { LoadingProps } from './types';

export default function Loading(props: LoadingProps) {
  const { block, className, size = 'md', ...others } = props;
  const classes = clsx(className, 'ui-loading', { 'ui-block': block });

  return (
    <div className={classes} data-size={size} {...others}>
      <div className="inner">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="hidden">Loading...</span>
    </div>
  );
}
