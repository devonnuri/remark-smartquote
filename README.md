# remark-smartquote

This is a [remark](https://github.com/remarkjs/remark) plugin to make plain quotation marks (`'`, `"`) content-aware. Inspired by [smartquote](https://typst.app/docs/reference/text/smartquote/) from [typst](https://typst.app/).

## Example

When using `remark-smartquote`, given the following markdown:

```md
"I thought it was 'If a body catch a body,'" I said.
```

...remark will output:

```
“I thought it was ‘If a body catch a body,’” I said.
```

## Usage

```js
import { remark } from 'remark';
import smartquote from 'remark-smartquote';

const input = `"I thought it was 'If a body catch a body,'" I said.`;

remark()
  .use(smartquote)
  .process(input, (err, file) => {
    if (err) {
      console.error(err);
    } else {
      console.log(String(file));
    }
  });
```

## Options

### `options.quotes`

Type: `[string, string, string, string]`

Default: `['‘', '’', '“', '”']`

An array of qutoes to use. `[opening-single, closing-single, opening-double, closing-double]`

```js
remark()
  .use(smartquote, { quotes: ['‚', '‘', '„', '“'] })
  .process(input, (err, file) => {
    if (err) {
      console.error(err);
    } else {
      console.log(String(file));
    }
  });
```
