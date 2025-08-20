/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, Uri } from 'vscode';
import { LanguageClientOptions } from 'vscode-languageclient';

import { LanguageClient } from 'vscode-languageclient/browser';

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {

	console.log('Perl Navigator web client activated!');

	/* 
	 * all except the code to create the language client in not browser specific
	 * and could be shared with a regular (Node) extension
	 */
	const documentSelector = [
		{ language: 'perl' },
	]

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {},
		initializationOptions: {}
	};

	const client = createWorkerLanguageClient(context, clientOptions);

	await client.start();
	context.subscriptions.push(client);
}

function createWorkerLanguageClient(context: ExtensionContext, clientOptions: LanguageClientOptions) {
	// Create a worker. The worker main file implements the language server.
	const serverMain = Uri.joinPath(context.extensionUri, 'browser-ext/dist/browserServerMain.js');
	const worker = new Worker(serverMain.toString(true));

	// create the language server client to communicate with the server running in the worker
	return new LanguageClient('perlnavigator-web', 'Perl Navigator Web', clientOptions, worker);
}