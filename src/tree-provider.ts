import * as vscode from "vscode"
import * as fs from "fs"
import * as path from "path"

export interface Story {
  kind: string
  stories: StoryObj[]
}

export interface StoryObj {
  id: string
  name: string
}

export class StoryTreeProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<
    Dependency | undefined
  >()
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event

  stories: Story[]
  initialCollapsibleState: number

  constructor() {
    this.stories = []
    this.initialCollapsibleState = vscode.TreeItemCollapsibleState.Expanded
  }

  collapseAll(): void {
    this.initialCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
    this.refresh()
  }

  expandAll(): void {
    this.initialCollapsibleState = vscode.TreeItemCollapsibleState.Expanded
    this.refresh()
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element
  }

  getChildren(story?: Dependency): Thenable<Dependency[]> {
    return new Promise(resolve => {
      if (story) {
        // Show stories for a section
        const section = this.stories.find(s => s.kind === story.contextValue)
        if (section) {
          const deps = section.stories.map(
            s =>
              new Dependency(s.name, vscode.TreeItemCollapsibleState.None, s.name, {
                command: "extension.openStory",
                title: "",
                arguments: [section, s]
              })
          )
          resolve(deps)
        } else {
          resolve([])
        }
      } else {
        // All sections
        const deps = this.stories.map(s => new Dependency(s.kind, this.initialCollapsibleState, s.kind))
        resolve(deps)
      }
    })
  }
}

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly storyKind: string,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState)
  }

  iconPath = {
    light: path.join(__filename, "..", "..", "..", "resources", "light", "dependency.svg"),
    dark: path.join(__filename, "..", "..", "..", "resources", "dark", "dependency.svg")
  }

  contextValue = this.storyKind
}
