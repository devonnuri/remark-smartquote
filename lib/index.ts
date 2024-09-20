import type { Root } from 'mdast';
import { findAndReplace } from 'mdast-util-find-and-replace';
import type { Plugin } from 'unified';

/**
 * Configuration of remark-smartquote plugin.
 */
export interface RemarkSmartquoteOptions {
  /**
   * An array of qutoes to use. [opening-single, closing-single, opening-double, closing-double]
   *
   * @defaultValue ['‘', '’', '“', '”']
   */
  quotes: [string, string, string, string];
}

const DEFAULT_SETTINGS: RemarkSmartquoteOptions = {
  quotes: ['‘', '’', '“', '”'],
};

const plugin: Plugin<
  [(Partial<RemarkSmartquoteOptions> | null | undefined)?],
  Root
> = (options) => {
  const settings = { ...DEFAULT_SETTINGS, ...options };
  const [singleOpen, singleClose, doubleOpen, doubleClose] = settings.quotes;

  return function (tree) {
    findAndReplace(tree, [
      /'(.*?)'(?!')/g,
      (_: string, content: string) => `${singleOpen}${content}${singleClose}`,
    ]);

    findAndReplace(tree, [
      /"(.*?)"(?!")/g,
      (_: string, content: string) => `${doubleOpen}${content}${doubleClose}`,
    ]);
  };
};

export default plugin;
