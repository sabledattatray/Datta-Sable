import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      setFontFamily: (font: string) => ReturnType;
      unsetFontFamily: () => ReturnType;
    };
  }
}

export const FontFamily = Extension.create({
  name: 'fontFamily',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontFamily || null,
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontFamily) return {};
              return { style: `font-family: ${attributes.fontFamily}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily:
        (font: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontFamily: font }).run();
        },
      unsetFontFamily:
        () =>
        ({ chain }) => {
          return (chain() as any).setMark('textStyle', { fontFamily: null }).removeEmptyTextStyle().run();
        },
    };
  },
});
