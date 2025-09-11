async function checkEmailSpam(emailContent) {
  const API_KEY = 'sqdrKYLp4SKWMtYSEHecfPyObSVHs4f9';
  const headers = new Headers({ apikey: API_KEY });
  const options = {
    method: 'POST',
    headers,
    body: emailContent
  };
  const response = await fetch("https://api.apilayer.com/spamchecker?threshold=5", options);
  if (!response.ok) {
    if (response.status === 403) throw new Error('خطأ في مفتاح API');
    if (response.status === 429) throw new Error('تجاوزت حد API');
    throw new Error('خطأ: ' + (await response.json()).message);
  }
  const data = await response.json();
  return { score: data.score || 0, isSpam: data.is_spam || false, rules: [{ description: data.result || 'تم تحليل المحتوى' }] };
}

async function handleEmailCheck() {
  const emailInput = document.getElementById("emailInput").value.trim();
  const resultDiv = document.getElementById("result");
  
  if (!emailInput) {
    resultDiv.innerHTML = "<span class='danger'>أدخل بريداً!</span>";
    return;
  }

  resultDiv.innerHTML = "<span class='loading'>جاري الفحص...</span>";

  try {
    const emailContent = `From: sender@example.com\nTo: recipient@example.com\nSubject: Important Message\n${emailInput}\nClick here: http://bit.ly/random`;
    const result = await checkEmailSpam(emailContent);
    
    let resultText;
    if (result.score >= 7.5) {
      resultText = `⚠️ خطير جداً! درجة الخطر: ${result.score.toFixed(2)}/10`;
      resultDiv.innerHTML = `<span class='high-danger'>${resultText}</span>`;
    } else if (result.score >= 5.0) {
      resultText = `⚠️ مشبوه! درجة الخطر: ${result.score.toFixed(2)}/10`;
      resultDiv.innerHTML = `<span class='danger'>${resultText}</span>`;
    } else if (result.score >= 3.0) {
      resultText = `⚠️ قد يكون مشبوه! درجة الخطر: ${result.score.toFixed(2)}/10`;
      resultDiv.innerHTML = `<span class='warning'>${resultText}</span>`;
    } else {
      resultText = `✅ آمن! درجة الخطر: ${result.score.toFixed(2)}/10`;
      resultDiv.innerHTML = `<span class='safe'>${resultText}</span>`;
    }

    if (result.rules?.length) {
      const reasonsContainer = document.createElement("div");
      reasonsContainer.className = "reasons-container";
      reasonsContainer.innerHTML = "<h4>أسباب التقييم:</h4><ul>" + result.rules.map(rule => `<li>${rule.description}</li>`).join('') + "</ul>";
      resultDiv.appendChild(reasonsContainer);
    }
  } catch (error) {
    resultDiv.innerHTML = `<span class='danger'>خطأ: ${error.message}</span>`;
  }
}

window.checkSpam = handleEmailCheck;
