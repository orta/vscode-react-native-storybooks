/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let previewUri = vscode.Uri.parse('storybook://authority/preview');
    class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
        public provideTextDocumentContent(uri: vscode.Uri): string {
            const port = vscode.workspace.getConfiguration('react-native-storybooks').get('port');

            return `
            <style>iframe {
                position: fixed;
                border: none;
                top: 0; right: 0;
                bottom: 0; left: 0;
                width: 100%;
                height: 100%;
            }
            </style>

            <body onload="iframe.document.head.appendChild(ifstyle)" style="background-color:red;margin:0px;padding:0px;overflow:hidden">
                <iframe src="http://localhost:${port}" frameborder="0"></iframe>
                <p>If you're seeing this, something is wrong :) (can't find server on port ${port})</p>
            </body>
            `
        }
    }

    let provider = new TextDocumentContentProvider();
    let registration = vscode.workspace.registerTextDocumentContentProvider('storybook', provider);

    // Registers the storyboards command to trigger a new HTML preview which hosts the storybook server 
    let disposable = vscode.commands.registerCommand('extension.showStorybookPreview', () => {
        return vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'Storybooks').then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    context.subscriptions.push(disposable, registration);
}

export function deactivate() {
}