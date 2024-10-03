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

// function executeWithTimeout<T>(command: string, args: any[], timeout: number): Promise<T> {
//   return new Promise<T>((resolve, reject) => {
//     const timer = setTimeout(() => {
//       reject(new Error('Formatting timeout exceeded.'));
//     }, timeout);

//     vscode.commands.executeCommand<T>(command, ...args)
//       .then((result) => {
//         clearTimeout(timer);
//         resolve(result);
//       })
//       .catch((error) => {
//         clearTimeout(timer);
//         reject(error);
//       });
//   });
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
  public async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): Promise<vscode.TextEdit[]> {
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

    // Step 1: Invoke the built-in HTML formatter first
    // try {
    //   const htmlEdits = await executeWithTimeout<vscode.TextEdit[]>(
    //     'vscode.executeFormatDocumentProvider',
    //     [document.uri, { insertSpaces: insertSpaces, tabSize: tabSize } as vscode.FormattingOptions],
    //     5000 // 5 seconds timeout
    //   );
    // } catch (error) {
    //   console.error('Error or timeout occurred:', error);
    // }
    console.log('Formatting start...');
    const startHTMLTime = Date.now();

    const htmlEdits: vscode.TextEdit[] = [];
    // await vscode.commands.executeCommand<vscode.TextEdit[]>(
    //   'vscode.executeFormatDocumentProvider',
    //   document.uri,
    //   { insertSpaces: insertSpaces, tabSize: tabSize } as vscode.FormattingOptions
    // );

    const endHTMLTime = Date.now();
    console.log(`HTML formatting done in ${endHTMLTime - startHTMLTime} ms`);

    if (!htmlEdits) {
      console.log('No edits returned by HTML formatter.');
    } else {
      console.log('HTML edits received:', htmlEdits);
    }

    // If HTML formatter returns edits, apply them first.
    const finalEdits: vscode.TextEdit[] = htmlEdits || [];

    // Step 2: Apply custom formatting logic for Jet template blocks.
    // let indentLevel = 0;

    const jetEdits: vscode.TextEdit[] = [];
    // // Combine HTML edits and Jet-specific edits

    jetEdits.push(new vscode.TextEdit(range, jetFormat(text, indent, width)));

    // const endJetTime = Date.now();
    // console.log(`All formatting done in ${endJetTime - startHTMLTime} ms`);

    // // for (let i = 0; i < document.lineCount; i++) {
    // // const line = document.lineAt(i);

    // //   // Regex to match Jet template tags
    // //   const blockStartRegex = /{{\s*(block|range|if)\b/;
    // //   const blockEndRegex = /{{\s*end\s*}}/;

    // //   // If the line contains {{end}}, decrease indent before the end tag
    // //   if (blockEndRegex.test(line.text.trim())) {
    // //     indentLevel = Math.max(0, indentLevel - 1);
    // //   }

    // //   // Adjust the indentation for Jet blocks based on current indent level
    // //   const newIndentation = '  '.repeat(indentLevel); // 2-space indent by default
    // //   const currentIndentation = line.text.match(/^\s*/)?.[0] || '';

    // //   // Add an edit only if the indentation needs to be corrected
    // //   if (currentIndentation !== newIndentation) {
    // //     const range = new vscode.Range(line.range.start, line.range.start.translate(0, currentIndentation.length));
    // //     jetEdits.push(vscode.TextEdit.replace(range, newIndentation));
    // //   }

    // //   // If the line contains a block start tag, increase the indent level for subsequent lines
    // //   if (blockStartRegex.test(line.text.trim())) {
    // //     indentLevel += 1;
    // //   }
    // // }


    console.log('Document language:', document.languageId);  // Should log 'html'

    return finalEdits.concat(jetEdits);
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
    vscode.languages.registerDocumentFormattingEditProvider("jet", jetFormatter)
  );
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("html", jetFormatter)
  );

}

export function deactivate() { }
