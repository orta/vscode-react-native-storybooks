import * as vscode from 'vscode'
import { Story, StoryTreeProvider } from './tree-provider'

const delimiter = ' - '

export interface StorySelection {
  kind: string
  story: string
}

export class StoryPickerProvider {
  stories: Story[]
  storyList: string[]

  public static delimiter = ' - '

  constructor(storiesProvider: StoryTreeProvider) {
    storiesProvider.onDidChangeTreeData(story => {
      const { stories } = storiesProvider
      this.stories = stories
    })
  }

  getParts(pickerResult: string): StorySelection {
    const [kind, story] = pickerResult.split(StoryPickerProvider.delimiter)
    return { kind, story }
  }

  flattenStories(): string[] {
    if (!this.stories) return
    const unsorted = this.stories.reduce((list, section) => {
      const group = section.kind
      const stories = section.stories.map(story => `${group}${delimiter}${story}`)
      return list.concat(stories)
    }, [])

    return unsorted.sort()
  }

  toList(): string[] {
    return this.flattenStories()
  }
}

