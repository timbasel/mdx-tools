import { Diagnostic, LanguageServerPlugin, Service, createConnection, startLanguageServer } from '@volar/language-server/node';
import createTypescriptService from "volar-service-typescript";
import { MDFile, language } from './language';

const plugin: LanguageServerPlugin = (): ReturnType<LanguageServerPlugin> => ({
	extraFileExtensions: [{ extension: 'mdx', isMixedContent: true, scriptKind: 7 }],
	resolveConfig(config) {

		// languages
		config.languages ??= {};
		config.languages.mdx ??= language;

		// services
		config.services ??= {};
		config.services.typescript ??= createTypescriptService();
		config.services.md ??= (context): ReturnType<Service> => ({
			provideDiagnostics(document) {
				const [file] = context!.documents.getVirtualFileByUri(document.uri)
				if (!(file instanceof MDFile)) return;
				
				const errors: Diagnostic[] = [];
				// TODO
				return errors
			}
		})

		/*
		config.services.html1 ??= (context): ReturnType<Service> => ({
			provideDiagnostics(document) {

				const [file] = context!.documents.getVirtualFileByUri(document.uri);
				if (!(file instanceof Html1File)) return;

				const styleNodes = file.htmlDocument.roots.filter(root => root.tag === 'style');
				if (styleNodes.length <= 1) return;

				const errors: Diagnostic[] = [];
				for (let i = 1; i < styleNodes.length; i++) {
					errors.push({
						severity: 2,
						range: {
							start: file.document.positionAt(styleNodes[i].start),
							end: file.document.positionAt(styleNodes[i].end),
						},
						source: 'html1',
						message: 'Only one style tag is allowed.',
					});
				}
				return errors;
			},
		});
		*/

		return config;
	},
});

startLanguageServer(createConnection(), plugin);
