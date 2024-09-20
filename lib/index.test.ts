import assert from 'assert';
import { remark } from 'remark';

import smartquote from '@/index.js';

const defaultCompiler = remark().use(smartquote);
const guillemetsCompiler = remark().use(smartquote, {
  quotes: ['‹\u{00A0}', '\u{00A0}›', '«\u{00A0}', '\u{00A0}»'],
});

describe('remark-smartquote', function () {
  describe('default compiler', function () {
    it('replaces quotes with directional ones', async function () {
      const tests: [string, string][] = [
        [
          `"The horse eats no cucumber salad" was the first sentence ever uttered on the 'telephone.'\n`,
          `“The horse eats no cucumber salad” was the first sentence ever uttered on the ‘telephone.’\n`,
        ],
      ];

      for (const [input, expected] of tests) {
        const result = await defaultCompiler.process(input);
        assert.equal(
          String(result),
          expected,
          `input: ${JSON.stringify(input)}`,
        );
      }
    });

    it('replaces quotes inside quotes', async function () {
      const tests: [string, string][] = [
        [
          `"The 'horse' eats no cucumber salad" was the first sentence ever uttered on the 'telephone.'\n`,
          `“The ‘horse’ eats no cucumber salad” was the first sentence ever uttered on the ‘telephone.’\n`,
        ],
      ];

      for (const [input, expected] of tests) {
        const result = await defaultCompiler.process(input);
        assert.equal(
          String(result),
          expected,
          `input: ${JSON.stringify(input)}`,
        );
      }
    });

    it('korean test', async function () {
      const tests: [string, string][] = [
        [
          `민법 제1조는 "민사에 관하여 법률에 규정이 없으면 관습법에 의하고 관습법이 없으면 조리에 의한다."라고 규정하고 있다.\n`,
          `민법 제1조는 “민사에 관하여 법률에 규정이 없으면 관습법에 의하고 관습법이 없으면 조리에 의한다.”라고 규정하고 있다.\n`,
        ],
      ];

      for (const [input, expected] of tests) {
        const result = await defaultCompiler.process(input);
        assert.equal(
          String(result),
          expected,
          `input: ${JSON.stringify(input)}`,
        );
      }
    });
  });

  describe('compiler using guillemets as quotes', function () {
    it('replaces quotes with guillemets', async function () {
      const tests: [string, string][] = [
        [
          `"Le cheval ne mange pas de salade de concombre" était la première phrase jamais prononcée au 'téléphone.'\n`,
          `«\u{00A0}Le cheval ne mange pas de salade de concombre\u{00A0}» était la première phrase jamais prononcée au ‹\u{00A0}téléphone.\u{00A0}›\n`,
        ],
      ];

      for (const [input, expected] of tests) {
        const result = await guillemetsCompiler.process(input);
        assert.equal(
          String(result),
          expected,
          `input: ${JSON.stringify(input)}`,
        );
      }
    });
  });
});
