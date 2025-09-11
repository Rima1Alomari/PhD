import { fetchPrediction } from './api.js';

async function checkUrl() {
  const url = document.getElementById("urlInput").value.trim();
  const resultDiv = document.getElementById("result");
  
  if (!url) {
    resultDiv.innerHTML = "<span class='danger'>أدخل رابطاً!</span>";
    return;
  }

  resultDiv.innerHTML = "<span class='loading'>جاري الفحص...</span>";
  
  try {
    const { prediction, probability } = await fetchPrediction(url);
    const prob = probability.toFixed(2);
    
    if (prediction === "phishing") {
      resultDiv.innerHTML = `<span class='danger'>⚠️ الرابط غير آمن! نسبة الأمان: ${100 - prob}%</span>`;
    } else {
      resultDiv.innerHTML = `<span class='safe'>✅ الرابط آمن! نسبة الأمان: ${prob}%</span>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<span class='danger'>خطأ: ${error.message}</span>`;
  }
}

window.checkUrl = checkUrl;
