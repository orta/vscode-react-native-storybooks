import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface Story {
  kind: string
  stories: string[]
}

export class StoryTreeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;
  
  stories: Story[]

	constructor() {
		this.stories = []
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(story?: Dependency): Thenable<Dependency[]> {

		return new Promise(resolve => {
			if (story) {
        // Show stories for a section
				const section = this.stories.find(s => s.kind === story.contextValue)
				if (section){
					const deps = section.stories.map(s => new Dependency(s, vscode.TreeItemCollapsibleState.None, s, {
						command: 'extension.openStory',
						title: '',
						arguments: [section, s],
					}))
					resolve(deps);
				} else { 
					resolve([])
				}

			} else {
				// All sections
        const deps = this.stories.map(s => new Dependency(s.kind, vscode.TreeItemCollapsibleState.Expanded, s.kind))
        resolve(deps)
			}
		});
	}

}

class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly storyKind: string,
		public readonly command?: vscode.Command,
	) {
		super(label, collapsibleState);
	}

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = this.storyKind;
}
