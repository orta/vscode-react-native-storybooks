import * as assert from "assert"
import { StoryTreeProvider } from "../src/tree-provider"
import { StoryPickerProvider } from "../src/picker-provider"

const data = [
  {
    kind: "Button",
    stories: [
      { id: "primary", name: "primary" },
      { id: "hollow", name: "hollow" },
      { id: "link", name: "link" },
      { id: "default", name: "default" }
    ]
  },
  {
    kind: "Modal",
    stories: [{ id: "modal_default", name: "default" }]
  },
  {
    kind: "Accordion",
    stories: [{ id: "expanded", name: "expanded" }, { id: "collapsed", name: "collapsed" }]
  }
]

const treeProvider = new StoryTreeProvider()

suite("StoryPickerProvider", () => {
  test("that it flattens stories into a string array", () => {
    const picker = new StoryPickerProvider(treeProvider)
    picker.stories = data
    const expected = [
      "Accordion - collapsed",
      "Accordion - expanded",
      "Button - default",
      "Button - hollow",
      "Button - link",
      "Button - primary",
      "Modal - default"
    ]
    assert.deepEqual(expected, picker.toList())
  })

  test("that it provider setCurrentStory option for picked string", () => {
    const picker = new StoryPickerProvider(treeProvider)
    picker.stories = data
    const parts = picker.getParts("Button - default")
    assert.deepEqual({ kind: "Button", story: "default" }, parts)
  })
})
