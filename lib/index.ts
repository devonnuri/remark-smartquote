import type { Root } from 'mdast';
import type { Plugin } from 'unified';

import { replaceQuotes } from './replace.js';

export type Quotes = [string, string, string, string];

/**
 * Configuration of remark-smartquote plugin.
 */
export interface RemarkSmartquoteOptions {
  /**
   * An array of qutoes to use. [opening-single, closing-single, opening-double, closing-double]
   *
   * @defaultValue ['‘', '’', '“', '”']
   */
  quotes: Quotes;
}

const DEFAULT_SETTINGS: RemarkSmartquoteOptions = {
  quotes: ['‘', '’', '“', '”'],
};

const plugin: Plugin<
  [(Partial<RemarkSmartquoteOptions> | null | undefined)?],
  Root
> = (options) => {
  const settings = { ...DEFAULT_SETTINGS, ...options };

  return function (tree) {
    replaceQuotes(tree, settings.quotes);
  };
};

export default plugin;
