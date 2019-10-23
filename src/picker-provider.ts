import * as vscode from "vscode"
import { Story, StoryObj, StoryTreeProvider } from "./tree-provider"

export interface StorySelection {
  kind: string
  story: string
  storyId: string
}

export class StoryPickerProvider {
  stories: Story[]
  storyList: StoryObj[]

  public static delimiter = " - "
  public static delimiterId = "--"

  constructor(storiesProvider: StoryTreeProvider) {
    storiesProvider.onDidChangeTreeData(story => {
      const { stories } = storiesProvider
      this.stories = stories
    })
  }

  getParts(pickerResult: string): StorySelection {
    const [kind, story] = pickerResult.split(StoryPickerProvider.delimiter)
    const storyId = `${kind.toLowerCase()}${StoryPickerProvider.delimiterId}${story.toLowerCase().replace(/ /g, "-")}`
    return { kind, story, storyId }
  }

  flattenStories(): string[] {
    if (!this.stories) return
    const unsorted = this.stories.reduce((list, section) => {
      const group = section.kind
      const stories = section.stories.map(story => `${group}${StoryPickerProvider.delimiter}${story.name}`)
      return list.concat(stories)
    }, [])

    return unsorted.sort()
  }

  toList(): string[] {
    return this.flattenStories()
  }
}
