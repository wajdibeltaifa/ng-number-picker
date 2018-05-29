

export type buttonsOrientationType = 'horizontal' | 'vertical' | 'h' | 'v';
export type sizeType = 'medium' | 'large' | 'small' | 'xlarge' | 'md' | 'lg' | 'sm' | 'xlg';

export interface CustomClasses {
  container?: string; // custom class for the component container
  up?: string; // custom class for the upwards buttons
  down?: string; // custom class for the downwards buttons
  postfix?: string; // custom class for the text after the input
  prefix?: string; // custom class for the text before the input
  success?: string; // TODO:
  error?: string; // TODO:
}
