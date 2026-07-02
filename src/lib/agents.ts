export interface BrandBrief {
  companyName: string;
  industry: string;
  style: 'minimalist' | 'vibrant' | 'luxury' | 'tech' | 'custom';
  description: string;
}

export interface LogoResult {
  html: string;
  concept: string;
}

export async function generateLogo(brief: BrandBrief): Promise<LogoResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada no .env.local');
  }

  // 1. Agent: Creative Director (OpenAI GPT-4o) - Cria o prompt otimizado para a IA de Imagem
  const systemPrompt = `Você é um Diretor de Arte Sênior especialista em Branding e Engenharia de Prompts de Imagem.
  Seu objetivo é analisar o briefing do cliente e criar um prompt em INGLÊS extremamente otimizado para gerar um logotipo profissional no gpt-image-2.
  
  O prompt gerado deve seguir os seguintes conceitos e diretrizes:
  - Paul Rand: partir de uma ideia simples, forte e memorável.
  - Massimo Vignelli: funcionar como sistema visual, com proporção, tipografia, contraste e aplicação consistente em digital, impresso, avatar, fachada e preto e branco.
  - Paula Scher: ter voz própria, presença e personalidade visual clara, sem parecer genérico ou “premium vazio”.
  
  Direção criativa:
  - Criar uma marca visualmente simples, mas com conceito inteligente;
  - Priorizar reconhecimento imediato;
  - Seguir exatamente o que o cliente pedir no briefing de forma literal (ex: se pediu "uma fatia de pizza", descreva uma fatia de pizza no ícone);
  - Usar tipografia com personalidade;
  - Criar símbolo ou logotipo com forma própria;
  - Manter alta legibilidade;
  - Funcionar em fundo claro e escuro;
  - Parecer uma marca real, forte e duradoura.
  - Fundo: O logotipo deve ser apresentado centralizado em um fundo totalmente branco, plano e sólido ("isolated on a clean, solid, flat, pure white background").
  
  Estilo desejado:
  logo profissional, minimalista, conceitual, memorável, com identidade própria, alto contraste, geometria equilibrada, tipografia bem escolhida, aplicação premium, sem mockup, sem textura, sem fundo elaborado, apenas apresentação limpa do logo.
  
  Não usar (Negativas):
  símbolos genéricos, ícones de banco de imagem, mascotes aleatórios, excesso de detalhes, gradientes exagerados, efeitos 3D, sombras pesadas, clichês do nicho ou elementos decorativos sem função conceitual.
  
  SAÍDA: Retorne APENAS o prompt em inglês pronto para ser enviado à API de imagem. Não adicione nenhuma introdução, explicação, marcações de markdown ou aspas.`;

  const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Briefing do Cliente:
        - Nome da Empresa: ${brief.companyName}
        - Ramo de Atuação: ${brief.industry}
        - Estilo Visual: ${brief.style}
        - Sobre o Negócio / Preferências: ${brief.description}` }
      ],
      temperature: 0.3
    })
  });

  const chatData = await chatResponse.json();
  if (chatData.error) {
    throw new Error(`OpenAI Chat Error: ${chatData.error.message}`);
  }

  const imagePrompt = chatData.choices[0].message.content.trim();

  // 2. Chamada para a API do gpt-image-2 (OpenAI) para gerar a imagem
  const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024'
    })
  });

  const imageData = await imageResponse.json();
  if (imageData.error) {
    throw new Error(`OpenAI Image Error: ${imageData.error.message}`);
  }

  const base64Image = imageData.data[0].b64_json;
  
  // Envolvemos a imagem base64 em uma tag img padrão, mantendo o fundo branco original
  const htmlImg = `<img src="data:image/png;base64,${base64Image}" alt="Logo" class="w-full h-full object-contain" />`;

  return {
    html: htmlImg,
    concept: imagePrompt,
  };
}
