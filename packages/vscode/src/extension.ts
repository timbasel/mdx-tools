import { InitializationOptions } from '@volar/language-server';
import * as serverProtocol from '@volar/language-server/protocol';
import { ExportsInfoForLabs, activateAutoInsertion, supportLabsVersion } from '@volar/vscode';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';

let client: lsp.BaseLanguageClient;

export async function activate(context: vscode.ExtensionContext) {

	const serverModule = vscode.Uri.joinPath(context.extensionUri, 'dist', 'server.js');
	const runOptions = { execArgv: <string[]>[] };
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + 6009] };
	const serverOptions: lsp.ServerOptions = {
		run: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
			options: runOptions
		},
		debug: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
			options: debugOptions
		},
	};
	const initializationOptions: InitializationOptions = {
		// no need tsdk because mdx language server do not needed TS support, you can uncomment this line if needed
		// typescript: { tsdk: require('path').join(vscode.env.appRoot, 'extensions/node_modules/typescript/lib') },
	};
	const clientOptions: lsp.LanguageClientOptions = {
		documentSelector: [{ language: 'mdx' }],
		initializationOptions,
	};
	client = new lsp.LanguageClient(
		'mdx-language-server',
		'mdx Language Server',
		serverOptions,
		clientOptions,
	);
	await client.start();

	// support for auto close tag
	activateAutoInsertion([client], document => document.languageId === 'mdx');

	// support for https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volarjs-labs
	// ref: https://twitter.com/johnsoncodehk/status/1656126976774791168
	return {
		volarLabs: {
			version: supportLabsVersion,
			languageClients: [client],
			languageServerProtocol: serverProtocol,
		},
	} satisfies ExportsInfoForLabs;
}

export function deactivate(): Thenable<any> | undefined {
	return client?.stop();
}
