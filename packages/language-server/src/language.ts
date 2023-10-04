import { FileCapabilities, FileKind, FileRangeCapabilities, Language, VirtualFile } from '@volar/language-core';
import type * as ts from 'typescript/lib/tsserverlibrary';

export const language: Language<MDFile> = {
	createVirtualFile(fileName, snapshot) {
		if (fileName.endsWith('.mdx')) {
			return new MDFile(fileName, snapshot);
		}
	},
	updateVirtualFile(mdFile, snapshot) {
		mdFile.update(snapshot);
	},
};

// const mdLs = createMDLanguageServer();

export class MDFile implements VirtualFile {
	kind = FileKind.TextFile;
	capabilities = FileCapabilities.full;
	codegenStacks = [];

	fileName!: string;
	mappings!: VirtualFile['mappings'];
	embeddedFiles!: VirtualFile['embeddedFiles'];

	constructor(
		public sourceFileName: string,
		public snapshot: ts.IScriptSnapshot,
	) {
		this.fileName = sourceFileName + '.html';
		this.onSnapshotUpdated();
	}

	public update(newSnapshot: ts.IScriptSnapshot) {
		this.snapshot = newSnapshot;
		this.onSnapshotUpdated();
	}

	onSnapshotUpdated() {
		this.mappings = [{
			sourceRange: [0, this.snapshot.getLength()],
			generatedRange: [0, this.snapshot.getLength()],
			data: FileRangeCapabilities.full,
		}];
		this.embeddedFiles = [];
	}
}
