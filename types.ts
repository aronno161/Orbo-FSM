export enum Language {
  Bangla = 'Bangla',
  Hindi = 'Hindi',
  Hinglish = 'Hinglish',
}

export interface Dialogue {
  character: string;
  line: string;
}

export interface Script {
  title: string;
  characters: string;
  sceneSetup: string;
  script: Dialogue[];
  punchline: string;
}