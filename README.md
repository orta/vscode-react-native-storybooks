# React Native Storybook

Select storybooks inside your editor.

![https://github.com/orta/vscode-react-native-storybooks/raw/master/preview.gif](https://github.com/orta/vscode-react-native-storybooks/raw/master/preview.gif)

## How do I use it?

Install it, ensure that the configuration is right. You should see a new section under the files in the Explorer panel called "Storybook".

🎉

If your react-native server crashes, use the command "Reconnect Storybook to VS Code" to re-connect.

## What does it do?

-   Connect to the React Native storybooks web socket.
-   Single click a story to open it in your simulator.
-   Double click to open story in your editor.

## Configuration

-   `react-native-storybooks.host`: string (default: `"localhost"`)
-   `react-native-storybooks.port`: number (default: `9001`)
-   `react-native-storybooks.storyRegex`: string (default: `"**/*.story.*"`)

You can either change these in your user settings, or per-project you can create a `.vscode/settings.json` file and add them there.

## Known Issues

Nothing critical ATM.
