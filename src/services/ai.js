export async function callClaude(apiKey, sys, msgs) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
    body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1200, system:sys, messages:msgs})
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message || `HTTP ${res.status}`);
  return d.content?.[0]?.text || '';
}

export async function callGemini(apiKey, sys, msgs) {
  const contents = msgs.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{text: m.content}]
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {method:'POST', headers:{'Content-Type':'application/json'},
     body: JSON.stringify({system_instruction:{parts:[{text:sys}]}, contents, generationConfig:{maxOutputTokens:1200, temperature:0.9}})}
  );
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message || `HTTP ${res.status}`);
  return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function callOpenAI(apiKey, sys, msgs) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
    body: JSON.stringify({model:'gpt-4o-mini', max_tokens:1200,
      messages:[{role:'system', content:sys}, ...msgs]})
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message || `HTTP ${res.status}`);
  return d.choices?.[0]?.message?.content || '';
}

export async function callGroq(apiKey, sys, msgs) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
    body: JSON.stringify({model:'llama-3.3-70b-versatile', max_tokens:1200,
      messages:[{role:'system', content:sys}, ...msgs]})
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message || `HTTP ${res.status}`);
  return d.choices?.[0]?.message?.content || '';
}

export async function callAI(provider, apiKey, sys, msgs) {
  if (provider === 'gemini') return callGemini(apiKey, sys, msgs);
  if (provider === 'openai') return callOpenAI(apiKey, sys, msgs);
  if (provider === 'groq')   return callGroq(apiKey, sys, msgs);
  return callClaude(apiKey, sys, msgs);
}
