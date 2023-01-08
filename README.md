# exam-viewer-web

テスト結果のCSVをグラフ化するツール

## Demo

![exam-viewer-web-demo](https://user-images.githubusercontent.com/51781063/211185859-c90aad9c-02e6-4808-bfa2-babe5a47c77f.gif)

## Features

- 学生毎の解答結果から正答率を算出することができます
- 授業毎の正答率をグラフ化して表示することができます

## Requirements

- git 2.34.1
- Node.js 18.12.1
- yarn 3.3.1

## Development

```bash
git clone https://github.com/okapon1210/exam-viewer-web.git
cd exam-viewer-web
yarn --frozen-lockfile
```

## Deploy

```bash
git clone https://github.com/okapon1210/exam-viewer-web.git
cd exam-viewer-web
git subtree split --prefix dist -b gh-pages
git push -f origin gh-pages
git branch -D gh-pages
```

## Author

- [okapon1210](https://github.com/okapon1210)


## Changelog

- v.1.0 2023/01/08 完成
