# GET Started To Convert This App As An Shopify Extension

```
npm install

yarn install

```

### Step 1:

- Run This Command `cp -r .env.example .env` into root directory
- Change VITE_PROXY_URL to '/[Subpath prefix]/[subpath]' from App Proxy Configuration (https://partners.shopify.com/[Your Partner Code]/apps/[Your App Code]/edit)
- Generate An extension from shopify node template using shopify cli

### Step 2:

- Copy This Liquid Template

```
<div class="root"></div>

{% schema %}
  {
    "name": "React SHPFY Extension",
    "target": "section",
    "javascript": "bundle.js",
    "settings": []
  }
{% endschema %}

```

- Create a new app block and paste this

- Goto Your React Extension Application Run

```
npm run build
yarn build
```

- copy index-[random_number].js file from your dist/assets folder and paste it into app block
- Rename index-[random_number].js to build.js

- Deploy extension using shopify cli or package scripts

- For additional Style change please let me kno
