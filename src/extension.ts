"use strict";

import * as vscode from "vscode";
// import format from "html-format";

// class HTMLDocumentFormatter implements vscode.DocumentFormattingEditProvider {
//   public provideDocumentFormattingEdits(
//     document: vscode.TextDocument,
//     options: vscode.FormattingOptions
//   ): Thenable<vscode.TextEdit[]> {
//     const { tabSize, insertSpaces } = options;
//     const indent = insertSpaces ? " ".repeat(tabSize) : "\t";
//     const { languageId: lang, uri } = document;
//     const langConfig = vscode.workspace.getConfiguration(`[${lang}]`, uri);
//     const config = vscode.workspace.getConfiguration("editor", uri);
//     const width = langConfig["editor.wordWrapColumn"] || config.get("wordWrapColumn");
//     const text = document.getText();
//     const range = new vscode.Range(
//       document.positionAt(0),
//       document.positionAt(text.length)
//     );
//     return Promise.resolve([
//       new vscode.TextEdit(range, format(text, indent, width)),
//     ]);
//   }
// }

function jetFormat(text: string, indent: string, width: number): string {
  indent = indent + 0
  width = width + 0
  text = text.replace('{{ block', '^^bLoCk')
  text = text.replace('{{block', '{{ block')
  text = text.replace('^^bLoCk', '{{block')
  return text
}

class JetFormatter implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): Thenable<vscode.TextEdit[]> {
    const { tabSize, insertSpaces } = options;
    const indent = insertSpaces ? " ".repeat(tabSize) : "\t";
    const { languageId: lang, uri } = document;
    const langConfig = vscode.workspace.getConfiguration(`[${lang}]`, uri);
    const config = vscode.workspace.getConfiguration("editor", uri);
    const width = langConfig["editor.wordWrapColumn"] || config.get("wordWrapColumn");
    const text = document.getText();
    const range = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );
    return Promise.resolve([
      new vscode.TextEdit(range, jetFormat(text, indent, width)),
    ]);
  }
}

export function activate(context: vscode.ExtensionContext) {
  // 👍 formatter implemented using API
  // vscode.languages.registerDocumentFormattingEditProvider('jet', {
  //     provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
  //         const firstLine = document.lineAt(0);
  //         if (firstLine.text !== '42') {
  //             return [vscode.TextEdit.insert(firstLine.range.start, '42\n')];
  //         }
  //     }
  // });

  const jetFormatter = new JetFormatter();
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("html", jetFormatter)
  );
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("jet", jetFormatter)
  );

}

export function deactivate() { }
