

export type buttonsOrientationType = 'horizontal' | 'vertical' | 'h' | 'v';
export type sizeType = 'medium' | 'large' | 'small' | 'xlarge' | 'md' | 'lg' | 'sm' | 'xlg';

export interface CustomClasses {
  container?: string;
  up?: string;
  down?: string;
  postfix?: string;
  prefix?: string;
  success?: string; // TODO:
  error?: string; // TODO:
}
