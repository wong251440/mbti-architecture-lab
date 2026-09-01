# MBTI Architecture Lab

依照 `設計.txt`、`題庫2.txt` 與 `結果文字.txt` 建立的單頁測量原型。題目文字、選項與後端標記由 `題庫2.txt` 在載入時解析；結果文案由 `結果文字.txt` 的固定 `text_id` 查表並以 deterministic variables 插值，不使用 LLM。整個測驗不把對立 pole 當成互補百分比，而是保留 24 facets、8 poles、4 組相對偏好、情境差異與認知成本。

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
- `SCORING_VERSION` 目前為 `1.1`、`QUESTION_BANK_VERSION` 為 `DCA-v2.1`；每份 response 會保存 `user_id`、`item_id`、`answer`、`responseTime`、`timestamp` 與 scoring version
- 結果頁提供 8 poles、8 cognitive cost channels、24 facets、integration、polarization、activity、context map、response quality 與 measurement confidence
- Page 4 會以八個 Cognitive Function Indicators 分數，和 16 組標準 Jung function stack 做加權相似度比對，顯示最接近的 MBTI 轉換結果；這個轉換只在 Page 4 顯示，不會改寫 Page 1 的 Best-fit
- `RESULT_COPY_VERSION` 為 `DCA-Report-v1.0-candidate-zhHant`，完整載入 205 個結果模板：Page 1–7、Facet 分級、Cognitive Function、Dynamic Profile、Dual Channel Analysis 與 Distinctive Profile

這版以瀏覽器 `localStorage` 保存測量進度與結果。每次作答、翻頁與離開頁面都會更新本機紀錄；只有按下「重新測驗」才會清除紀錄。查看示範報告會使用暫時資料，不會覆蓋既有作答。未連接遠端資料庫或 AI 文字生成服務；後續可直接把 `state.responses` 與 `scoreAll` 接到 API。
