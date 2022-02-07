'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('template-parameters.specifyValues', async (activeEditor, activeEditorEdit) => {
        let text = activeEditor.document.getText();
        let templates = text.match(/(?<=<).*?(?=>)/g);
        templates = [...new Set(templates)];
        templates = templates.filter((template) => template.split(",").length === 3);
        
        if (templates.length === 0) {
            vscode.window.showErrorMessage("No valid templates found.\nValid format <NAME,TYPE,VALUE>");
        }
        for (let template of templates) {
            let templateData = template.split(",");
            let templateName = templateData[0];
            let templateType = templateData[1];
            let templateValue = templateData[2];

            let options: vscode.InputBoxOptions = {
                prompt: `${templateName} (Type: ${templateType.length === 0 ? "undefined": templateType})`,
                value: templateValue
            };
            let promptResult = await vscode.window.showInputBox(options);
            if (promptResult) {
                text = text.replaceAll(`<${template}>`, promptResult);
            }
        }

        let invalidRange = new vscode.Range(0, 0, activeEditor.document.lineCount, 0);
        let validFullRange = activeEditor.document.validateRange(invalidRange);
        activeEditor.edit((editBuilder) => {
            editBuilder.replace(validFullRange, text);
        });
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}