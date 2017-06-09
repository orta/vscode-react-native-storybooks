import createChannel from "@storybook/channel-websocket";
import * as vscode from "vscode";

import * as WebSocket from "ws";
const g = global as any;
g.WebSocket = WebSocket;

import { StoryTreeProvider } from "./tree-provider";

var storybooksChannel: any;

export function activate(context: vscode.ExtensionContext) {
  let previewUri = vscode.Uri.parse("storybook://authority/preview");
  class TextDocumentContentProvider
    implements vscode.TextDocumentContentProvider {
    public provideTextDocumentContent(uri: vscode.Uri): string {
      const port = vscode.workspace
        .getConfiguration("react-native-storybooks")
        .get("port");
      const host = vscode.workspace
        .getConfiguration("react-native-storybooks")
        .get("host");

      return `
            <style>iframe {
                position: fixed;
                border: none;
                top: 0; right: 0;
                bottom: 0; left: 0;
                width: 100%;
                height: 100%;
            }
            </style>

            <body onload="iframe.document.head.appendChild(ifstyle)" style="background-color:red;margin:0px;padding:0px;overflow:hidden">
                <iframe src="http://${host}:${port}" frameborder="0"></iframe>
                <p>If you're seeing this, something is wrong :) (can't find server at ${host}:${port})</p>
            </body>
            `;
    }
  }

  let provider = new TextDocumentContentProvider();
  let registration = vscode.workspace.registerTextDocumentContentProvider(
    "storybook",
    provider
  );

  const storiesProvider = new StoryTreeProvider();
  vscode.window.registerTreeDataProvider("storybook", storiesProvider);

  // Registers the storyboards command to trigger a new HTML preview which hosts the storybook server
  let disposable = vscode.commands.registerCommand(
    "extension.showStorybookPreview",
    () => {
      return vscode.commands
        .executeCommand(
          "vscode.previewHtml",
          previewUri,
          vscode.ViewColumn.Two,
          "Storybooks"
        )
        .then(
          success => {},
          reason => {
            vscode.window.showErrorMessage(reason);
          }
        );
    }
  );

  context.subscriptions.push(disposable, registration);

  const host = vscode.workspace
    .getConfiguration("react-native-storybooks")
    .get("host");
  const port = vscode.workspace
    .getConfiguration("react-native-storybooks")
    .get("port");

  storybooksChannel = createChannel({ url: `ws://${host}:${port}` });
  var currentKind: string = null;
  var currentStory: string = null;

  // So when we re-connect, callbacks can happen on the new socket connection
  const registerCallbacks = channel => {
    // Called when we get stories from the RN client
    channel.on("setStories", data => {
      storiesProvider.stories = data.stories;
      storiesProvider.refresh();
    });

    // When the server in RN starts up, it asks what should be default
    channel.on("getCurrentStory", () => {
      setTimeout(() => {
        storybooksChannel.emit("setCurrentStory", {
          kind: currentKind,
          story: currentStory
        });
      }, 30);
    });

    // The React Native server has closed
    channel._transport._socket.onclose = () => {
      storiesProvider.stories = [];
      storiesProvider.refresh();
    };

    channel.emit("getStories");
  };
  registerCallbacks(storybooksChannel);

  // Allow clicking, and keep state on what is selected
  vscode.commands.registerCommand("extension.openStory", (section, story) => {
    currentKind = section.kind;
    currentStory = story;
    const currentChannel = () => storybooksChannel;
    currentChannel().emit("setCurrentStory", { kind: section.kind, story });
  });

  vscode.commands.registerCommand(
    "extension.restartConnectionToStorybooks", () => {
      storybooksChannel = createChannel({ url: `ws://${host}:${port}` });
      registerCallbacks(storybooksChannel);
    }
  );

  // These are a bit alpha-y, as I don't think I can control what is showing as selected inside the VS Code UI
  vscode.commands.registerCommand("extension.goToNextStorybook", () => {
    const stories = storiesProvider.stories
    const currentSection = stories.find(s => s.kind === currentKind)
    const currentStories = currentSection.stories
    const currentIndex = currentStories.indexOf(currentStory)
    if (currentIndex === currentStories.length){
      // go around or something
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[0])
    } else {
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex+1])
    }
  })

  vscode.commands.registerCommand("extension.goToPreviousStorybook", () => {
    const stories = storiesProvider.stories
    const currentSection = stories.find(s => s.kind === currentKind)
    const currentStories = currentSection.stories
    const currentIndex = currentStories.indexOf(currentStory)
    if (currentIndex === 0){
      // go around or something
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentStories.length -1])

    } else {
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex-1])
    }
  })
}

export function deactivate() {
  storybooksChannel._transport._socket.close();
}
