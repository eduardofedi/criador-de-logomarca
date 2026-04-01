export enum LogoStyle {
  MINIMALISTA = 'Minimalista',
  MODERNO = 'Moderno',
  ELEGANTE = 'Elegante',
  DIVERTIDO = 'Divertido',
  FUTURISTA = 'Futurista',
}

export interface LogoFormData {
  name: string;
  niche: string;
  colors?: string;
  style?: LogoStyle;
}

export interface GenerationResult {
  imageUrl: string;
  mimeType: string;
}

export enum AppStep {
  FORM = 'FORM',
  GENERATING_PREVIEW = 'GENERATING_PREVIEW',
  PREVIEW = 'PREVIEW',
  GENERATING_FINAL = 'GENERATING_FINAL',
  SUCCESS = 'SUCCESS',
}