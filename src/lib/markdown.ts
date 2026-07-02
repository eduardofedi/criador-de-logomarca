export function parseMarkdown(md: string): string {
  if (!md) return '';
  
  return md
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-white">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-white border-b border-gray-800 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black mt-10 mb-6 text-white">$1</h1>')
    
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
    
    // Lists
    .replace(/^\s*-\s*(.*$)/gim, '<li class="ml-6 list-disc text-gray-300 my-1.5">$1</li>')
    
    // Paragraphs (split by double newlines, wrap in p if not a header or list item)
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<ul')) {
        return trimmed;
      }
      return `<p class="mb-4 text-gray-300 leading-relaxed text-base">${trimmed}</p>`;
    })
    .join('\n');
}
