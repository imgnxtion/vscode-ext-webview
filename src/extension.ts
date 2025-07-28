import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.openWebView", async () => {
    const fileUris = await vscode.window.showOpenDialog({
      canSelectMany: false,
      openLabel: "Select a file to display",
      filters: {
        "HTML files": ["html"],
        "All files": ["*"],
      },
    });

    if (!fileUris || fileUris.length === 0) {
      vscode.window.showWarningMessage("No file selected.");
      return;
    }

    const selectedFile = fileUris[0];

    const panel = vscode.window.createWebviewPanel("webview", "My WebView", vscode.ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.dirname(selectedFile.fsPath))],
    });

    panel.webview.html = getWebviewContent(selectedFile);
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(fileUri: vscode.Uri): string {
  const fileSrc = fileUri.toString();
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>WebView</title>
        </head>
        <body>
            <iframe src="${fileSrc}" style="width: 100%; height: 100%; border: none;"></iframe>
        </body>
        </html>
    `;
}

export function deactivate() {}
