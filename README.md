# MBTI Architecture Lab

依照 `設計.txt` 與 `題庫.txt` 建立的單頁測量原型。題目文字與選項由 `題庫.txt` 在載入時解析，整個測驗不把對立 pole 當成互補百分比，而是保留 24 facets、8 poles、4 組相對偏好，以及情境差異。

## 啟動

在專案目錄執行：

```bash
python3 -m http.server 4173
```

再開啟 <http://127.0.0.1:4173/>。

## 內容

- 48 題 Behavioral Evidence（24 facets × 2）
- 12 題 Forced Cognitive Trade-offs（四軸各 3）
- 12 題 Micro-simulations（每題 Step 1 行動 + Step 2 動機）
- 8 題 Cognitive Cost / Recovery
- Boundary／channel disagreement 時，最多追加 8 題 Dynamic Probe
- `SCORING_VERSION` 目前為 `1.0`、`QUESTION_BANK_VERSION` 為 `DCA-v1.1`；每份 response 會保存 `user_id`、`item_id`、`answer`、`responseTime`、`timestamp` 與 scoring version
- 結果頁提供 8 poles、24 facets、integration、polarization、activity、context map、response quality 與 measurement confidence

這版以瀏覽器 `localStorage` 保存測量進度，未連接遠端資料庫或 AI 文字生成服務；後續可直接把 `state.responses` 與 `scoreAll` 接到 API。
