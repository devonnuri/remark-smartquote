import type { Node, Parents, Root, Text } from 'mdast';
import type { Plugin } from 'unified';
import { VisitorResult, visitParents } from 'unist-util-visit-parents';

/**
 * Configuration of remark-smartquote plugin.
 */
export interface RemarkSmartquoteOptions {
  /**
   * An array of qutoes to use. `[opening-single, closing-single, opening-double, closing-double]`
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

  return function (tree) {
    // The amount of quotes that have been opened.
    let depth = 0;

    // Each bit indicates whether the quote at this nesting depth is a double.
    // Max depth is 32.
    let kinds = 0;

    visitParents(tree, 'text', visitor);

    // The top of our quotation stack.
    // Returns true if the top quote is a double quote,
    //        false if it is a single quote,
    //         null if there are no quotes.
    function top(): boolean | null {
      return depth > 0 ? Boolean((kinds >> (depth - 1)) & 1) : null;
    }

    function push(double: boolean): void {
      if (depth < 32) {
        kinds |= (double ? 1 : 0) << depth;
        depth++;
      }
    }

    function pop(): void {
      if (depth > 0) {
        depth--;
        kinds &= (1 << depth) - 1;
      }
    }

    function visitor(node: Text, ancestors: Parents[]): VisitorResult {
      const parent = ancestors[ancestors.length - 1];
      const siblings: Node[] = parent.children;
      const [singleOpen, singleClose, doubleOpen, doubleClose] =
        settings.quotes;

      let result = '';
      for (let i = 0; i < node.value.length; i++) {
        const char = node.value[i];
        const before = node.value[i - 1] || ' ';
        if (char !== '"' && char !== "'") {
          result += char;
          continue;
        }

        const opened = top();
        const double = char === '"';

        // If we are after a number and haven't most recently opened a quote of
        // this kind, produce a prime. Otherwise, we prefer a closing quote.
        if (before.match(/\d/) && opened !== double) {
          result += double ? '″' : '′';
          continue;
        }

        // If we have a single smart quote, didn't recently open a single
        // quotation, and are after an alphabetic char, interpret this as an
        // apostrophe.
        if (!double && opened !== false && before.match(/[a-zA-Z]/)) {
          result += '’';
          continue;
        }

        // If the most recently opened quotation is of this kind and the
        // previous char does not indicate a nested quotation, close it.
        if (opened === double && !before.match(/[\s\u{0085}({[]/u)) {
          pop();
          result += double ? doubleClose : singleClose;
          continue;
        }

        // Otherwise, open a new quotation.
        push(double);
        result += double ? doubleOpen : singleOpen;
      }

      siblings.splice(siblings.indexOf(node), 1, {
        type: 'text',
        value: result,
      } as Text);
    }
  };
};

export default plugin;
