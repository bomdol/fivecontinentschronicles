// SSE 스트림을 읽어 전체 텍스트 반환. getDelta: JSON 청크 → 텍스트 조각
async function readSSE(res, getDelta, onChunk) {
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = '';
  let buf  = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    buf += dec.decode(value, {stream: true});
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const delta = getDelta(JSON.parse(data));
        if (delta) { full += delta; onChunk(full); }
      } catch {}
    }
  }
  return full;
}

export async function callClaude(apiKey, sys, msgs, onChunk) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
    body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1200,
      stream: true, system:sys, messages:msgs})
  });
  if (!res.ok) { const d = await res.json(); throw new Error(d.error?.message || `HTTP ${res.status}`); }
  return readSSE(res,
    d => d.type === 'content_block_delta' && d.delta?.type === 'text_delta' ? d.delta.text : null,
    onChunk);
}

export async function callGemini(apiKey, sys, msgs, onChunk) {
  const contents = msgs.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{text: m.content}]
  }));
  const body = JSON.stringify({
    system_instruction: {parts:[{text:sys}]},
    contents,
    generationConfig: {maxOutputTokens:800, temperature:0.9}
  });
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:streamGenerateContent?key=${apiKey}&alt=sse`,
    {method:'POST', headers:{'Content-Type':'application/json'}, body}
  );
  if (!res.ok) { const d = await res.json(); throw new Error(d.error?.message || `HTTP ${res.status}`); }
  return readSSE(res,
    d => d.candidates?.[0]?.content?.parts?.[0]?.text || null,
    onChunk);
}

export async function callOpenAI(apiKey, sys, msgs, onChunk) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
    body: JSON.stringify({model:'gpt-4o-mini', max_tokens:1200, stream:true,
      messages:[{role:'system', content:sys}, ...msgs]})
  });
  if (!res.ok) { const d = await res.json(); throw new Error(d.error?.message || `HTTP ${res.status}`); }
  return readSSE(res,
    d => d.choices?.[0]?.delta?.content || null,
    onChunk);
}

export async function callGroq(apiKey, sys, msgs, onChunk) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
    body: JSON.stringify({model:'llama-3.3-70b-versatile', max_tokens:800, stream:true,
      messages:[{role:'system', content:sys}, ...msgs]})
  });
  if (!res.ok) { const d = await res.json(); throw new Error(d.error?.message || `HTTP ${res.status}`); }
  return readSSE(res,
    d => d.choices?.[0]?.delta?.content || null,
    onChunk);
}

export async function callAI(provider, apiKey, sys, msgs, onChunk) {
  if (provider === 'gemini') return callGemini(apiKey, sys, msgs, onChunk);
  if (provider === 'openai') return callOpenAI(apiKey, sys, msgs, onChunk);
  if (provider === 'groq')   return callGroq(apiKey, sys, msgs, onChunk);
  return callClaude(apiKey, sys, msgs, onChunk);
}
